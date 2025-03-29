const { DataTypes } = require('sequelize');

const CaptureSpecsModel = {
  displayname: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  width: {
    type: DataTypes.INTEGER,
    allowNull: false
  
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  delay: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  browser: {
    type: DataTypes.TEXT,
    defaultValue: 'firefox',
  },
  displayname: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: DataTypes.TEXT
};

module.exports = { CaptureSpecsModel };