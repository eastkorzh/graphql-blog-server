const Joi = require('@hapi/joi');

const nameMask = Joi.string().min(2).required();
const emailMask = Joi.string().min(4).required().email();
const passwordMask = Joi.string().min(4).required();

const validateName = (name) => {
  const schema = Joi.object({
    name: nameMask,
  });

  return schema.validate({ name })
}

const validateEmail = (email) => {
  const schema = Joi.object({
    email: emailMask,
  });

  return schema.validate({ email })
}

const validatePassword = (password) => {
  const schema = Joi.object({
    password: passwordMask,
  });

  return schema.validate({ password })
}

const validateRegister = (data) => {
  const schema = Joi.object({
    name: nameMask,
    email: emailMask,
    password: passwordMask,
  });

  return schema.validate(data);
}

const validateLogin = (data) => {
  const schema = Joi.object({
    email: emailMask,
    password: passwordMask,
  });

  return schema.validate(data);
}

module.exports.validateRegister = validateRegister;
module.exports.validateLogin = validateLogin;
module.exports.validateName = validateName;
module.exports.validateEmail = validateEmail;
module.exports.validatePassword = validatePassword;
