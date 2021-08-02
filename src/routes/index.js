const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");

let routes = app => {
  router.post("/api/upload/:originalName", controller.upload);
  router.get("/api/files", controller.getListFiles);
  router.get("/api/files/:name", controller.download);
  router.delete("/api/files/:name", controller.deleteFile);
  router.get("/api/pdf/:name", controller.showPdf);
  app.use(router);
};

module.exports = routes;
