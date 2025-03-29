const { DataTypes } = require('sequelize');

const PageModel = {
  displayname: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  path: DataTypes.TEXT,
  active: {
    type: DataTypes.BOOLEAN,

    defaultValue: true,
  }
};

module.exports = { PageModel };