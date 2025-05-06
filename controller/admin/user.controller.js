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
    let objectPagination = paginationHelper(req,await User.countDocuments(find),1,8);
    //End pagigation

    //status
    if(req.query.status) find.status = req.query.status  // kiểm tra xem có yêu cầu request không, sau dấu ? trên url
    const filterStatus = filterStatusHelper(req.query)

    const records = await User.find(find).select("-password").sort(sort).limit(objectPagination.limit)
    .skip(objectPagination.skip)

    
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

