const { DataTypes } = require("sequelize");
const sequelize = require("../connectToMSSQL.js");

const Dim_Location = sequelize.define("Dim_Location", {
  Location_key: {
    type: DataTypes.STRING(50),
    allowNull: false,
    primaryKey: true,
  },
  Detail: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  Commune: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  District: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  Province: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  tableName: "Dim_Location",
  timestamps: false,
});

module.exports = Dim_Location;
