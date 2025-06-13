const { DataTypes } = require("sequelize");
const sequelize = require("../connectToMSSQL.js");

const Dim_Order = require("./Dim_Order.model.js");
const Dim_Customer = require("./Dim_Customer.model.js");
const Dim_Location = require("./Dim_Location.model.js");
const Dim_Time = require("./Dim_Time.model.js");

const Fact_Order = sequelize.define("Fact_Order", {
  Order_key: {
    type: DataTypes.STRING(50),
    allowNull: false,
    primaryKey: true,
    references: {
      model: Dim_Order,
      key: "Order_key",
    },
  },
  Customer_key: {
    type: DataTypes.STRING(50),
    allowNull: true,
    references: {
      model: Dim_Customer,
      key: "Customer_key",
    },
  },
  Location_key: {
    type: DataTypes.STRING(50),
    allowNull: true,
    references: {
      model: Dim_Location,
      key: "Location_key",
    },
  },
  Time_key: {
    type: DataTypes.STRING(50),
    allowNull: true,
    references: {
      model: Dim_Time,
      key: "Time_key",
    },
  },
  Total_qty_product: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Shipping_fee: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true,
  },
  Total_price: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true,
  },
}, {
  tableName: "Fact_Order",
  timestamps: false,
});

// Associations
Fact_Order.belongsTo(Dim_Order, { foreignKey: "Order_key", targetKey: "Order_key" });
Fact_Order.belongsTo(Dim_Customer, { foreignKey: "Customer_key", targetKey: "Customer_key" });
Fact_Order.belongsTo(Dim_Location, { foreignKey: "Location_key", targetKey: "Location_key" });
Fact_Order.belongsTo(Dim_Time, { foreignKey: "Time_key", targetKey: "Time_key" });

module.exports = Fact_Order;
