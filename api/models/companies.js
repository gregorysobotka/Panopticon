import { Sequelize, Model, DataTypes } from 'sequelize';

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
  location: DataTypes.TEXT,
  language: DataTypes.TEXT,
  environment: DataTypes.TEXT,
  url: DataTypes.TEXT,
  company: DataTypes.TEXT,

});

// (async () => {
//   await Company.sync({ force: true });
//   console.log(' ****** Running seq ******')
// })();

// Company.create({
//   company: "test"
// }).then(res => {
//   console.log(res)
// }).catch((error) => {
//   console.error('Failed to create a new record : ', error);
// });

/*

This model requires to be decompisition ...

- Company (brand)
-- location
--- environment
---- languages

*/

export default Company;