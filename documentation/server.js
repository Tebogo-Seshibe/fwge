var express = require("express");
var path 	= require("path");
var app 	= express();

/*! Root files */
app.get("/", 			function(req, res) { res.sendFile(path.join(__dirname + "/www/documentation/index.html")); });
app.get("/style.css", 	function(req, res) { res.sendFile(path.join(__dirname + "/www/documentation/style.css")); });
app.get("/script.js", 	function(req, res) { res.sendFile(path.join(__dirname + "/www/documentation/script.js")); });
app.get("/document.js", function(req, res) { res.sendFile(path.join(__dirname + "/www/documentation/document.js")); });
/*! Root files */