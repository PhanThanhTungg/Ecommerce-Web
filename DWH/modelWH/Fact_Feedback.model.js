const { DataTypes } = require("sequelize");
const sequelize = require("../connectToMSSQL.js");

const Dim_Product = require("./Dim_Product.model.js");
const Dim_Customer = require("./Dim_Customer.model.js");
const Dim_Time = require("./Dim_Time.model.js");

const Fact_Feedback = sequelize.define("Fact_Feedback", {
  Feedback_key: {
    type: DataTypes.STRING(50),
    allowNull: false,
    primaryKey: true,
  },
  Product_key: {
    type: DataTypes.STRING(50),
    allowNull: true,
    references: {
      model: Dim_Product,
      key: "Product_key",
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
  Time_key: {
    type: DataTypes.STRING(50),
    allowNull: true,
    references: {
      model: Dim_Time,
      key: "Time_key",
    },
  },
  Rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: "Fact_Feedback",
  timestamps: false,
});

// Associations
Fact_Feedback.belongsTo(Dim_Product, { foreignKey: "Product_key", targetKey: "Product_key" });
Fact_Feedback.belongsTo(Dim_Customer, { foreignKey: "Customer_key", targetKey: "Customer_key" });
Fact_Feedback.belongsTo(Dim_Time, { foreignKey: "Time_key", targetKey: "Time_key" });

module.exports = Fact_Feedback;
