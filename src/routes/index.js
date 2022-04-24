const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");

let routes = app => {
  router.post("/api/upload/:originalName", controller.upload);
  router.get("/api/files", controller.getListFiles);
  router.get("/api/files/:name", controller.download);
  router.delete("/api/files/:name", controller.deleteFile);
  router.get("/api/pdf/:name", controller.showPdf);
  router.get("/api/file/converter/:originalName", controller.convertFileToPdf);
  router.post("/api/upload/base64/:originalName", controller.uploadBase64);
  router.get("/api/files/base64/:originalName", controller.convertBase64);
  router.get("/api/pdf/merge/:originalName/:signedName", controller.mergePdf);
  app.use(router);
};

module.exports = routes;
