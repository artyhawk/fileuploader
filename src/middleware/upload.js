const util = require("util");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const maxSize = 25 * 1024 * 1024;

let originalNameOfFile = "";
let newNameOfFile = "";

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __basedir + "/resources/static/assets/uploads/");
    },

    filename: (req, file, cb) => {
        originalNameOfFile = file.originalname;
        const lastDot = originalNameOfFile.lastIndexOf(".");
        const ext = originalNameOfFile.substring(lastDot + 1);
        const uniqueName = uuidv4();
        newNameOfFile = (uniqueName + "." + ext).trim();
        cb(null, newNameOfFile);
    }
});

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize }
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
