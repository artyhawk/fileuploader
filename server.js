const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

global.__basedir = __dirname;

var corsOptions = {
    // origin: "http://localhost:8081"
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE"
};

app.use(cors(corsOptions));

const initRoutes = require("./src/routes");

app.use(express.urlencoded({ extended: true, limit: "6mb" }));
initRoutes(app);

let port = 8080;
app.listen(port, () => {
    console.log(`Running at localhost:${port}`);
});
