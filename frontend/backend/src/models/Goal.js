const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Goal = sequelize.define('Goal', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  targetAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  targetDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  monthlyContribution: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
});

module.exports = Goal;