const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

//cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});
//end cloudinary

const streamUpload = async (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

module.exports.upload = async(req, res, next) => {
  if (req.file) {
    async function upload(req) {
      let result = await streamUpload(req.file.buffer);
      req.body[req.file.fieldname] = result.secure_url
    }
    await upload(req);
  }
  next();
}
module.exports.uploadMutiple = async(req, res, next) => {
  if (req.files) {
    for (const key of Object.keys(req.files)) {
      let newArr = [];
      for (const item of req.files[key]) {
        try {
          const result = await streamUpload(item.buffer);
          newArr.push(result.url);
        } catch (error) {
          console.log(error);
        }
      }
      req.body[key] = newArr;
    }
  }
  next();
}