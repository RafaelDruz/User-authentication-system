
const bodyParser = require("body-parser");
const express = require('express');
const app = express();
const session = require('express-session');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const userController = require("../user/UserController.js")
  
app.use(cors());

app.set('view engine', 'ejs');

app.use(cookieParser("senhacookie"));

app.use(session({
    secret: "hsyasbalsfgarrsgx", 
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: (1000 * 60 * 60 * 24)} 
}));
 
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use("/", userController);

module.exports = app;