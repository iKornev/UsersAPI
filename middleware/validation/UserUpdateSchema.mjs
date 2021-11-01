import Joi from 'joi'

const UserUpdateSchema = Joi.object({
  patronymic: Joi.string().required().min(1).max(30),
  firstName: Joi.string().required().min(1).max(50).trim(),
  lastName: Joi.string().required().min(1).max(50).trim(),
})

export default UserUpdateSchema
