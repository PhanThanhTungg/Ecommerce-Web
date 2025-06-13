const Product = require("../../model/product.model")
const systemConfig = require("../../config/system")

const filterStatusHelper = require("../../helpers/filterStatus")
const searchHelper = require("../../helpers/search")
const paginationHelper = require("../../helpers/pagination")

const createTreeHelper = require("../../helpers/createTree")
const ProductCategory = require("../../model/product-category.model")
const Account = require("../../model/account.model")

const xlsx = require('xlsx');

module.exports.index = async (req, res) => {

  let find = {
    deleted: false,
  }

  //status
  if (req.query.status) find.status = req.query.status  // kiểm tra xem có yêu cầu request không, sau dấu ? trên url
  const filterStatus = filterStatusHelper(req.query)

  //search
  const keySearch = req.query.keyword;
  if (keySearch) find.title = new RegExp(keySearch, "i");

  //sort
  let sort = {}

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  }
  else {
    sort.position = "desc"
  }
  //end sort


  //Pagigation
  const [totalProduct, currentPage, limit] = [await Product.countDocuments(find), 1, 8]
  const objectPagination = await paginationHelper(req, totalProduct, currentPage, limit)

  //End pagigation
  const products = await Product.find(find).limit(objectPagination.limit)
    .skip(objectPagination.skip)
    .sort(sort) // asc

  for (const product of products) {
    product.listPrice = []
    product.listSize.forEach(item => {
      product.listPrice.push({ size: item.size, price: item.price })
    })
    const user = await Account.findOne({ _id: product.createBy.account_id })
    const category = await ProductCategory.findOne({ _id: product.product_category_id }).select("title")
    product.categoryTitle = category.title
    if (user) {
      product.accountFullName = user.fullName
    }

    const updateBy = product.updatedBy[product.updatedBy.length - 1]
    if (updateBy) {
      const userUpdated = await Account.findOne({
        _id: updateBy.account_id
      })

      updateBy.accountFullName = userUpdated.fullName
    }
  }


  res.render("admin/pages/products/index.pug", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: keySearch,
    pagination: objectPagination
  })
}

module.exports.changeStatus = async (req, res) => {
  const status = req.params.status  //lay ra gia tri params dong ben route  // req.query: lay sau dau ?
  const id = req.params.id

  await Product.updateOne({ _id: id }, { status: status })
  // Product.updateOne({id},{thuoc tinh muon thay doi})

  req.flash('success', 'Thay đổi trạng thái thành công!')

  res.redirect("back") // Quay lai trang truoc khi chuyen huong
}

module.exports.changeMulti = async (req, res) => {
  const type = req.body.type
  const ids = req.body.ids.split(", ")
  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" })
      req.flash('success', 'Change status successfully!')
      break
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" })
      req.flash('success', 'Change status successfully!')
      break
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },  // lay ra cac ban ghi co id thuoc ids da split 
        {
          deleted: "true",
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
          }
        })
      req.flash('success', 'Delete successfully!')
      break
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-")
        position = parseInt(position)

        await Product.updateOne({ _id: id }, { position: position })
      }
      req.flash('success', 'Change position successfully')
      break
    default:
      break
  }
  res.redirect("back") // Quay lai trang truoc khi chuyen huong

}

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id
  await Product.updateOne({ _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date()
      }
    }
  )
  res.redirect("back") // Quay lai trang truoc khi chuyen huong
}

module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
    status: "active"
  }
  const category = await ProductCategory.find(find)

  const newCategory = createTreeHelper.tree(category)

  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    category: newCategory
  })
}
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const { RunCommandCursor } = require("mongodb")
//cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});
//end cloudinary
module.exports.createPost = async (req, res) => {
  const sizes = req.body.size
  const prices = req.body.price
  const stocks = req.body.stock
  var listSize = []
  if (typeof sizes == "string") {
    var objectTmp = {
      size: sizes,
      price: prices,
      stock: stocks
    }
    listSize.push(objectTmp)
  }
  else {
    sizes.forEach((item, index) => {
      const objectTmp = {
        size: item,
        price: prices[index],
        stock: stocks[index]
      }
      listSize.push(objectTmp)
    });
  }


  delete req.body.size
  delete req.body.price
  delete req.body.stock

  req.body.listSize = listSize

  req.body.discountPercentage = parseInt(req.body.discountPercentage)

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  req.body.createBy = {
    account_id: res.locals.user.id
  }

  const product = new Product(req.body)
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`) //chuyen huong den url
}

module.exports.import = async (req, res) => {
  try {
    const file = req.file;
    let jsonData;

    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      jsonData = xlsx.utils.sheet_to_json(worksheet);
    } else if(file.mimetype === 'application/json') {
      const buffer = file.buffer.toString("utf-8");
      jsonData = JSON.parse(buffer);
    }

    for (const item of jsonData) {
      if (item.listSize == []) continue;
      if(!item.position){
        const countProducts = await Product.countDocuments();
        item.position = countProducts + 1;
      }
      const product = new Product(item);
      await product.save();
    }

    req.flash('success', 'Import successfully!');
    res.redirect(`${systemConfig.prefixAdmin}/products`);

  } catch (error) {
    console.log(error);
    req.flash('error', 'Import failed!');
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }



}

module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }

    const product = await Product.findOne(find)

    const category = await ProductCategory.find({ deleted: false, status: "active" })

    const newCategory = createTreeHelper.tree(category)

    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory
    })
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`) //chuyen huong den url
  }
}

module.exports.editPatch = async (req, res) => {
  req.body.discountPercentage = parseInt(req.body.discountPercentage)
  const productId = req.params.id
  const product = await Product.findOne({
    _id: productId
  }).select("thumbnail title slug listSize discountPercentage status")

  const sizes = req.body.size
  const prices = req.body.price
  const stocks = req.body.stock
  var listSize = []
  if (typeof sizes == "string") {
    var objectTmp = {
      size: sizes,
      price: prices,
      stock: stocks
    }
    for (const item of product.listSize) {
      if (item.size == sizes) {
        objectTmp = item
        objectTmp.price = prices
        objectTmp.stock = stocks
      }
    }
    listSize.push(objectTmp)
  }
  else {
    for (let i = 0; i < sizes.length; i++) {
      var objectTmp = {}
      objectTmp = {
        size: sizes[i],
        price: prices[i],
        stock: stocks[i]
      }
      for (const item of product.listSize) {
        if (item.size == sizes[i]) {
          objectTmp = item
          objectTmp.price = prices[i]
          objectTmp.stock = stocks[i]
        }
      }
      listSize.push(objectTmp)
    }
  }
  delete req.body.size
  delete req.body.price
  delete req.body.stock

  req.body.listSize = listSize

  // if(req.file){
  //     req.body.thumbnail = `/uploads/${req.file.filename}` // cap nhat anh o local
  // }
  // //req.file tra ve object file anh 


  try {
    const objectUpdatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    };

    await Product.updateOne({
      _id: req.params.id,
      deleted: false
    }, {
      ...req.body,
      $push: { updatedBy: objectUpdatedBy }
    });
    req.flash('success', 'Cập nhật thành công!')
  } catch (error) {
    req.flash('error', 'Cập nhật Thất bại!')
  }

  res.redirect(`back`) //chuyen huong den url
}

module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    }

    const product = await Product.findOne(find)

    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product
    })
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`) //chuyen huong den url
  }
}
