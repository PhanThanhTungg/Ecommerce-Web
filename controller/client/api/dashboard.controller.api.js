const Fact_sale = require("../../../DWH/modelWH/Fact_Sale.model");
module.exports.olapFactSale = async (req, res) => {
  const body = req.body;

  const levelArray = [];
  const havingArray = [];

  //Time rollup 
  const time_level = body.timeRollUp == "year" ? "t.year" :
    body.timeRollUp == "month" ? "t.year, t.month" :
      body.timeRollUp == "day" ? "t.year, t.month, t.day" : "";
  if (time_level != "") levelArray.push(time_level);

  const Time_is_not_null =
    body.timeRollUp == "year" ? "t.year IS NOT NULL" :
      body.timeRollUp == "month" ? "t.year IS NOT NULL AND t.month IS NOT NULL" :
        body.timeRollUp == "day" ? "t.year IS NOT NULL AND t.month IS NOT NULL AND t.day IS NOT NULL" : "";
  if (Time_is_not_null != "") havingArray.push(Time_is_not_null);

  // Time dice
  const timeWhereConditions = [];
  if (body.timeDice) {
    const timeDiceStartSplit = body.timeDice.start.split("-");
    const timeDiceEndSplit = body.timeDice.end.split("-");
    if (timeDiceStartSplit.length != timeDiceEndSplit.length) {
      return res.status(400).json({
        status: "error",
        message: "Invalid time dice format"
      });
    }
    if (timeDiceStartSplit.length == 1) {
      const startYear = parseInt(timeDiceStartSplit[0]);
      const endYear = parseInt(timeDiceEndSplit[0]);
      timeWhereConditions.push(`t.year BETWEEN ${startYear} AND ${endYear}`);
      console.log(timeWhereConditions)
    }
    else if (timeDiceStartSplit.length == 2) {
      const [startMonth, startYear] = timeDiceStartSplit.map(Number);
      const [endMonth, endYear] = timeDiceEndSplit.map(Number);
      timeWhereConditions.push(`(t.year > ${startYear} OR (t.year = ${startYear} AND t.month >= ${startMonth}))`);
      timeWhereConditions.push(`(t.year < ${endYear} OR (t.year = ${endYear} AND t.month <= ${endMonth}))`);
    }
    else if (timeDiceStartSplit.length == 3) {
      const startDateConvert = timeDiceStartSplit.reverse().join("-");
      const endDateConvert = timeDiceEndSplit.reverse().join("-");
      timeWhereConditions.push(`CONVERT(date, CONCAT(t.year, '-', t.month, '-', t.day)) BETWEEN '${startDateConvert}' AND '${endDateConvert}'`);
    }
  }

  //location rollup
  const location_level = body.locationRollUp == "province" ? "l.province" :
    body.locationRollUp == "district" ? "l.province,l.district" :
      body.locationRollUp == "commune" ? "l.province,l.district,l.commune" : "";
  if (location_level != "") levelArray.push(location_level);

  const Location_is_not_null =
    body.locationRollUp == "province" ? "l.province IS NOT NULL" :
      body.locationRollUp == "district" ? "l.province IS NOT NULL AND l.district IS NOT NULL" :
        body.locationRollUp == "commune" ? "l.province IS NOT NULL AND l.district IS NOT NULL AND l.commune IS NOT NULL" : "";
  if (Location_is_not_null != "") havingArray.push(Location_is_not_null);

  //product rollup
  const product_level =
    body.productRollUp == "category" ? "c.category_key, c.category_name" :
      body.productRollUp == "product" ? "p.product_key, p.product_name" : "";
  if (product_level !== "") levelArray.push(product_level);

  const Product_is_not_null =
    body.productRollUp == "category" ? "c.category_key IS NOT NULL and c.category_name is not null" :
      body.productRollUp == "product" ? "p.product_key IS NOT NULL" : "";
  if (Product_is_not_null !== "") havingArray.push(Product_is_not_null);

  //customer rollup
  const customer_level =
    body.customer == "gender" ? "cu.Gender, cu.Type" :
      body.customer == "type" ? "cu.Type, cu.Gender" : "";
  if (customer_level !== "") levelArray.push(customer_level);

  const Customer_is_not_null =
    body.customer == "gender" ? "cu.Gender IS NOT NULL and cu.Type is not null" :
      body.customer == "type" ? "cu.Type IS NOT NULL and cu.Gender is not null" : "";
  if (Customer_is_not_null !== "") havingArray.push(Customer_is_not_null);

  const sql_level = `${levelArray.join(",")}`;
  const sql_having = `${havingArray.join(" AND ")}`;
  const sql_where = timeWhereConditions.length > 0
    ? `WHERE ${timeWhereConditions.join(' AND ')}` : '';

  const [factSale] = await Fact_sale.sequelize.query(`
    SELECT 
      ${sql_level},
      SUM(f.Revenue) AS Total_Revenue,
      SUM(f.Quantity) AS Total_Quantity
    FROM 
      Fact_Sale f
      JOIN Dim_Time t ON f.Time_key = t.Time_key
      JOIN Dim_Location l ON f.Location_key = l.Location_key
      JOIN Dim_Product p ON f.Product_key = p.Product_key
      JOIN Dim_Category c ON p.Category_key = c.Category_key
      JOIN Dim_Customer cu ON f.Customer_key = cu.Customer_key
    ${sql_where}
    GROUP BY 
      ROLLUP (${sql_level})
    HAVING ${sql_having}
    ORDER BY ${sql_level};
  `);

  const keys = Object.keys(factSale[0] || {});
  const resData = {};
  keys.forEach((key) => {
    resData[key] = factSale.map((item) => item[key]);
  });

  res.status(200).json({
    status: "success",
    data: resData
  });
}