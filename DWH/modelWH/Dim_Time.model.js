const { DataTypes } = require("sequelize");
const sequelize = require("../connectToMSSQL.js");

const Dim_Time = sequelize.define("Dim_Time", {
  Time_key: {
    type: DataTypes.STRING(50),
    allowNull: false,
    primaryKey: true,
  },
  Day: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Month: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  Year: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: "Dim_Time",
  timestamps: false,
});

module.exports = Dim_Time;
