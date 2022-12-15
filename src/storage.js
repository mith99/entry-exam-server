const multer = require('multer')

const fileFilter = (req, file, cb)=>{
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true)

    }
    else{
        cb(null, false)

    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
    fileFilter: fileFilter
})



const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5
    }
})


module.exports = {upload}