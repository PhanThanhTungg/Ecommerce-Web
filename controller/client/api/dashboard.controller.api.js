const Fact_sale = require("../../../DWH/modelWH/Fact_Sale.model");
module.exports.olapFactSale = async (req, res) => {
  const body = req.body;
  const sql_level = body.timeRollUp == "year"?"t.year":
  body.timeRollUp == "month"?"t.year, t.month":
  body.timeRollUp == "day"?"t.year, t.month, t.day":"";

  const [factSale] = await Fact_sale.sequelize.query(`
    SELECT 
      ${sql_level},
      SUM(f.Revenue) AS Total_Revenue,
      SUM(f.Quantity) AS Total_Quantity
    FROM 
      Fact_Sale f
      JOIN Dim_Time t ON f.Time_key = t.Time_key
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