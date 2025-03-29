const { DataTypes } = require('sequelize');

const SiteModel = {
  displayname: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  url: DataTypes.TEXT,
  location: DataTypes.TEXT,
  language: DataTypes.TEXT,
  environment: DataTypes.TEXT,
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
};

module.exports = { SiteModel };