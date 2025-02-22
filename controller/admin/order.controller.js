const Order = require("../../model/order.model")
const Product = require("../../model/product.model")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")
const filterStatusOrderHelper = require("../../helpers/filterStatusOrder")


module.exports.index = async (req, res) => {
  // //search
  let findTitle = null 
  const objectSearch = searchHelper(req.query)
  if(objectSearch.regex){
    findTitle = objectSearch.regex
  }

  //status
  let findStatus = null
  if(req.query.status) findStatus = req.query.status  // kiểm tra xem có yêu cầu request không, sau dấu ? trên url
  const filterStatus = filterStatusOrderHelper(req.query)

  const listOrder = []
  var order = await Order.find()
  if(order){
    for(const orderDetail of order){
      if(orderDetail.products.length > 0) {
        const userInfo={
          fullName: orderDetail.userInfo.fullName,
          phone: orderDetail.userInfo.phone,
          address: orderDetail.userInfo.address
        }
        for (const item of orderDetail.products) {
          const orderItem={}
          const product = await Product.findOne({
            _id: item.product_id
          }).select("thumbnail title slug listSize discountPercentage status")
          
          const sizeInfo = product.listSize.find(i=>{
            return i.id == item.size_id
          })
          orderItem.sizeInfo = sizeInfo
    
          orderItem.productInfo = product
          orderItem.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0)
          orderItem.size = item.size
          orderItem.userInfo = userInfo

          orderItem.quantity= item.quantity
          orderItem.id = item.id
          orderItem.status= item.status
    
          orderItem.totalPrice = item.quantity * orderItem.priceNew

          orderItem.orderId = orderDetail.id

          orderItem.createAt = orderDetail.createdAt
          if((findTitle !=null && findTitle.test(orderItem.productInfo.title)) || findTitle == null){
            if(findStatus==null || orderItem.status==findStatus){
              listOrder.push(orderItem)
            }
          }
        }
      }
    }
  }

    //sort
    const sortKey = req.query.sortKey
    const sortValue = req.query.sortValue
    if(sortKey && sortValue){
      listOrder.sort((a,b)=>{
        if(sortKey=='time'){
          if(sortValue=='desc'){
            if(a.createAt < b.createAt) return 1
            else return -1
          }
          else{
            if(a.createAt < b.createAt) return -1
            else return 1
          }
        }
        else if(sortKey =='price'){
          if(sortValue=='desc'){
            if(a.totalPrice < b.totalPrice) return 1
            else return -1
          }
          else{
            if(a.totalPrice < b.totalPrice) return -1
            else return 1
          }
        }
        else{
          if(sortValue=='desc'){
            if(a.productInfo.title < b.productInfo.title) return 1
            else return -1
          }
          else{
            if(a.productInfo.title < b.productInfo.title) return -1
            else return 1
          }
        }
      })
    }
    else{
      listOrder.reverse()
    }
    //end sort

    res.render("admin/pages/orders/index", {
      pageTitle: "Quản lý đơn hàng",
      orders: listOrder,
      keyword: objectSearch.keyword,
      filterStatus: filterStatus
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


