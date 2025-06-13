const { DataTypes } = require("sequelize");
const sequelize = require("../connectToMSSQL.js");

const Dim_Category = sequelize.define("Dim_Category", {
  Category_key: {
    type: DataTypes.STRING(50),
    allowNull: false,
    primaryKey: true,
  },
  Category_name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Category_parent_key: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  Featured: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
}, {
  tableName: "Dim_Category",
  timestamps: false,
});

module.exports = Dim_Category;
