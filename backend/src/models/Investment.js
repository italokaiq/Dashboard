const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Investment = sequelize.define('Investment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('acao', 'fundo', 'renda_fixa', 'cripto', 'outros'),
    allowNull: false
  },
  totalInvested: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  currentValue: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
});

module.exports = Investment;