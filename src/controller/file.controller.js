const uploadFile = require("../middleware/upload");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const upload = async (req, res) => {
    try {
        const originalFilename = req.params.originalName;
        await uploadFile(req, res);

        if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!", success: false });
        }

        const fileName = req.file.filename;

        res.status(200).send({
            name: fileName,
            orginalName: originalFilename,
            success: true
        });
    } catch (err) {
        res.status(500).send({
            message: `Could not upload the file: ${req.file.originalname}. ${err}`,
            success: false
        });
    }
};

const getListFiles = (req, res) => {
    // const directoryPath = __basedir + "/resources/static/assets/uploads/";

    // fs.readdir(directoryPath, function (err, files) {
    //     if (err) {
    //         res.status(500).send({
    //             message: "Unable to scan files!"
    //         });
    //     }

    //     let fileInfos = [];

    //     files.forEach(file => {
    //         fileInfos.push({
    //             name: file,
    //             url: baseUrl + file
    //         });
    //     });

    //     res.status(200).send(fileInfos);
    // });
    res.status(401).send({
        message: "Unauthorized, no credentials"
    });
};

const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/static/assets/uploads/";

    res.download(directoryPath + fileName, fileName, err => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
                success: false
            });
        }
    });
};

const deleteFile = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + `/resources/static/assets/uploads/${fileName}`;

    fs.unlink(directoryPath, err => {
        if (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Server error has been occured"
            });
        }

        res.status(200).json({
            success: true,
            message: "File was removed"
        });
    });
};

module.exports = {
    upload,
    getListFiles,
    download,
    deleteFile
};
