const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const userRoutes = require("./router.js");
const App = express();
const cors = require("cors");
const session = require("express-session");

App.use(session({
    secret: 'factorise@123',
    resave: false,
    saveUninitialized: true,
}));

App.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
App.use(function(req, res, next) {
  res.set('Cache-Control', 'no-store');
  next();
});
// Initialize Middleware
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({extended: true}));
App.set("view engine", "ejs");
App.use(express.json());
App.set("views", path.join(__dirname, "views"));
App.use("/", userRoutes);

App.listen(process.env.PORT, () => console.log(`http://localhost:${process.env.PORT}`));