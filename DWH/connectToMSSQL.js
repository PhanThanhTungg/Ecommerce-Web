const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('WHHTTTQL', 'sa', '123456', {
  dialect: 'mssql',
  host: 'localhost',
  port: 1433,
  dialectOptions: {
    options: {
      instanceName: 'SERVER_HANOI',
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