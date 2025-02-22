const Account = require("../../model/account.model")
const Role = require("../../model/role.model")

const systemConfig = require("../../config/system")

var md5 = require('md5'); // thư viện md5: mã hóa pw
const { ReadConcern } = require("mongodb");

module.exports.index = async (req, res) => {
  let find = {
    deleted: false
  }

  const records = await Account.find(find).select("-password -token")

  for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false
    });
    if (role) record.role = role;
    else if ("role_id" in record)
      await Account.updateOne({ _id: record.id }, { $unset: {role_id:""} })
  }

  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  })
}

module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false
  })
  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo mới tài khoản",
    roles: roles
  })
}

module.exports.createPost = async (req, res) => {
  const emailExit = await Account.findOne({
    email: req.body.email,
    deleted: false
  })

  if (emailExit) {
    req.flash("error", "Email đã tồn tại!")
    res.redirect("back")
  }
  else {
    req.body.password = md5(req.body.password) // mã hóa pw

    const record = new Account(req.body)

    await record.save()
    res.redirect(`${systemConfig.prefixAdmin}/accounts`)
  }
}

module.exports.edit = async (req, res) => {
  const find = {
    _id: req.params.id,
    deleted: false,
  };

  try {
    const data = await Account.findOne(find);

    const roles = await Role.find({
      deleted: false,
    });

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      data: data,
      roles: roles,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  const emailExit = await Account.findOne({
    // _id : {$ne: id} // $ne: khong bang,
    email: req.body.email,
    deleted: false
  })

  const checkEmail = await Account.findOne({
    _id: id,
    deleted: false
  })

  if (emailExit && req.body.email != checkEmail.email) {
    req.flash("error", "Email đã tồn tại!")
    res.redirect("back")
  }
  else {
    if (req.body.password) {
      req.body.password = md5(req.body.password); // giải mã lại pw
    } else {
      delete req.body.password;
    }

    await Account.updateOne({
      _id: id
    }, req.body);

    req.flash("success", "Cập nhật tài khoản thành công!")

    res.redirect("back");
  }
};

module.exports.changeStatus = async (req, res) => {
  const status = req.params.status  //lay ra gia tri params dong ben route  // req.query: lay sau dau ?
  const id = req.params.id

  await Account.updateOne({ _id: id }, { status: status })
  // Product.updateOne({id},{thuoc tinh muon thay doi})

  req.flash('success', 'Thay đổi trạng thái thành công!')

  res.redirect("back") // Quay lai trang truoc khi chuyen huong
}

module.exports.deleteItem = async (req, res) => {
  const id = req.params.id
  await Account.updateOne({ _id: id },
    {
      deleted: true,
    }
  )
  res.redirect("back")
}

