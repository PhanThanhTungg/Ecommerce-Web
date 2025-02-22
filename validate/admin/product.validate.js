module.exports.createPost=(req,res,next)=>{
    if(!req.body.title){
        req.flash('error', 'Product title can not be empty')
        res.redirect("back")
        return
    }
    next()
}