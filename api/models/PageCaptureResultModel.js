const { DataTypes } = require('sequelize');

const PageCaptureResultModel = {
  companyname: DataTypes.TEXT,
  basecaptureid: DataTypes.TEXT,
  compcaptureid: DataTypes.TEXT,
  siteid: DataTypes.INTEGER,
  pageid: DataTypes.INTEGER,
  fullurl: DataTypes.TEXT,
  imageurl: DataTypes.TEXT,
};

module.exports = { PageCaptureResultModel };

/*

  Decided not to maintain link to company/site/page models.

  Reasons:
  - Wanted to treat results as unique, separate data
  - Focus on getting MVP running

*/