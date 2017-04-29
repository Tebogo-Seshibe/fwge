var express = require('express');
var fs 		= require('fs');
var body    = require('body-parser'); 
var app     = express();

function Response(name = "", code = -1, data = undefined)
{
	this.name = name;
	this.code = code;
	this.data = data;
}

app.use(body.urlencoded({ extended: true }));
app.use(body.json());

app.get(/^\/$/, 			    function(req, res) { res.sendFile(__dirname + "\\index.html"); });
app.get(/^\/style.css$/,	    function(req, res) { res.sendFile(__dirname + "\\style.css"); });
app.get(/^\/editor.js$/,	    function(req, res) { res.sendFile(__dirname + "\\editor.js"); });
app.get(/^\/fwge\.js$/, 	    function(req, res) { res.sendFile(__dirname + "\\..\\build\\fwge.js"); });
app.get(/^\/fwge\.map\.js$/,    function(req, res) { res.sendFile(__dirname + "\\..\\build\\fwge.map.js"); });
app.get(/.+/,                   function(req, res) {  });

app.post(/^\/$/, function(req, res)
{
    var request = req.body;
    var response = new Response();

    switch(request.type)
    {
        default: error_404(response); break;
    }

    res.send(response);
});

app.listen(3000);
