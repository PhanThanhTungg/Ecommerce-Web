const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('WHHTTTQL', 'sa', process.env.MSSQL_SA_PASSWORD, {
  dialect: 'mssql',
  host: 'localhost',
  port: '1609',
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
    }
  }
}); 

sequelize.authenticate().then(() => {
  console.log('Connection mssql has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect mssql to the database: ', error);
});

module.exports = sequelize;