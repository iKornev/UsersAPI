import { Sequelize } from 'sequelize'
import sequelize from '../config/sequelize-config'

const User = sequelize.define('User', {
  patronymic: {
    type: Sequelize.STRING,
    defaultValue: 1,
  },
  firstName: {
    type: Sequelize.STRING,
    defaultValue: 1,
  },
  lastName: {
    type: Sequelize.STRING,
    defaultValue: 1,
  },
  password: {
    type: Sequelize.STRING,
    defaultValue: 1,
  },
  login: {
    type: Sequelize.STRING,
    defaultValue: 1,
  },
  imageSrc: {
    type: Sequelize.STRING,
    defaultValue: null,
  },
})

export default User
