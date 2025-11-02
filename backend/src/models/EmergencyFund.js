const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EmergencyFund = sequelize.define('EmergencyFund', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  targetAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  monthlyExpenses: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  targetMonths: {
    type: DataTypes.INTEGER,
    defaultValue: 6
  }
});

module.exports = EmergencyFund;