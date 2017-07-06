"use strict";

var express     = require('express');
var fs 		    = require('fs');
var body        = require('body-parser'); 
var path        = require('path'); 
var app         = express();
var projects    = {};

function Response(name = "", code = -1, data = undefined)
{
    this.name = name;
    this.code = code;
    this.data = data;
}
/*
fs.readdirSync('./editor/projects/').forEach(function(file)
{
    let stats = fs.lstatSync('./editor/projects/' + file);
    let index = file.indexOf('.json');

    if (stats.isFile() && index > -1)
    {
        var name = file.substring(0, index);
        projects[name] = './editor/projects/' + file;
    }
});
*/
app.get(/^\/$/, 			            function get(req, res) { res.sendFile(path.resolve(__dirname + "\\index.html"));                    });
app.get(/^\/style.css$/,	            function get(req, res) { res.sendFile(path.resolve(__dirname + "\\style.css"));                     });
app.get(/^\/test.js$/,                  function get(req, res) { res.sendFile(path.resolve(__dirname + "\\test.js"));                       });
app.get(/^\/fwge\.js$/, 	            function get(req, res) { res.sendFile(path.resolve(__dirname + "\\..\\build\\fwge.js"));            });

app.use(body.urlencoded({ extended: true }));
app.use(body.json());
app.post(/^\/$/, function post(req, res)
{
    var request = req.body;
    var response = { code: 404, data: "Could not find what you are looking for." };

    let text = "";
    if (!!request.path)
    {
        try
        {
            console.log(__dirname + "/" + request.path);
            text = fs.readFileSync(__dirname + "/" + request.path,"utf-8");
        }
        catch(e)
        {
            response.data = "Failed to read file.";
        }

        response = { code: 200, data: escape(text) };
    }

    res.send(response);
});

app.listen(3000, function listen(e) { console.log("Server running on 127.0.0.1:3000"); });
