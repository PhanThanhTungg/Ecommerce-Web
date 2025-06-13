const { DataTypes } = require("sequelize");
const sequelize = require("../connectToMSSQL.js");

const Dim_Customer = sequelize.define("Dim_Customer", {
  Customer_key: {
    type: DataTypes.STRING(50),
    allowNull: false,
    primaryKey: true,
  },
  Customer_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Gender: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  Type: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
}, {
  tableName: "Dim_Customer",
  timestamps: false,
});

module.exports = Dim_Customer;
