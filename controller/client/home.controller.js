const Product = require("../../model/product.model")
const paginationHelper = require("../../helpers/pagination")
module.exports.index = async (req, res) => {
    const find = {
        status: "active",
        deleted: false
      }

    const productsFeatured = await Product.find({
        featured: "1",
        status: "active",
        deleted: false,
    })

    for (const item of productsFeatured) {
        for(const size of item.listSize){
            size.priceNew = (size.price * (100 - item.discountPercentage)/100).toFixed(0);
        }
    }
    
    //sort
    let sort = {}

    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    }
    else{
        sort.position = "desc"
    }
    //end sort

    //Pagigation
    const countProduct = await Product.countDocuments(find) // đếm số sản phẩm theo bộ lọc find
    let objectPagination = paginationHelper(
        {
          currentPage : 1,
          limit : 12
        },
        req.query,
        countProduct
    )
    //End pagigation


    const productsNew = await Product.find({
        status: "active",
        deleted: false,
    }).limit(objectPagination.limit).sort(sort).skip(objectPagination.skip)

    for (const item of productsNew) {
        for(const size of item.listSize){
            size.priceNew = (size.price * (100 - item.discountPercentage)/100).toFixed(0);
        }
    }

    if(req.query.sortKey=="price"){
        productsNew.sort((a,b)=>{
          if(req.query.sortValue=="desc"){
            if(a.listSize[0].priceNew < b.listSize[0].priceNew) return 1
            else return -1
          }
          else{
            if(a.listSize[0].priceNew < b.listSize[0].priceNew) return -1
            else return 1
          }
        })
      }

    let sort2 ={}
    sort2.sales = "desc"
    const topProduct = await Product.find({
        status: "active",
        deleted: false
    }).limit(10).sort(sort2)

    for (const item of topProduct) {
        for(const size of item.listSize){
            size.priceNew = (size.price * (100 - item.discountPercentage)/100).toFixed(0);
        }
    }

    res.render("client/pages/home/index", {
        pageTitle: "Trang chủ",
        productsFeatured : productsFeatured,
        productsNew: productsNew,
        pagination: objectPagination,
        topProduct: topProduct
    })




//   // Sản phẩm nổi bật
//   const productsFeatured = await Product.find({
//     featured: "1",
//     status: "active",
//     deleted: false,
//   }).sort({ position: "desc" }).limit(6);

//   for (const item of productsFeatured) {
//     item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
//   }
//   // Hết Sản phẩm nổi bật

//   // Sản phẩm mới nhất
//   const productsNew = await Product.find({
//     status: "active",
//     deleted: false,
//   }).sort({ position: "desc" }).limit(6);

//   for (const item of productsNew) {
//     item.priceNew = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
//   }
//   // Hết Sản phẩm mới nhất

//   res.render("client/pages/home/index", {
//     pageTitle: "Trang chủ",
//     productsFeatured: productsFeatured,
//     productsNew: productsNew
//   });
}

module.exports.contact = async(req, res) =>{
    res.render("client/pages/contact/index", {
    })
}

module.exports.contactPost = async(req, res) =>{
    req.flash("success", "Gửi feedback thành công, chúng tôi sẽ liên lạc sớm nhất có thể")
    res.redirect("back")
}