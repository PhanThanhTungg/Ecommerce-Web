const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('WHHTTTQL', 'sa', '123456', {
  dialect: 'mssql',
  host: '0.tcp.ap.ngrok.io',
  port: 17984,
  dialectOptions: {
    options: {
      // instanceName: 'SQLWH',
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