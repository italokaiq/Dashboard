const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Simulation = sequelize.define('Simulation', {
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
  targetMonths: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  monthlyIncome: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  monthlyExpenses: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  monthlySavings: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  isViable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Simulation;