const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Debt = sequelize.define('Debt', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  remainingAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  monthlyPayment: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  interestRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'paid', 'overdue'),
    defaultValue: 'active'
  }
});

module.exports = Debt;