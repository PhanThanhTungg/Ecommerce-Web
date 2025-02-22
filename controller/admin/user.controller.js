const User = require("../../model/user.model")

const Order = require("../../model/order.model")
const Product = require("../../model/product.model")

const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")


const systemConfig = require("../../config/system")

module.exports.index = async (req,res)=>{
    let find={
        deleted: false
    }
    //search
    const objectSearch = searchHelper(req.query)
    if(objectSearch.regex){
        find.fullName = objectSearch.regex
    }

    //sort
    let sort = {}

    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    }
    else{
        sort.createdAt = "desc"
    }
    //end sort


    //Pagigation
    let objectPagination = paginationHelper(req,await User.countDocuments(find),1,2);
    //End pagigation

    //status
    if(req.query.status) find.status = req.query.status  // kiểm tra xem có yêu cầu request không, sau dấu ? trên url
    const filterStatus = filterStatusHelper(req.query)

    const records = await User.find(find).select("-password").sort(sort).limit(objectPagination.limit)
    .skip(objectPagination.skip)
    for(const record of records){
      let cntSuccess = 0
      let cntFail = 0
      let totalValue = 0
      const orders= await Order.find({tokenUser: record.tokenUser})
      for (const order of orders){
        for (const product of order.products){
          const productItem = await Product.findOne({
            _id: product.product_id, 
            status: "active",
            deleted: false,
          })

          const sizeInfo = productItem.listSize.find(i=>{
            return i.id == product.size_id
          })

          let priceNew = (sizeInfo.price * (100 - productItem.discountPercentage)/100).toFixed(0)
          if(product.status == "biBom") cntFail+=product.quantity
          if(product.status == "daThanhToan"){
            cntSuccess += product.quantity
            totalValue += priceNew*product.quantity
          } 
        }
      }
      record.cntSuccess = cntSuccess
      record.cntFail = cntFail
      record.totalValue = totalValue
      record.rank = totalValue >= 100000000?"Chiến tướng":(
        totalValue >=50000000? "Cao thủ":(
          totalValue >=10000000?"Kim cương":( 
            totalValue >=5000000?"Vàng":(
              totalValue >=1000000?"Bạc":(
                totalValue >=500000?"Đồng": "Vô hạng"
              )
            )
          )
        )
      )
      await User.updateOne({_id: record.id},
        {rank: record.rank,
          cntSuccess: record.cntSuccess,
          cntFail: record.cntFail,
          totalValue: record.totalValue
      })
    }
    res.render("admin/pages/users/index",{
        pageTitle: "Danh sách tài khoản",
        records : records,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}

module.exports.changeStatus = async (req,res)=>{
    const status = req.params.status  //lay ra gia tri params dong ben route  // req.query: lay sau dau ?
    const id = req.params.id

    await User.updateOne({_id: id}, {status: status})
    // Product.updateOne({id},{thuoc tinh muon thay doi})

    req.flash('success', 'Thay đổi trạng thái thành công!')

    res.redirect("back") // Quay lai trang truoc khi chuyen huong
}

module.exports.deleteItem = async (req,res)=>{
    const id = req.params.id
    await User.updateOne({_id: id}, 
        {
            deleted: true,
        }
    )
    res.redirect("back")
}

