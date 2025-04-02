const { Sequelize, DataTypes } = require('sequelize');

const { CompanyModel } = require('./CompanyModel');
const { SiteModel } = require('./SiteModel');
const { PageModel } = require('./PageModel');
const { CaptureSpecsModel } = require('./CaptureSpecsModel');
const { PageCaptureModel } = require('./PageCaptureModel');
const { ComparisonHistoryModel } = require('./ComparisonHistoryModel');

const DB_ENGINE = process.env.DB_ENGINE || 'sqlite';
const sequelizeConfig = { dialect: '' };

let dbUser = null;
let dbPass = null;
let dbName = null;

if(DB_ENGINE == 'postgres') {
  // configure sequelize object for postgres
  dbUser = process.env.DB_USER;
  dbPass = process.env.DB_PASSWORD;
  dbName = process.env.DB_NAME;
  sequelizeConfig.dialect = 'postgres';
  sequelizeConfig.host = process.env.DB_HOST;
} else {
  // configure sequelize object for sqlite
  sequelizeConfig.dialect = 'sqlite';
  sequelizeConfig.storage = './database.sqlite';
} 

// DB Connection
const sequelize = new Sequelize(dbName, dbUser, dbPass, sequelizeConfig);

// DB Models
const Company = sequelize.define('company', CompanyModel);
const Site = sequelize.define('site', SiteModel);
const Page = sequelize.define('page', PageModel);
const CaptureSpecs = sequelize.define('capturespecs', CaptureSpecsModel);
const PageCapture = sequelize.define('pagecapture', PageCaptureModel);
const ComparisonHistory = sequelize.define('comparisonhistory', ComparisonHistoryModel);

const PageCaptureSpecs = sequelize.define('pagecapturespecs', {
  pid: {
    type: DataTypes.INTEGER,
    references: {
      model: Page, 
      key: 'id',
    },
  },
  sid: {
    type: DataTypes.INTEGER,
    references: {
      model: CaptureSpecs,
      key: 'id',
    },
  },
});


Company.hasMany(Site);
Site.belongsTo(Company);

Site.hasMany(Page);
Page.belongsTo(Site);

Page.hasMany(CaptureSpecs);
CaptureSpecs.belongsToMany(Page, { through: PageCaptureSpecs });

(async () => {
  const forceSync = false;
  await sequelize.sync({ force: forceSync });
  console.log('Running Sequelize Forced Sync:', forceSync);
})();

/*

*/

// export default sequelize;
module.exports = {
  sequelize,
  Company,
  Site,
  Page,
  CaptureSpecs,
  PageCapture,
  ComparisonHistory
};