const Fact_sale = require("../../../DWH/modelWH/Fact_Sale.model");
module.exports.olapFactSale = async (req, res) => {
  const body = req.body;

  const time_level = body.timeRollUp == "year"?"t.year":
  body.timeRollUp == "month"?"t.year, t.month":
  body.timeRollUp == "day"?"t.year, t.month, t.day":"";

  const location_level = body.locationRollUp == "province"?",l.province":
  body.locationRollUp == "district"?",l.province,l.district":
  body.locationRollUp == "commune"?",l.province,l.district,l.commune":"";

  const sql_level = `${time_level}${location_level}`;

  const [factSale] = await Fact_sale.sequelize.query(`
    SELECT 
      ${sql_level},
      SUM(f.Revenue) AS Total_Revenue,
      SUM(f.Quantity) AS Total_Quantity
    FROM 
      Fact_Sale f
      JOIN Dim_Time t ON f.Time_key = t.Time_key
      JOIN Dim_Location l ON f.Location_key = l.Location_key
    GROUP BY 
      ROLLUP (${sql_level})
    ORDER BY 
      ${sql_level};
  `);

  res.status(200).json({
    status: "success",
    data: factSale
  });


}