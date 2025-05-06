const { DataTypes } = require("sequelize");
const sequelize = require("../connectToMSSQL.js");

const Dim_Category = require("./Dim_Category.model.js");

const Dim_Product = sequelize.define("Dim_Product", {
  Product_key: {
    type: DataTypes.STRING(50),
    allowNull: false,
    primaryKey: true,
  },
  Category_key: {
    type: DataTypes.STRING(50),
    allowNull: true,
    references: {
      model: Dim_Category,
      key: "Category_key",
    },
  },
  Product_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Featured: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  Position: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: "Dim_Product",
  timestamps: false,
});

Dim_Product.belongsTo(Dim_Category, {
  foreignKey: "Category_key",
  targetKey: "Category_key",
});

module.exports = Dim_Product;
