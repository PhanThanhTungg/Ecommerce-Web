// cau hinh file anh gui len
const multer  = require('multer')

module.exports = ()=>{
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './public/uploads/')
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now()
          cb(null, `${uniqueSuffix}-${file.originalname}`) // dinh dang lai ten anh // vd: 312312312-ex.png
        }
    })
    return storage
}