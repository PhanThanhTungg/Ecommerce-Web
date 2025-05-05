const { DataTypes } = require("sequelize");
const sequelize = require("../connectToMSSQL.js");

const Dim_Feedback = sequelize.define("Dim_Feedback", {
  Feedback_key: {
    type: DataTypes.STRING(50),
    allowNull: false,
    primaryKey: true,
  },
  Comment: {
    type: DataTypes.TEXT, // nvarchar(max) tương ứng TEXT
    allowNull: true,
  },
}, {
  tableName: "Dim_Feedback",
  timestamps: false,
});

module.exports = Dim_Feedback;
