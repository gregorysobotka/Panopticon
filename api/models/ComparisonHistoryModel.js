const { DataTypes } = require('sequelize');

const ComparisonHistoryModel = {
  companyid: DataTypes.INTEGER,
  siteid: DataTypes.INTEGER,
  companyname: DataTypes.TEXT,
  sitename: DataTypes.TEXT,
  basegroupid: DataTypes.TEXT,
  compgroupid: DataTypes.TEXT,
  location: DataTypes.TEXT,
  language: DataTypes.TEXT,
  environment: DataTypes.TEXT,
  basecapturetime: DataTypes.TEXT, 
  compcapturetime: DataTypes.TEXT
};

module.exports = { ComparisonHistoryModel };