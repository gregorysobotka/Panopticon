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
  displayname: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
});

const Site = sequelize.define('site', {
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
});

const Page = sequelize.define('page', {
  displayname: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  path: DataTypes.TEXT,
  active: {
    type: DataTypes.BOOLEAN,

    defaultValue: true,
  }
});

const CaptureSpecs = sequelize.define('capturespecs', {
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

/*

  Decided to not maintain link to company/site/page models.

  Reasons:
  - Wanted to treat results as unique, separate data
  - Focus on getting MVP running

*/

const PageCapture = sequelize.define('pagecapture', {
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
  imageurl: DataTypes.TEXT,
  location: DataTypes.TEXT,
  language: DataTypes.TEXT,
  environment: DataTypes.TEXT,
  width: DataTypes.INTEGER,
  height: DataTypes.INTEGER, 
  delay: DataTypes.INTEGER,
  year: DataTypes.INTEGER, 
  month: DataTypes.INTEGER,
  day: DataTypes.INTEGER,
  hour: DataTypes.INTEGER,
  minute: DataTypes.INTEGER
});

const PageCaptureResult = sequelize.define('pagecaptureresult', {
  companyname: DataTypes.TEXT,
  basecaptureid: DataTypes.TEXT,
  compcaptureid: DataTypes.TEXT,
  siteid: DataTypes.INTEGER,
  pageid: DataTypes.INTEGER,
  fullurl: DataTypes.TEXT,
  imageurl: DataTypes.TEXT,
});

const ComparisonHistory = sequelize.define('comparisonhistory', {
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
});

const PageCaptureDiffs = sequelize.define('pagecapturediffs', {
  pcid: {
    type: DataTypes.INTEGER,
    references: {
      model: PageCapture, 
      key: 'id',
    },
  },
  pcrid: {
    type: DataTypes.INTEGER,
    references: {
      model: PageCaptureResult,
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

PageCapture.hasMany(PageCaptureResult);
PageCaptureResult.belongsToMany(PageCapture, { through: PageCaptureDiffs });

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
  PageCaptureResult,
  ComparisonHistory
};