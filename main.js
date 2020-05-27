//Created By Olin Johnson
var port = process.env.PORT || 3000;
var express = require('express');
var app = express();
var ejs = require('ejs')
var layouts = require('express-ejs-layouts');
var homeControl = require('./controllers/homeController');


app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(layouts);


app.get('/', homeControl.homePage);
app.get('/minesweeper-play/:mode', homeControl.play);


app.listen(port, () => {
    console.log(`The server is up and running on port ${port}`);
});