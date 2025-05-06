const { DataTypes } = require("sequelize");
const sequelize = require("../connectToMSSQL.js");

const Dim_Customer = require("./Dim_Customer.model.js");
const Dim_Product = require("./Dim_Product.model.js");
const Dim_Location = require("./Dim_Location.model.js");
const Dim_Time = require("./Dim_Time.model.js");

const Fact_Sale = sequelize.define("Fact_Sale", {
  Customer_key: {
    type: DataTypes.STRING(50),
    allowNull: false,
    primaryKey: true,
    references: {
      model: Dim_Customer,
      key: "Customer_key",
    },
  },
  Product_key: {
    type: DataTypes.STRING(50),
    allowNull: false,
    primaryKey: true,
    references: {
      model: Dim_Product,
      key: "Product_key",
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
    allowNull: false,
    primaryKey: true,
    references: {
      model: Dim_Time,
      key: "Time_key",
    },
  },
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Discount_percent: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  Revenue: {
    type: DataTypes.DECIMAL(18, 2),
    allowNull: true,
  },
}, {
  tableName: "Fact_Sale",
  timestamps: false,
});

// Associations
Fact_Sale.belongsTo(Dim_Customer, { foreignKey: "Customer_key", targetKey: "Customer_key" });
Fact_Sale.belongsTo(Dim_Product, { foreignKey: "Product_key", targetKey: "Product_key" });
Fact_Sale.belongsTo(Dim_Location, { foreignKey: "Location_key", targetKey: "Location_key" });
Fact_Sale.belongsTo(Dim_Time, { foreignKey: "Time_key", targetKey: "Time_key" });

module.exports = Fact_Sale;
