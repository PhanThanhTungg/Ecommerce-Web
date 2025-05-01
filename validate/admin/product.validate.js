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