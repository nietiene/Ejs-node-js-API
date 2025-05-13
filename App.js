const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const userRoutes = require("./router.js");
const App = express();
const session = require("express-session");

App.use(session({
    secret: 'factorise@123',
    resave: false,
    saveUninitialized: true,
}));
// Initialize Middleware
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({extended: true}));
App.set("view engine", "ejs");
App.set("views", path.join(__dirname, "views"));
App.use("/", userRoutes);

App.listen(process.env.PORT, () => console.log(`http://localhost:${process.env.PORT}`));