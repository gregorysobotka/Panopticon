const { DataTypes } = require('sequelize');

const PageCaptureModel = {
  groupid: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  companyname: DataTypes.TEXT,
  sitename: DataTypes.TEXT,
  pagename: DataTypes.TEXT,
  companyid: DataTypes.INTEGER,
  siteid: DataTypes.INTEGER,
  pageid: DataTypes.INTEGER,
  fullurl: DataTypes.TEXT,
  filename: DataTypes.TEXT,
  location: DataTypes.TEXT,
  language: DataTypes.TEXT,
  environment: DataTypes.TEXT,
  width: DataTypes.INTEGER,
  height: DataTypes.INTEGER,
  specid: DataTypes.INTEGER,
  delay: DataTypes.INTEGER,
  year: DataTypes.INTEGER, 
  month: DataTypes.INTEGER,
  day: DataTypes.INTEGER,
  hour: DataTypes.INTEGER,
  minute: DataTypes.INTEGER
};

module.exports = { PageCaptureModel };

/*

  Decided not to maintain link to company/site/page models.

  Reasons:
  - Wanted to treat results as unique, separate data
  - Focus on getting MVP running

*/