import Sequelize from 'sequelize';

const sequelize = new Sequelize('users', 'user', 'password', {
    host: './dev.sqlite',
    dialect: 'sqlite',
  });
  
export default sequelize;
  