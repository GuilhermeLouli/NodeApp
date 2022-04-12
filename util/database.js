const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodeapp', 'root', 'nodeapp', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;