const Order = require("../../model/order.model")
const Product = require("../../model/product.model");
const OrderProduct = require("../../model/order-product.model");
const getStatusHelper = require("../../helpers/getStatus.helper");
const filterStatusOrderHelper = require("../../helpers/filterStatusOrder")
const searchHelper = require("../../helpers/search")
module.exports.index = async (req, res) => {
  let orders =[];
  const user = res.locals.user
  if(user){
    orders = await Order.find({
      userId: user.id
    }).sort({ createdAt: -1 }).select("-userId -updatedAt").lean()
  }else{
    orders = await Order.find({
      cartId: req.cookies.cartId
    }).sort({ createdAt: -1 }).select("-userId -updatedAt").lean()
  }

  if(!orders){
    req.flash("error", "Có lỗi");
    return res.redirect("/");
  }

  for(const order of orders){
    order.paymentMethod = getStatusHelper.getPaymentMethod(order.paymentMethod);
    const orderProducts = await OrderProduct.find({
      order_id: order._id
    }).lean();
    for(const item of orderProducts){
      const product = await Product.findOne({_id: item.product_id});
      item.product_thumbnail = product.images[0];
    }
    order.orderProducts = orderProducts;
  }

  
  //   // //search
  // let findTitle = null 
  // const objectSearch = searchHelper(req.query)
  // if(objectSearch.regex){
  //   findTitle = objectSearch.regex
  // }

    //status
  // let findStatus = null
  // if(req.query.status) findStatus = req.query.status  // kiểm tra xem có yêu cầu request không, sau dấu ? trên url
  // const filterStatus = filterStatusOrderHelper(req.query)
  

    // const listOrder = []
    // for (const orderDetail of order){
    //   if(orderDetail.products.length > 0) {
    //     for (const item of orderDetail.products) {
    //       const orderItem = {}
    //       const product = await Product.findOne({
    //         _id: item.product_id
    //       }).select("thumbnail title slug listSize discountPercentage status")

    //       const sizeInfo = product.listSize.find(i=>{
    //         return i.id == item.size_id
    //       })
    //       orderItem.sizeInfo = sizeInfo

    //       orderItem.product_id = item.product_id

    //       orderItem.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0)
    //       orderItem.size = item.size
    
    //       orderItem.productInfo = product
    //       orderItem.quantity= item.quantity
    
    //       orderItem.totalPrice = item.quantity * orderItem.priceNew
    //       orderItem.createAt = orderDetail.createdAt
    //       orderItem.order_id = item.id
    //       orderItem.object_id = orderDetail.id
          
    //       switch(item.status){
    //         case 'xacNhan':
    //           item.statusDisplay = "Đang xác nhận"
    //           break
    //         case 'daXacNhan':
    //           item.statusDisplay = "Đã xác nhận"
    //           break
    //         case 'dangVanChuyen':
    //           item.statusDisplay = "Đang vận chuyển"
    //           break
    //         case 'daGiao':
    //           item.statusDisplay = "Đã giao"
    //           break
    //         case 'daThanhToan':
    //           item.statusDisplay = "Đã thanh toán"
    //           break
    //         case 'daHuy':
    //           item.statusDisplay = "Đã hủy"
    //           break 
    //         case 'biBom':
    //           item.statusDisplay = "Bị bạn bom"
    //           break
    //       }
    //       orderItem.statusDisplay = item.statusDisplay
    //       if((findTitle !=null && findTitle.test(orderItem.productInfo.title)) || findTitle == null){
    //         if(findStatus==null || item.status==findStatus){
    //           listOrder.push(orderItem)
    //         }
    //       }
    //     }
    // }
    // }
    //sort
    // const sortKey = req.query.sortKey
    // const sortValue = req.query.sortValue
    // if(sortKey && sortValue){
    //   listOrder.sort((a,b)=>{
    //     if(sortKey=='time'){
    //       if(sortValue=='desc'){
    //         if(a.createAt < b.createAt) return 1
    //         else return -1
    //       }
    //       else{
    //         if(a.createAt < b.createAt) return -1
    //         else return 1
    //       }
    //     }
    //     else if(sortKey =='price'){
    //       if(sortValue=='desc'){
    //         if(a.totalPrice < b.totalPrice) return 1
    //         else return -1
    //       }
    //       else{
    //         if(a.totalPrice < b.totalPrice) return -1
    //         else return 1
    //       }
    //     }
    //     else{
    //       if(sortValue=='desc'){
    //         if(a.productInfo.title < b.productInfo.title) return 1
    //         else return -1
    //       }
    //       else{
    //         if(a.productInfo.title < b.productInfo.title) return -1
    //         else return 1
    //       }
    //     }
    //   })
    // }
    // else{
    //   listOrder.reverse()
    // }
    //end sort
    res.render("client/pages/order/index", {
      pageTitle: "Lịch sử mua hàng",
      orders: orders,
      bankId: process.env.QR_BANK_ID,
      bankAccount: process.env.QR_BANK_ACC
        // filterStatus: filterStatus
    })
}

module.exports.deleteItem = async (req,res)=>{
  const orderId = req.params.id
  const objectId = req.params.objectId

  const order = await Order.findOne({
    _id: objectId
  })

  let listProduct
  if(order.products.length > 0) {
    listProduct = order.products
    for (const item of order.products) {
      if(orderId== item.id){
        item.status ="daHuy"
        const infoProduct = await Product.findOne({
          _id: item.product_id
        })
  
        const sizeInfo = infoProduct.listSize.find(i=>{
          return i.id == item.size_id
        })
  
        const currentStock = sizeInfo.stock + item.quantity
        await Product.updateOne({_id: item.product_id},{
          sales: infoProduct.sales - item.quantity
        })
  
        await Product.updateOne({
          _id: item.product_id,
          "listSize._id": sizeInfo._id
        }, {
          $set: {
            "listSize.$.stock": currentStock
          } 
        })
      } 
    }}
  await Order.updateOne({_id: objectId}, {products: listProduct})
  res.redirect("back") // Quay lai trang truoc khi chuyen huong
}

