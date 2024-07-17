const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Operation = sequelize.define('Operation', {
  expression: {
    type: DataTypes.STRING,
    allowNull: false
  },
  result: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});


sequelize.sync();

module.exports = { sequelize, Operation };
