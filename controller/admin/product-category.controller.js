const ProductCategory = require("../../model/product-category.model")

const systemConfig = require("../../config/system")

const createTreeHelper = require("../../helpers/createTree")
const paginationHelper = require("../../helpers/pagination")

module.exports.index = async(req,res)=>{

    let find={
        deleted: false
    }
    // //Pagigation
    // const countProductCategory = await ProductCategory.countDocuments(find) // đếm số sản phẩm theo bộ lọc find
    // let objectPagination = paginationHelper(
    //     {
    //         currentPage : 1,
    //         limit : 6
    //     },
    //     req.query,
    //     countProductCategory
    // )
    // //End pagigation

    const records = await ProductCategory.find(find)

    const newRecords =  createTreeHelper.tree(records)

    res.render("admin/pages/products-category/index.pug",{
        pageTitle: "Danh mục sản phẩm",
        records: newRecords,
        // pagination: objectPagination
    })
}

module.exports.create = async(req,res)=>{

    let find={
        deleted: false,
        status: "active"
    }

    const records = await ProductCategory.find(find)

    const newRecords = createTreeHelper.tree(records)

    res.render("admin/pages/products-category/create.pug",{
        pageTitle: "Thêm mới danh mục",
        records: newRecords
    })
}

module.exports.createPost = async (req,res)=>{
    if(req.body.position == "") {
        const count = await ProductCategory.countDocuments()
        req.body.position = count + 1
    } else {
        req.body.position = parseInt(req.body.position)
    }    

    const record = new ProductCategory(req.body)
    await record.save(); // save vao database

    res.redirect(`${systemConfig.prefixAdmin}/products-category`) //chuyen huong den url
}

module.exports.deleteItem = async (req,res)=>{
    const id = req.params.id

    // await ProductCategory.deleteOne({_id: id}) : xoa cung

    await ProductCategory.updateOne({_id: id}, 
        {
            deleted: true,
            deletedAt : new Date() // lay ra tgian hien tai
        }
    )

    res.redirect("back") // Quay lai trang truoc khi chuyen huong
}

module.exports.changeStatus = async (req,res)=>{
    const status = req.params.status  //lay ra gia tri params dong ben route  // req.query: lay sau dau ?
    const id = req.params.id

    await ProductCategory.updateOne({_id: id}, {status: status})
    // Product.updateOne({id},{thuoc tinh muon thay doi})

    req.flash('success', 'Thay đổi trạng thái thành công!')

    res.redirect("back") // Quay lai trang truoc khi chuyen huong
}

module.exports.edit = async (req,res)=>{
    try {
        const find = {
            deleted: false,
            status: "active",
            _id : req.params.id
        }
    
        const product = await ProductCategory.findOne(find)
    
        const records = await ProductCategory.find({deleted: false, status: "active"})

        const newRecords = createTreeHelper.tree(records)
    
        res.render("admin/pages/products-category/edit.pug",{
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            product: product,
            records: newRecords
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products-category`) //chuyen huong den url
    }
}

module.exports.editPatch = async (req,res)=>{
    req.body.position = parseInt(req.body.position)
    // if(req.file){
    //     req.body.thumbnail = `/uploads/${req.file.filename}` // cap nhat anh o local
    // }
    // //req.file tra ve object file anh   
    try {
        await ProductCategory.updateOne(
            {_id : req.params.id},
            req.body
        )
        req.flash('success', 'Cập nhật thành công!')
    } catch (error) {
        req.flash('success', 'Cập nhật Thất bại!')
    }

    res.redirect(`back`) //chuyen huong den url
}

module.exports.changeMulti = async (req,res)=>{
    const type = req.body.type
    const ids = req.body.ids.split(", ")
    switch(type){
        case "active":
            await ProductCategory.updateMany({_id:{$in: ids}}, {status: "active"})
            req.flash('success', 'Thay đổi trạng thái thành công!')
            break
        case "inactive":
            await ProductCategory.updateMany({_id:{$in: ids}}, {status: "inactive"})
            req.flash('success', 'Thay đổi trạng thái thành công!')
            break
        case "delete-all":
            await ProductCategory.updateMany({_id:{$in: ids}}, {deleted: "true", deletedAt: new Date()})
            req.flash('success', 'Xóa thành công!')
            break
        case "change-position":
            for(const item of ids){
                let [id, position] = item.split("-")
                position = parseInt(position)

                await ProductCategory.updateOne({_id: id}, {position: position})
            }
            req.flash('success', 'Thay đổi vị trí thành công!')
            break
        default:
            break
    }
    res.redirect("back") // Quay lai trang truoc khi chuyen huong
     
}


