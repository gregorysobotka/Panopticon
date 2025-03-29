const { DataTypes } = require('sequelize');

const CompanyModel = {
    displayname: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
};

module.exports = { CompanyModel };