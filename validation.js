//validation
const Joi = require("@hapi/joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    role: Joi.string().required(),
    student_code: Joi.string().min(6).required(),
    date_of_birth: Joi.string().required(),
  });

  return schema.validate(data)
};


const loginValidation = (data) => {
    const schema = Joi.object({
      email: Joi.string().min(6).required().email(),
      password: Joi.string().min(6).required(),
    });
  
    return schema.validate(data)
  };

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
