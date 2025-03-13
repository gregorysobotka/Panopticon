const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

/*
Production:

    const sequelize = new Sequelize('database', 'username', 'password', {
      host: 'localhost',
      dialect: 'postgres'
    });

*/

const Company = sequelize.define('company', {
  name: DataTypes.TEXT,
  // sites: DataTypes.TEXT,
});

const Site = sequelize.define('site', {
  url: DataTypes.TEXT,
  location: DataTypes.TEXT,
  language: DataTypes.TEXT,
  environment: DataTypes.TEXT,
});

const Page = sequelize.define('page', {
  path: DataTypes.TEXT
});

const CaptureSpecs = sequelize.define('capturespecs', {
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
  displayname: DataTypes.TEXT,
  description: DataTypes.TEXT
});

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
// Removing association for now


(async () => {
  const forceSync = false;
  await sequelize.sync({ force: forceSync });
  console.log('Running Sequelize Forced Sync:', forceSync);
})();

/*

This model requires to be decompisition ...

- Company (brand)
-- location
--- environment
---- languages

*/

// export default sequelize;
module.exports = {
  sequelize,
  Company,
  Site,
  Page,
  CaptureSpecs
};