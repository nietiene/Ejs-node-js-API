const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const userRoutes = require("./router.js");
const App = express();

// Initialize Middleware
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({extended: true}));
App.set("view engine", "ejs");
App.set("views", path.join(__dirname, "views"));
App.use("/", userRoutes);

App.listen(process.env.PORT, () => console.log(`http://localhost:${process.env.PORT}`));