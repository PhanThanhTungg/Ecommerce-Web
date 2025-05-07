const Fact_sale = require("../../../DWH/modelWH/Fact_Sale.model");
module.exports.olapFactSale = async (req, res) => {
  const body = req.body;

  const levelArray = [];
  const havingArray = [];

  const time_level = body.timeRollUp == "year" ? "t.year" :
    body.timeRollUp == "month" ? "t.year, t.month" :
      body.timeRollUp == "day" ? "t.year, t.month, t.day" : "";
  if(time_level !="") levelArray.push(time_level);

  const Time_is_not_null =
    body.timeRollUp == "year" ? "t.year IS NOT NULL" :
      body.timeRollUp == "month" ? "t.year IS NOT NULL AND t.month IS NOT NULL" :
        body.timeRollUp == "day" ? "t.year IS NOT NULL AND t.month IS NOT NULL AND t.day IS NOT NULL" : "";
  if(Time_is_not_null !="") havingArray.push(Time_is_not_null);

  const location_level = body.locationRollUp == "province" ? "l.province" :
    body.locationRollUp == "district" ? "l.province,l.district" :
      body.locationRollUp == "commune" ? "l.province,l.district,l.commune" : "";
  if(location_level !="") levelArray.push(location_level);

  const Location_is_not_null =
    body.locationRollUp == "province" ? "l.province IS NOT NULL" :
      body.locationRollUp == "district" ? "l.province IS NOT NULL AND l.district IS NOT NULL" :
        body.locationRollUp == "commune" ? "l.province IS NOT NULL AND l.district IS NOT NULL AND l.commune IS NOT NULL" : "";
  if(Location_is_not_null !="") havingArray.push(Location_is_not_null);

  const sql_level = `${levelArray.join(",")}`;
  const sql_having = `${havingArray.join(" AND ")}`;

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
    HAVING ${sql_having}
    ORDER BY ${sql_level};
  `);

  const keys = Object.keys(factSale[0]);
  const resData = {};
  keys.forEach((key) => {
    resData[key] = factSale.map((item) => item[key]);
  });

  res.status(200).json({
    status: "success",
    data: resData
  });


}