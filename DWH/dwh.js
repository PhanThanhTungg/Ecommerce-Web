const { CronJob } = require('cron');
const getFullDataMongoDB = require('./getFullDataMongoDB');
const sequelize = require('./connectToMSSQL');
module.exports = async () => {
  // const job = new CronJob(
  //   '19 16 * * *', 
  //   function () {
  //     console.log('Bạn sẽ thấy thông báo này lúc 16h19 hàng ngày theo giờ Việt Nam');
  //   },
  //   null,
  //   true,
  //   'Asia/Ho_Chi_Minh'
  // );
  const startTime = new Date('2025-02-04T00:00:00+07:00'); 
  const endTime = new Date('2025-02-04T23:59:59+07:00'); 
  const fullData = await getFullDataMongoDB(startTime, endTime);
      // {
      //   users,
      //   products,
      //   productFeedbacks,
      //   categories,
      //   orders,
      //   orderProducts,
      // }


}