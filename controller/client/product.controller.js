const Product = require("../../model/product.model") 
const User = require("../../model/user.model") 
const ProductCategory = require("../../model/product-category.model") 
const paginationHelper = require("../../helpers/pagination")

module.exports.index = async (req,res)=>{

    const find = {
      status: "active",
      deleted: false
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
    const products = await Product.find({
        status: "active",
        deleted: false
    }).limit(objectPagination.limit).sort(sort).skip(objectPagination.skip)
    

    for (const item of products) {
      for(const size of item.listSize){
          size.priceNew = (size.price * (100 - item.discountPercentage)/100).toFixed(0);
      }
    }

    if(req.query.sortKey=="price"){
      products.sort((a,b)=>{
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
    

    res.render("client/pages/products/index.pug",{
      pageTitle: "TRANG SẢN PHẨM",
      Products: products,
      pagination: objectPagination
    })
}

module.exports.detail = async (req,res)=>{
    try {
        const find = {
            deleted: false,
            slug : req.params.slugProduct,
            status: "active"
        }
    
        const product = await Product.findOne(find)

        if(product.product_category_id){
            const category = await ProductCategory.findOne({
                _id : product.product_category_id,
                status: "active",
                deleted: false
            })

            product.category = category
        }

        if(product.listSize){
          for(const item of product.listSize){
            item.priceNew = (item.price*(100-product.discountPercentage)/100).toFixed()
          }
        }
        for(const item of product.feedback){
          const user = await User.findOne({tokenUser: item.userToken})
          item.fullName = user.fullName
          item.thumbnail = user.thumbnail
        }

        const relatedProduct = await Product.find({
          deleted: false,
          product_category_id: product.product_category_id,
          status: "active" 
        })
        for (const item of relatedProduct) {
          for(const size of item.listSize){
              size.priceNew = (size.price * (100 - item.discountPercentage)/100).toFixed(0);
          }
        }
        console.log(product.sales)
        
        res.render("client/pages/products/detail.pug",{
            pageTitle: product.title,
            product: product,
            myToken: req.cookies.tokenUser,
            relatedProduct: relatedProduct
        })
    } catch (error) {
        res.redirect(`/products`) //chuyen huong den url
    }
}



module.exports.category = async(req, res)=>{
  //sort
  let sort = {}

  if(req.query.sortKey && req.query.sortValue){
      sort[req.query.sortKey] = req.query.sortValue
  }
  else{
      sort.position = "desc"
  }
  //end sort
  const slugCategory  = req.params.slugCategory;

  
  const category = await ProductCategory.findOne({
    slug: slugCategory,
    status: "active",
    deleted: false
  });
  const getSubCategory = async (parentId) => {
    const subs = await ProductCategory.find({
      parent_id: parentId,
      status: "active",
      deleted: false
    });

    let allSubs = [...subs];

    for(const sub of subs) {
      const childs = await getSubCategory(sub.id);
      allSubs = allSubs.concat(childs);
    }

    return allSubs;
  }
  
  const allCagegory = await getSubCategory(category.id);

  const allCagegoryId = allCagegory.map(item => item.id);
  const find = {
    product_category_id: {
      $in: [
        category.id,
        ...allCagegoryId
      ]
    },
    status: "active",
    deleted: false
  }

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

  const products = await Product.find(find).sort(sort).limit(objectPagination.limit).skip(objectPagination.skip);

  for (const item of products) {
    for(const size of item.listSize){
        size.priceNew = (size.price * (100 - item.discountPercentage)/100).toFixed(0);
    }
  }
  
  
  res.render("client/pages/products/index", {
    pageTitle: category.title,
    Products: products,
    pagination: objectPagination
  });

}

module.exports.feedback = async(req, res)=>{
  const slugProduct = req.params.slugProduct
  const rate = req.body.rating
  const commentData = req.body.description
  const userId = req.cookies.tokenUser

  const data={
    userToken: userId,
    rating: rate,
    comment: commentData,
    time: new Date()
  }


  const product = await Product.findOne({slug: slugProduct})
  product.feedback.push(data) 
  await product.save()


  let ratingCnt = 1
  let ratingAvg = 5
  product.feedback.forEach(item=>{
    ratingCnt+=1
    ratingAvg+=(parseInt(item.rating))
  })
  ratingAvg/=ratingCnt
  await Product.updateOne(
    {slug: slugProduct},
    {ratingNumber: Number(ratingAvg.toFixed(2))}
  )
  req.flash("success", `Đánh giá thành công`)
  res.redirect("back")
}

