module.exports.createPost=(req,res,next)=>{
    //validate lai data
    if(!req.body.title){
        req.flash('error', 'Bạn chưa nhập tiêu đề ạ!')
        res.redirect("back")
        return
        // nếu chưa nhập tiêu đề thì back lại và return luôn
    }
    next()
}