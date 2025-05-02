module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash('error', 'Product title can not be empty')
    res.redirect("back")
    return
  }
  if (!req.body.product_category_id) {
    req.flash('error', 'Product category can not be empty')
    res.redirect("back")
    return
  }

  if (!req.body.size) {
    req.flash('error', 'Product size can not be empty')
    res.redirect("back")
    return
  }
  next()
}

module.exports.import = (req, res, next) =>{
  if (!req.file) {
    req.flash('error', 'File can not be empty');
    res.redirect("back");
    return
  }

  const fileName = req.file.originalname.split('.').pop()
  if (fileName != "json" && fileName != "xlsx") {
    req.flash('error', 'File must be .json or .xlsx');
    res.redirect("back");
    return
  }
  next()
} 