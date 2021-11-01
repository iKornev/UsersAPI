import Joi from 'joi'

const userSignUpSchema = Joi.object({
  patronymic: Joi.string().required().min(1).max(30),
  firstName: Joi.string().required().min(1).max(50).trim(),
  lastName: Joi.string().required().min(1).max(50).trim(),
  password: Joi.string().required().trim(false).min(6).max(50),
  login: Joi.string().required().max(129).email(),
})

export default userSignUpSchema
