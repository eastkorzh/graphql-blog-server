const { DataSource } = require('apollo-datasource');
const { UserInputError, AuthenticationError } = require('apollo-server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { validateRegister, validateLogin } = require('../utils/validation');

class AuthAPI extends DataSource {
  async register({ name, email, password }) {
    // Validate user form
    const { error } = validateRegister({ name, email, password });
    
    if (error) throw new UserInputError(error.message)

    // Check by email is user exists
    const findedUser = await User.findOne({ email })

    if (findedUser !== null) throw new AuthenticationError(`User with email '${email}' is already exists`)

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    // Create and assign token
    const token = jwt.sign({ _id: savedUser._id }, process.env.SECRET_TOKEN);

    return {
      ...savedUser._doc,
      token
    };
  }

  async login({ email, password }) {
    // Validate user form
    const { error } = validateLogin({ email, password });

    if (error) throw new UserInputError(error.message)

    // Check by email is user exists
    const errMessage = 'Email or password is wrong';

    const findedUser = await User.findOne({ email });
    if (findedUser === null) throw new AuthenticationError(errMessage);

    // Check password
    const isValidPassword = await bcrypt.compare(password, findedUser.password);
    if (!isValidPassword) throw new AuthenticationError(errMessage);

    // Create and assign token
    const token = jwt.sign({ _id: findedUser._id }, process.env.SECRET_TOKEN);

    // Success
    return { 
      ...findedUser._doc,
      token
    }
  }
}

module.exports = AuthAPI;
