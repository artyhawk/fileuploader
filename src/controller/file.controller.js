const uploadFile = require("../middleware/upload");
const { v4: uuidv4 } = require("uuid");
const { promisify } = require("bluebird");
const libre = require("libreoffice-convert");
const path = require("path");
const fs = require("fs").promises;
let lib_convert = promisify(libre.convert);
const merge = require("easy-pdf-merge");

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
      message: `Could not upload the file: ${req.params.originalName}. ${err.message}`,
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

const showPdf = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/resources/static/assets/uploads/";

  res.sendFile(directoryPath + fileName);
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

const convertFileToPdf = async (req, res) => {
  try {
    const fileName = req.params.originalName;

    if (!fileName) {
      res.status(404).json({ message: "File not found" });
    }

    if (fileName) {
      const inputPath = __basedir + `/resources/static/assets/uploads/${fileName}`;

      const rightExtens = fileName.split(".")[0];

      const outputPath = __basedir + `/resources/static/assets/uploads/${rightExtens}.pdf`;
      // Read a file
      let data = await fs.readFile(inputPath);
      let done = await lib_convert(data, ".pdf", undefined);
      await fs.writeFile(outputPath, done);
      await fs.unlink(inputPath);
      let buff = await fs.readFile(outputPath);
      let base64data = buff.toString("base64");
      res.json({ dataForSign: base64data, fileName: `${fileName.split(".")[0]}.pdf` });
    }
  } catch (error) {
    res.json(error.message);
  }
};

const uploadBase64 = async (req, res) => {
  try {
    const originalFilename = req.params.originalName;
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!", success: false });
    }

    const fileName = req.file.filename;
    const filePath = __basedir + `/resources/static/assets/uploads/${fileName}`;
    let buff = await fs.readFile(filePath);
    let base64data = buff.toString("base64");

    res.status(200).send({
      name: fileName,
      orginalName: originalFilename,
      dataForSign: base64data,
      success: true
    });
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.params.originalName}. ${err.message}`,
      success: false
    });
  }
};
const convertBase64 = async (req, res) => {
  try {
    const fileName = req.params.originalName;
    if (!fileName) {
      res.status(404).json({ message: "File not found" });
    }

    if (fileName) {
      const inputPath = __basedir + `/resources/static/assets/uploads/${fileName}`;
      let buff = await fs.readFile(inputPath);
      let base64data = buff.toString("base64");
      res.json({ dataForSign: base64data });
    }
  } catch (err) {
    res.status(500).send({
      message: `Could not convert the file: ${req.params.originalName}. ${err.message}`,
      success: false
    });
  }
};

const mergePdf = async (req, res) => {
  try {
    const originalFileName = req.params.originalName;
    const signedFilePartName = req.params.signedName;
    const originalFilePath = __basedir + `/resources/static/assets/uploads/${originalFileName}`;

    // const fileName = req.file.filename;
    const signedFilePath = __basedir + `/resources/static/assets/uploads/${signedFilePartName}`;

    const uniqueName = uuidv4();

    const mergedPdfPath = __basedir + `/resources/static/assets/uploads/${uniqueName}.pdf`;
    await merge([originalFilePath, signedFilePath], mergedPdfPath, function (err) {
      if (err) {
        return console.log(err);
      }
      fs.unlink(signedFilePath, err => {
        if (err) {
          console.error(err);
          res.status(500).json({
            success: false,
            message: "Server error has been occured"
          });
        }
      });
    });

    res.status(200).send({
      signedFileName: `${uniqueName}.pdf`,
      success: true
    });
  } catch (err) {
    res.status(500).send({
      message: `Server error. ${err.message}`,
      success: false
    });
  }
};

module.exports = {
  upload,
  getListFiles,
  download,
  deleteFile,
  showPdf,
  convertFileToPdf,
  uploadBase64,
  convertBase64,
  mergePdf
};
