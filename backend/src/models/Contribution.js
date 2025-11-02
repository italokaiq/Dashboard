const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Investment = require('./Investment');

const Contribution = sequelize.define('Contribution', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  investmentId: {
    type: DataTypes.INTEGER,
    references: {
      model: Investment,
      key: 'id'
    }
  }
});

Contribution.belongsTo(Investment, { foreignKey: 'investmentId' });
Investment.hasMany(Contribution, { foreignKey: 'investmentId' });

module.exports = Contribution;