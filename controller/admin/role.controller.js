const Role = require("../../model/role.model")
const systemConfig = require("../../config/system")

module.exports.index = async (req,res)=>{
    let find={
        deleted: false
    }

    const records = await Role.find(find)

    res.render("admin/pages/roles/index",{
        pageTitle: "Nhóm quyền",
        records : records
    })
}

module.exports.create = async (req,res)=>{
    res.render("admin/pages/roles/create",{
        pageTitle: "Thêm nhóm quyền",
    })
}

module.exports.createPost = async (req,res)=>{
    const record = new Role(req.body)

    await record.save()
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

module.exports.edit = async (req,res)=>{
    try {
        const id = req.params.id
        let find = {
            _id : id,
            deleted: false
        }

        const data = await Role.findOne(find)

        res.render("admin/pages/roles/edit",{
            pageTitle: "Sửa nhóm quyền",
            data: data
        })
        
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}

module.exports.editPatch = async (req,res)=>{

    try {
        if(req.params.id){
            const id = req.params.id

            await Role.updateOne({_id: id}, req.body)
            
            req.flash("success", "Cập nhật nhóm quyền thành công!")
        } 
        else{
            req.flash("error", "Bạn chưa điền!")
        }
    } catch (error) {
        req.flash("error", "Cập nhật nhóm quyền thất bại!")
    }
    res.redirect("back")
}

module.exports.deleteItem = async (req,res)=>{
    const id = req.params.id
    await Role.updateOne({_id: id}, 
        {
            deleted: true,
        }
    )
    res.redirect("back") // Quay lai trang truoc khi chuyen huong
}

module.exports.permissions = async (req,res)=>{
    let find = {
        deleted : false
    }

    const records = await Role.find(find)

    res.render("admin/pages/roles/permissions",{
        pageTitle: "Phân quyền",
        records : records
    })

}

module.exports.permissionsPatch = async (req,res)=>{
    const permissions = JSON.parse(req.body.permissions)

    for (const item of permissions) {
        await Role.updateOne({_id: item.id }, { permissions: item.permissions })
    }

    req.flash("success", "Cập nhật phân quyền thành công!")

    res.redirect("back")
}