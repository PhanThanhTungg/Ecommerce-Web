const Order = require("../../model/order.model")
const Product = require("../../model/product.model")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const filterStatusOrderHelper = require("../../helpers/filterStatusOrder")


module.exports.index = async (req, res) => {


  res.render("admin/pages/orders/index", {
    pageTitle: "Quản lý đơn hàng",
    // orders: listOrder,
    // keyword: objectSearch.keyword,
    // filterStatus: filterStatus
  })
}
module.exports.changeStatus = async (req,res)=>{
  var productItems=[]
  const orderId = req.params.orderId
  const productId = req.params.productId
  const value = req.params.value
  // res.send(`${orderId} ${productId} ${value}`)

  const orders = await Order.findOne({_id: orderId})
  const listProduct = orders.products
  for(const item of listProduct){
    if(item.id===productId){
      item.status= value
    }
  }
  await Order.updateOne({
    _id: orderId,
  }, {products: listProduct})

  req.flash('success', 'Chuyển trạng thái thành công!')

  res.redirect("back") // Quay lai trang truoc khi chuyen huong

}


