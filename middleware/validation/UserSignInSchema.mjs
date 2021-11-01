import Joi from 'joi'

const userSignInSchema = Joi.object({
  password: Joi.string().required().trim(false).min(6).max(50),
  login: Joi.string().required().max(129).email(),
})

export default userSignInSchema
