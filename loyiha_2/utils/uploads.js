const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination : './public/uploads',
    filename : function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage,
    limits : {fileSize : 4000000},
    fileFilter : function(req, file, cb){
        checkFileType(file, cb)
    }
})


function checkFileType(file, cb) {
    const fileType = /jpg|png|jpeg|gif/
    const extname = fileType.test(path.extname(file.originalname).toLowerCase())
    const mimetype = fileType.test(file.mimetype)

    if(extname && mimetype){
        cb(null, true)
    }else{
        cb("Error : notogri fayl yuklandi")
    }
}

module.exports = upload 