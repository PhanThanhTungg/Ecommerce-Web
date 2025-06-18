const { CommandSucceededEvent } = require("mongodb");
const Fact_Feedback = require("../../../DWH/modelWH/Fact_Feedback.model");
const Fact_Order = require("../../../DWH/modelWH/Fact_Order.model");
const Fact_sale = require("../../../DWH/modelWH/Fact_Sale.model");
const axios = require("axios");

const CUBEJS_API_URL = process.env.CUBEJS_API_URL;
const CUBEJS_TOKEN = process.env.CUBEJS_TOKEN;

const queryCubejs = async (query) => {
  try {
    const response = await axios.post(
      `${CUBEJS_API_URL}`,
      query,
      {
        headers: {
          Authorization: CUBEJS_TOKEN
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error querying Cube.js:", error);
    throw error;
  }
}

// query from dwh
// module.exports.olapFactSale = async (req, res)=>{
//   try {

//     const body = req.body;

//     const levelArray = [];
//     const havingArray = [];
//     const WhereConditions = [];

//     //--------------time---------------
//     //Time rollup 
//     const time_level = body.timeRollUp == "year" ? "t.year" :
//       body.timeRollUp == "month" ? "t.year, t.month" :
//         body.timeRollUp == "day" ? "t.year, t.month, t.day" : "";
//     if (time_level != "") levelArray.push(time_level);

//     const Time_is_not_null =
//       body.timeRollUp == "year" ? "t.year IS NOT NULL" :
//         body.timeRollUp == "month" ? "t.year IS NOT NULL AND t.month IS NOT NULL" :
//           body.timeRollUp == "day" ? "t.year IS NOT NULL AND t.month IS NOT NULL AND t.day IS NOT NULL" : "";
//     if (Time_is_not_null != "") havingArray.push(Time_is_not_null);

//     // Time dice
//     if (body.timeDice) {
//       const timeDiceStartSplit = body.timeDice.start.split("-");
//       const timeDiceEndSplit = body.timeDice.end.split("-");
//       if (timeDiceStartSplit.length != timeDiceEndSplit.length) {
//         return res.status(400).json({
//           status: "error",
//           message: "Invalid time dice format"
//         });
//       }
//       if (timeDiceStartSplit.length == 1) {
//         const startYear = parseInt(timeDiceStartSplit[0]);
//         const endYear = parseInt(timeDiceEndSplit[0]);
//         WhereConditions.push(`t.year BETWEEN ${startYear} AND ${endYear}`);
//       }
//       else if (timeDiceStartSplit.length == 2) {
//         const [startMonth, startYear] = timeDiceStartSplit.map(Number);
//         const [endMonth, endYear] = timeDiceEndSplit.map(Number);
//         WhereConditions.push(`(t.year > ${startYear} OR (t.year = ${startYear} AND t.month >= ${startMonth}))`);
//         WhereConditions.push(`(t.year < ${endYear} OR (t.year = ${endYear} AND t.month <= ${endMonth}))`);
//       }
//       else if (timeDiceStartSplit.length == 3) {
//         const startDateConvert = timeDiceStartSplit.reverse().join("-");
//         const endDateConvert = timeDiceEndSplit.reverse().join("-");
//         WhereConditions.push(`CONVERT(date, CONCAT(t.year, '-', t.month, '-', t.day)) BETWEEN '${startDateConvert}' AND '${endDateConvert}'`);
//       }
//     }

//     //--------------location---------------
//     //location rollup
//     const location_level = body.locationRollUp == "province" ? "l.province" :
//       body.locationRollUp == "district" ? "l.province,l.district" :
//         body.locationRollUp == "commune" ? "l.province,l.district,l.commune" : "";
//     if (location_level != "") levelArray.push(location_level);

//     const Location_is_not_null =
//       body.locationRollUp == "province" ? "l.province IS NOT NULL" :
//         body.locationRollUp == "district" ? "l.province IS NOT NULL AND l.district IS NOT NULL" :
//           body.locationRollUp == "commune" ? "l.province IS NOT NULL AND l.district IS NOT NULL AND l.commune IS NOT NULL" : "";
//     if (Location_is_not_null != "") havingArray.push(Location_is_not_null);

//     //location dice
//     if (body.locationDice) {
//       const arrLocationDiceLength = body.locationDice[0].split("-").length;
//       const arrLocationDice = body.locationDice;
//       if (arrLocationDiceLength == 1) {
//         const arrLocationDiceString = arrLocationDice.map((item) => `N'${item}'`).join(",");
//         WhereConditions.push(`l.province IN (${arrLocationDiceString})`);
//       }
//       if (arrLocationDiceLength == 2) {
//         const arrLocationDiceDistrict = arrLocationDice.map((item) => `N'${item.split("-")[0]}'`).join(",");
//         const arrLocationDiceProvince = arrLocationDice.map((item) => `N'${item.split("-")[1]}'`).join(",");
//         WhereConditions.push(`l.district IN (${arrLocationDiceDistrict})`);
//         WhereConditions.push(`l.province IN (${arrLocationDiceProvince})`);
//       }
//       if (arrLocationDiceLength == 3) {
//         const arrLocationDiceCommune = arrLocationDice.map((item) => `N'${item.split("-")[0]}'`).join(",");
//         const arrLocationDiceDistrict = arrLocationDice.map((item) => `N'${item.split("-")[1]}'`).join(",");
//         const arrLocationDiceProvince = arrLocationDice.map((item) => `N'${item.split("-")[2]}'`).join(",");
//         WhereConditions.push(`l.commune IN (${arrLocationDiceCommune})`);
//         WhereConditions.push(`l.district IN (${arrLocationDiceDistrict})`);
//         WhereConditions.push(`l.province IN (${arrLocationDiceProvince})`);
//       }
//     }

//     //--------------product---------------
//     //product rollup
//     const product_level =
//       body.productRollUp == "category" ? "c.category_key, c.category_name" :
//         body.productRollUp == "product" ? "p.product_key, p.product_name" : "";
//     if (product_level !== "") levelArray.push(product_level);

//     const Product_is_not_null =
//       body.productRollUp == "category" ? "c.category_key IS NOT NULL and c.category_name is not null" :
//         body.productRollUp == "product" ? "p.product_key IS NOT NULL and p.product_name IS NOT NULL" : "";
//     if (Product_is_not_null !== "") havingArray.push(Product_is_not_null);

//     //product dice
//     if (body.productDice) {
//       const type = body.productDice.type;
//       if (type == "product") {
//         const arrProductIdDice = body.productDice.arr;
//         if (arrProductIdDice.length > 0) {
//           const arrProductIdDiceString = arrProductIdDice.map((item) => `'${item}'`).join(",");
//           WhereConditions.push(`p.product_key IN (${arrProductIdDiceString})`);
//         }
//       }
//       if(type == "category") {
//         const arrProductCategoryDice = body.productDice.arr;
//         if (arrProductCategoryDice.length > 0) {
//           const arrProductCategoryDiceString = arrProductCategoryDice.map((item) => `'${item}'`).join(",");
//           WhereConditions.push(`c.Category_key IN (${arrProductCategoryDiceString})`);
//         }
//       }
//     }


//     //--------------customer---------------
//     //customer rollup
//     const customer_level =
//       body.customer == "gender" ? "cu.gender" :
//         body.customer == "type" ? "cu.type" : "";
//     if (customer_level !== "") levelArray.push(customer_level);

//     const Customer_is_not_null =
//       body.customer == "gender" ? "cu.gender IS NOT NULL" :
//         body.customer == "type" ? "cu.type IS NOT NULL" : "";
//     if (Customer_is_not_null !== "") havingArray.push(Customer_is_not_null);

//     //customer dice
//     const customerDice = body.customerDice;
//     if (customerDice) {
//       if (customerDice.gender) {
//         const arrCustomerGenderDice = customerDice.gender.map((item) => `N'${item}'`).join(",");
//         WhereConditions.push(`cu.gender IN (${arrCustomerGenderDice})`);
//       }
//       if (customerDice.type) {
//         const arrCustomerTypeDice = customerDice.type.map((item) => `N'${item}'`).join(",");
//         WhereConditions.push(`cu.type IN (${arrCustomerTypeDice})`);
//       }
//     }


//     //sql query
//     const sql_level = `${levelArray.join(",")}`;
//     const sql_having = `${havingArray.join(" AND ")}`;
//     const sql_where = WhereConditions.join(" and ");

//     const [factSale] = await Fact_sale.sequelize.query(`
//       SELECT 
//         ${sql_level},
//         SUM(f.Revenue) AS Total_Revenue,
//         SUM(f.Quantity) AS Total_Quantity
//       FROM 
//         Fact_Sale f
//         JOIN Dim_Time t ON f.Time_key = t.Time_key
//         JOIN Dim_Location l ON f.Location_key = l.Location_key
//         JOIN Dim_Product p ON f.Product_key = p.Product_key
//         JOIN Dim_Category c ON p.Category_key = c.Category_key
//         JOIN Dim_Customer cu ON f.Customer_key = cu.Customer_key
//       ${sql_where ? "WHERE " : ""}${sql_where}
//       GROUP BY 
//         ROLLUP (${sql_level})
//       HAVING ${sql_having}
//       ORDER BY ${body.sort?body.sort.key+" "+body.sort.value:sql_level};
//     `);

//     const keys = Object.keys(factSale[0] || {});
//     const resData = {};
//     keys.forEach((key) => {
//       resData[key] = factSale.map((item) => item[key]);
//     });

//     res.status(200).json({
//       status: "success",
//       data: resData
//     });
//   } catch (error) {
//     console.error("Error in olapFactSale:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Internal server error",
//       error: error.message
//     });
//   }

// }

// query from cubejs
module.exports.olapFactSale = async (req, res) => {
  try {

    const body = req.body;
    const dimensions = [];
    const filters = [];
    const orders = {};

    //--------------time---------------
    if (body.timeRollUp == "year") {
      dimensions.push("dim_time.year");
      orders["dim_time.year"] = "asc";
    }
    if (body.timeRollUp == "month") {
      dimensions.push("dim_time.month");
      orders["dim_time.year"] = "asc";
      orders["dim_time.month"] = "asc";
    }
    if (body.timeRollUp == "day") {
      dimensions.push("dim_time.day");
      orders["dim_time.year"] = "asc";
      orders["dim_time.month"] = "asc";
      orders["dim_time.day"] = "asc";
    }

    // Time dice
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
        filters.push({
          dimension: "dim_time.year",
          operator: "gte",
          values: [startYear]
        });
        filters.push({
          dimension: "dim_time.year",
          operator: "lte",
          values: [endYear]
        });
      }
      else if (timeDiceStartSplit.length == 2) {
        const [startMonth, startYear] = timeDiceStartSplit.map(Number);
        const [endMonth, endYear] = timeDiceEndSplit.map(Number);
        const stringStart = `${startYear}-${startMonth.toString().padStart(2, '0')}`;
        const stringEnd = `${endYear}-${endMonth.toString().padStart(2, '0')}`;
        filters.push({
          dimension: "dim_time.month",
          operator: "gte",
          values: [stringStart]
        });
        filters.push({
          dimension: "dim_time.month",
          operator: "lte",
          values: [stringEnd]
        });
      }
      else if (timeDiceStartSplit.length == 3) {
        const startDateConvert = timeDiceStartSplit.reverse().join("-");
        const endDateConvert = timeDiceEndSplit.reverse().join("-");
        filters.push({
          dimension: "dim_time.day",
          operator: "gte",
          values: [startDateConvert]
        });
        filters.push({
          dimension: "dim_time.day",
          operator: "lte",
          values: [endDateConvert]
        });
      }
    }

    //--------------location---------------
    const location_level = body.locationRollUp == "province" ? "dim_location.province" :
      body.locationRollUp == "district" ? "dim_location.district" :
        body.locationRollUp == "commune" ? "dim_location.commune" : "";
    if (location_level != "") dimensions.push(location_level);

    // location dice
    if (body.locationDice) {
      const arrLocationDiceLength = body.locationDice[0].split("-").length;
      const arrLocationDice = body.locationDice;
      if (arrLocationDiceLength == 1) {
        const arrLocationDiceString = arrLocationDice;
        filters.push({
          dimension: "dim_location.province",
          operator: "equals",
          values: arrLocationDiceString
        });
      }
      if (arrLocationDiceLength == 2) {
        const arrLocationDiceDistrict = arrLocationDice.map((item) => item.split("-")[1] + "," + item.split("-")[0]);
        filters.push({
          dimension: "dim_location.district",
          operator: "equals",
          values: arrLocationDiceDistrict
        });
      }
      if (arrLocationDiceLength == 3) {
        const arrLocationDiceCommune = arrLocationDice.map((item) => item.split("-")[2] + "," + item.split("-")[1] + "," + item.split("-")[0]);
        filters.push({
          dimension: "dim_location.commune",
          operator: "equals",
          values: arrLocationDiceCommune
        });
      }
    }

    //--------------product---------------
    if (body.productRollUp == "category") {
      dimensions.push("dim_category.category_key");
      dimensions.push("dim_category.category_name");
    }
    if (body.productRollUp == "product") {
      dimensions.push("dim_product.product_key");
      dimensions.push("dim_product.product_name");
    }

    //product dice
    if (body.productDice) {
      const type = body.productDice.type;
      if (type == "product") {
        const arrProductIdDice = body.productDice.arr;
        if (arrProductIdDice.length > 0) {
          filters.push({
            dimension: "dim_product.product_key",
            operator: "equals",
            values: arrProductIdDice
          });
        }
      }
      if (type == "category") {
        const arrProductCategoryDice = body.productDice.arr;
        if (arrProductCategoryDice.length > 0) {
          filters.push({
            dimension: "dim_category.category_key",
            operator: "equals",
            values: arrProductCategoryDice
          });
        }
      }
    }



    //--------------customer---------------
    const customer_level =
      body.customer == "gender" ? "dim_customer.gender" :
        body.customer == "type" ? "dim_customer.type" : "";
    if (customer_level != "") dimensions.push(customer_level);

    //customer dice
    const customerDice = body.customerDice;
    if (customerDice) {
      if (customerDice.gender) {
        const arrCustomerGenderDice = customerDice.gender;
        filters.push({
          dimension: "dim_customer.gender",
          operator: "equals",
          values: arrCustomerGenderDice
        });
      }
      if (customerDice.type) {
        const arrCustomerTypeDice = customerDice.type;
        filters.push({
          dimension: "dim_customer.type",
          operator: "equals",
          values: arrCustomerTypeDice
        });
      }
    }

    const data = await queryCubejs({
      query: {
        measures: ["fact_sale.quantity", "fact_sale.revenue"],
        dimensions,
        filters,
        order: { ...orders, "fact_sale.revenue": "desc" },
      }
    });

    const allKeys = Array.from(new Set(data.flatMap(Object.keys)));
    const dataRes = {
      year: [],
      month: [],
      day: [],
      commune: [],
      district: [],
      province: [],
    };
    for (const key of allKeys) {
      let newKey = key.split(".")[1];
      if (newKey == "revenue") newKey = "Total_Revenue";
      if (newKey == "quantity") newKey = "Total_Quantity";
      data.forEach(obj => {
        if (newKey == "day") {
          const dayArr = obj[key].split("-");
          dataRes["year"].push(dayArr[0]);
          dataRes["month"].push(dayArr[1]);
          dataRes["day"].push(dayArr[2]);
        }
        else if (newKey == "month") {
          const monthArr = obj[key].split("-");
          dataRes["year"].push(monthArr[0]);
          dataRes["month"].push(monthArr[1]);
        }
        else if (newKey == "commune") {
          const communeArr = obj[key].split(",");
          dataRes["province"].push(communeArr[0]);
          dataRes["district"].push(communeArr[1]);
          dataRes["commune"].push(communeArr[2]);
        }
        else if (newKey == "district") {
          const districtArr = obj[key].split(",");
          dataRes["province"].push(districtArr[0]);
          dataRes["district"].push(districtArr[1]);
        }
        else if (newKey == "province") {
          dataRes["province"].push(obj[key]);
        }
        else {
          if (!dataRes[newKey]) dataRes[newKey] = [];
          if (newKey === "Total_Revenue" || newKey === "Total_Quantity") {
            dataRes[newKey].push(+obj[key]);
          }
          else {
            dataRes[newKey].push(obj[key]);
          }
        }
      });
    }

    Object.keys(dataRes).forEach(key => {
      if (dataRes[key].every(value => value === null)) {
        delete dataRes[key];
      }
    });


    return res.status(200).json({
      status: "success",
      data: dataRes
    });


  } catch (error) {
    console.error("Error in olapFactSale:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
}

module.exports.olapFactFeedback = async (req, res) => {
  try {
    const body = req.body;

    const levelArray = [];
    const havingArray = [];
    const WhereConditions = [];

    //--------------time---------------
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
        WhereConditions.push(`t.year BETWEEN ${startYear} AND ${endYear}`);
      }
      else if (timeDiceStartSplit.length == 2) {
        const [startMonth, startYear] = timeDiceStartSplit.map(Number);
        const [endMonth, endYear] = timeDiceEndSplit.map(Number);
        WhereConditions.push(`(t.year > ${startYear} OR (t.year = ${startYear} AND t.month >= ${startMonth}))`);
        WhereConditions.push(`(t.year < ${endYear} OR (t.year = ${endYear} AND t.month <= ${endMonth}))`);
      }
      else if (timeDiceStartSplit.length == 3) {
        const startDateConvert = timeDiceStartSplit.reverse().join("-");
        const endDateConvert = timeDiceEndSplit.reverse().join("-");
        WhereConditions.push(`CONVERT(date, CONCAT(t.year, '-', t.month, '-', t.day)) BETWEEN '${startDateConvert}' AND '${endDateConvert}'`);
      }
    }

    //--------------product---------------
    //product rollup
    const product_level =
      body.productRollUp == "category" ? "c.category_key, c.category_name" :
        body.productRollUp == "product" ? "p.product_key, p.product_name" : "";
    if (product_level !== "") levelArray.push(product_level);

    const Product_is_not_null =
      body.productRollUp == "category" ? "c.category_key IS NOT NULL and c.category_name is not null" :
        body.productRollUp == "product" ? "p.product_key IS NOT NULL and p.product_name IS NOT NULL" : "";
    if (Product_is_not_null !== "") havingArray.push(Product_is_not_null);

    //product dice
    if (body.productDice) {
      const type = body.productDice.type;
      if (type == "product") {
        const arrProductIdDice = body.productDice.arr;
        if (arrProductIdDice.length > 0) {
          const arrProductIdDiceString = arrProductIdDice.map((item) => `'${item}'`).join(",");
          WhereConditions.push(`p.product_key IN (${arrProductIdDiceString})`);
        }
      } else if (type == "category") {
        const arrCategoryIdDice = body.productDice.arr;
        if (arrCategoryIdDice.length > 0) {
          const arrCategoryIdDiceString = arrCategoryIdDice.map((item) => `'${item}'`).join(",");
          WhereConditions.push(`c.category_key IN (${arrCategoryIdDiceString})`);
        }
      }
    }

    //--------------customer---------------
    //customer rollup
    const customer_level =
      body.customer == "gender" ? "cu.Gender, cu.Type" :
        body.customer == "type" ? "cu.Type, cu.Gender" : "";
    if (customer_level !== "") levelArray.push(customer_level);

    const Customer_is_not_null =
      body.customer == "gender" ? "cu.Gender IS NOT NULL and cu.Type is not null" :
        body.customer == "type" ? "cu.Type IS NOT NULL and cu.Gender is not null" : "";
    if (Customer_is_not_null !== "") havingArray.push(Customer_is_not_null);

    //customer dice
    const customerDice = body.customerDice;
    if (customerDice) {
      if (customerDice.gender) {
        const arrCustomerGenderDice = customerDice.gender.map((item) => `N'${item}'`).join(",");
        WhereConditions.push(`cu.Gender IN (${arrCustomerGenderDice})`);
      }
      if (customerDice.type) {
        const arrCustomerTypeDice = customerDice.type.map((item) => `N'${item}'`).join(",");
        WhereConditions.push(`cu.Type IN (${arrCustomerTypeDice})`);
      }
    }

    //sql query
    const sql_level = `${levelArray.join(",")}`;
    const sql_having = `${havingArray.join(" AND ")}`;
    const sql_where = WhereConditions.join(" and ");

    const [factFeedback] = await Fact_Feedback.sequelize.query(`
      SELECT 
        ${sql_level},
        AVG(f.Rating) AS AVG_Rating,
        SUM(CASE WHEN f.Rating = 1 THEN 1 ELSE 0 END) AS Rating_1_Count,
        SUM(CASE WHEN f.Rating = 2 THEN 1 ELSE 0 END) AS Rating_2_Count,
        SUM(CASE WHEN f.Rating = 3 THEN 1 ELSE 0 END) AS Rating_3_Count,
        SUM(CASE WHEN f.Rating = 4 THEN 1 ELSE 0 END) AS Rating_4_Count,
        SUM(CASE WHEN f.Rating = 5 THEN 1 ELSE 0 END) AS Rating_5_Count
      FROM 
        Fact_Feedback f
        JOIN Dim_Time t ON f.Time_key = t.Time_key
        JOIN Dim_Product p ON f.Product_key = p.Product_key
        JOIN Dim_Category c ON p.Category_key = c.Category_key
        JOIN Dim_Customer cu ON f.Customer_key = cu.Customer_key
      ${sql_where ? "WHERE " : ""}${sql_where}
      GROUP BY 
        ROLLUP (${sql_level})
      HAVING ${sql_having}
      ORDER BY ${body.sort ? "AVG_Rating " + body.sort : sql_level};
    `);

    const keys = Object.keys(factFeedback[0] || {});
    const resData = {};
    keys.forEach((key) => {
      resData[key] = factFeedback.map((item) => item[key]);
    });

    res.status(200).json({
      status: "success",
      data: resData
    });
  } catch (error) {
    console.error("Error in olapFactFeedback:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
}

module.exports.olapFactOrder = async (req, res) => {
  try {
    const body = req.body;

    const levelArray = [];
    const havingArray = [];
    const WhereConditions = [];

    //--------------time---------------
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
        WhereConditions.push(`t.year BETWEEN ${startYear} AND ${endYear}`);
      }
      else if (timeDiceStartSplit.length == 2) {
        const [startMonth, startYear] = timeDiceStartSplit.map(Number);
        const [endMonth, endYear] = timeDiceEndSplit.map(Number);
        WhereConditions.push(`(t.year > ${startYear} OR (t.year = ${startYear} AND t.month >= ${startMonth}))`);
        WhereConditions.push(`(t.year < ${endYear} OR (t.year = ${endYear} AND t.month <= ${endMonth}))`);
      }
      else if (timeDiceStartSplit.length == 3) {
        const startDateConvert = timeDiceStartSplit.reverse().join("-");
        const endDateConvert = timeDiceEndSplit.reverse().join("-");
        WhereConditions.push(`CONVERT(date, CONCAT(t.year, '-', t.month, '-', t.day)) BETWEEN '${startDateConvert}' AND '${endDateConvert}'`);
      }
    }

    //--------------location---------------
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

    //location dice
    if (body.locationDice) {
      const arrLocationDiceLength = body.locationDice[0].split("-").length;
      const arrLocationDice = body.locationDice;
      if (arrLocationDiceLength == 1) {
        const arrLocationDiceString = arrLocationDice.map((item) => `N'${item}'`).join(",");
        WhereConditions.push(`l.province IN (${arrLocationDiceString})`);
      }
      if (arrLocationDiceLength == 2) {
        const arrLocationDiceDistrict = arrLocationDice.map((item) => `N'${item.split("-")[0]}'`).join(",");
        const arrLocationDiceProvince = arrLocationDice.map((item) => `N'${item.split("-")[1]}'`).join(",");
        WhereConditions.push(`l.district IN (${arrLocationDiceDistrict})`);
        WhereConditions.push(`l.province IN (${arrLocationDiceProvince})`);
      }
      if (arrLocationDiceLength == 3) {
        const arrLocationDiceCommune = arrLocationDice.map((item) => `N'${item.split("-")[0]}'`).join(",");
        const arrLocationDiceDistrict = arrLocationDice.map((item) => `N'${item.split("-")[1]}'`).join(",");
        const arrLocationDiceProvince = arrLocationDice.map((item) => `N'${item.split("-")[2]}'`).join(",");
        WhereConditions.push(`l.commune IN (${arrLocationDiceCommune})`);
        WhereConditions.push(`l.district IN (${arrLocationDiceDistrict})`);
        WhereConditions.push(`l.province IN (${arrLocationDiceProvince})`);
      }
    }

    //--------------customer---------------
    //customer rollup
    const customer_level =
      body.customer == "gender" ? "cu.Gender" :
        body.customer == "type" ? "cu.Type" : "";
    if (customer_level !== "") levelArray.push(customer_level);

    const Customer_is_not_null =
      body.customer == "gender" ? "cu.Gender IS NOT NULL" :
        body.customer == "type" ? "cu.Type IS NOT NULL" : "";
    if (Customer_is_not_null !== "") havingArray.push(Customer_is_not_null);

    //customer dice
    const customerDice = body.customerDice;
    if (customerDice) {
      if (customerDice.gender) {
        const arrCustomerGenderDice = customerDice.gender.map((item) => `N'${item}'`).join(",");
        WhereConditions.push(`cu.Gender IN (${arrCustomerGenderDice})`);
      }
      if (customerDice.type) {
        const arrCustomerTypeDice = customerDice.type.map((item) => `N'${item}'`).join(",");
        WhereConditions.push(`cu.Type IN (${arrCustomerTypeDice})`);
      }
    }

    //--------------order---------------
    //order rollup
    const order_level = body.orderRollUp == "delivery" ? "o.Delivery_method" :
      body.orderRollUp == "payment" ? "o.Payment_method" : "";
    if (order_level !== "") levelArray.push(order_level);

    const Order_is_not_null =
      body.orderRollUp == "delivery" ? "o.Delivery_method IS NOT NULL" :
        body.orderRollUp == "payment" ? "o.Payment_method IS NOT NULL" : "";
    if (Order_is_not_null !== "") havingArray.push(Order_is_not_null);

    //order dice
    if (body.orderDice) {
      const type = body.orderDice.type;
      if (type == "delivery") {
        const arrOrderDeliveryDice = body.orderDice.arr;
        if (arrOrderDeliveryDice.length > 0) {
          const arrOrderDeliveryDiceString = arrOrderDeliveryDice.map((item) => `'${item}'`).join(",");
          WhereConditions.push(`o.Delivery_method IN (${arrOrderDeliveryDiceString})`);
        }
      }
      if (type == "payment") {
        const arrOrderPaymentDice = body.orderDice.arr;
        if (arrOrderPaymentDice.length > 0) {
          const arrOrderPaymentDiceString = arrOrderPaymentDice.map((item) => `'${item}'`).join(",");
          WhereConditions.push(`o.Payment_method IN (${arrOrderPaymentDiceString})`);
        }
      }
    }

    //sql query
    const sql_level = `${levelArray.join(",")}`;
    const sql_having = `${havingArray.join(" AND ")}`;
    const sql_where = WhereConditions.join(" and ");

    const [factOrder] = await Fact_Order.sequelize.query(`
      SELECT 
        ${sql_level},
        count(f.Order_key) as Total_Order
      FROM 
        Fact_Order f
        JOIN Dim_Time t ON f.Time_key = t.Time_key
        JOIN Dim_Location l ON f.Location_key = l.Location_key
        JOIN Dim_Customer cu ON f.Customer_key = cu.Customer_key
        JOIN Dim_Order o ON f.Order_key = o.Order_key
      ${sql_where ? "WHERE " : ""}${sql_where}
      GROUP BY 
        ROLLUP (${sql_level})
      HAVING ${sql_having}
      ORDER BY ${body.sort ? "Total_Order " + body.sort : sql_level};
    `);

    const keys = Object.keys(factOrder[0] || {});
    const resData = {};
    keys.forEach((key) => {
      resData[key] = factOrder.map((item) => item[key]);
    });

    res.status(200).json({
      status: "success",
      data: resData
    });
  } catch (error) {
    console.error("Error in olapFactOrder:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
}
