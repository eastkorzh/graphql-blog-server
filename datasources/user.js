const { DataSource } = require('apollo-datasource');
const { UserInputError } = require('apollo-server');
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;

const User = require('../models/User');
const verify = require('../utils/verifyToken');
const { validateName, validateEmail, validatePassword } = require('../utils/validation');

class UserAPI extends DataSource {
  initialize(config) {
    this.token = config.context.token;
  }
  
  async getAllUsers() {
    const users = await User.find();

    return users;
  }

  async getUser(id) {
    const user = await User.findById(id).populate('posts');

    return user;
  }

  async getLoggedUser() {
    const token = verify(this.token);
    
    const user = await User.findById(token._id).populate('posts');

    return user;
  }

  async updateUserName({ newName }) {
    const { error } = validateName(newName)

    if (error) throw new UserInputError(error.message);

    const token = verify(this.token);
    
    await User.updateOne(
      { _id: token._id },
      { $set: { name: newName } }
    );

    const updatedUser = await User.findById(token._id)

    return updatedUser;
  }

  async updateUserEmail({ newEmail }) {
    const { error } = validateEmail(newEmail)
    if (error) throw new UserInputError(error.message);

    const token = verify(this.token);

    const findedUser = await User.findOne({ email: newEmail })
    if (findedUser !== null) throw new UserInputError(`User with email '${newEmail}' is already exists`)
    
    await User.updateOne(
      { _id: token._id },
      { $set: { email: newEmail } }
    );

    const updatedUser = await User.findById(token._id)

    return updatedUser;
  }

  async updateUserPassword({ oldPassword ,newPassword }) {
    if (oldPassword === newPassword) throw new UserInputError('New password is equal the old one');

    const { error } = validatePassword(newPassword)
    if (error) throw new UserInputError(error.message);

    const token = verify(this.token);

    const findedUser = await User.findById(token._id)

    const isValidPassword = await bcrypt.compare(oldPassword, findedUser.password);
    if (!isValidPassword) throw new UserInputError('Password is wrong');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const isUpdated = await User.updateOne(
      { _id: token._id },
      { $set: { password: hashedPassword } }
    );

    return findedUser;
  }

  async updateUserAvatar({ file }) {
    const token = verify(this.token);

    const { createReadStream } = await file;

    const stream = createReadStream();

    const user = await User.findById(token._id)
    if (user.avatar) {
      const public_id = user.avatar.split('/')[7].split('.')[0];

      await cloudinary.uploader.destroy(public_id);
    }

    const url = await new Promise((resolve, reject) => {

      const upload_stream = cloudinary.uploader.upload_stream({ 
        tags: 'avatar', 
        gravity: "face", 
        height: 250, 
        width: 250, 
        crop: "fill" 
      }, (err, image) => {
        resolve(image.url)
      });

      // If there's an error writing the file, remove the partially written file
      // and reject the promise.
      upload_stream.on('error', error => reject(error));
  
      // In node <= 13, errors are not automatically propagated between piped
      // streams. If there is an error receiving the upload, destroy the write
      // stream with the corresponding error.
      stream.on('error', error => upload_stream.destroy(error))
  
      stream.pipe(upload_stream)
    })

    if (!url) throw new UserInputError('Something went wrong. Please, try again')

    await User.updateOne(
      { _id: token._id },
      { $set: { avatar: url } }
    );

    return {
      ...user._doc,
      avatar: url
    };
  }
}

module.exports = UserAPI;
