const { DataTypes } = require("sequelize");
const sequelize = require("../connectToMSSQL.js");

const Dim_Order = sequelize.define("Dim_Order", {
  Order_key: {
    type: DataTypes.STRING(50),
    allowNull: false,
    primaryKey: true,
  },
  Delivery_method: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  Payment_method: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  Status: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  tableName: "Dim_Order",
  timestamps: false,
});

module.exports = Dim_Order;
