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

function error_404()
{
    return new Response('error', 404,
    {
        message: "Could not understand the message sent"
    });
}

function get_project(request)
{
    var response = new Response("PROJECT", 200);

    if (request.option === 'ALL')
    {
        response.data = [];
        Object.keys(projects).forEach(function(item)
        {
            response.data.push(JSON.parse(fs.readFileSync(projects[item])));
        });
    }
    else
    {
        var project = projects[request.option];

        if (!project) response = error_404();
        else response.data = JSON.parse(fs.readFileSync(project));
    }

    return response;
}

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

app.get(/^\/$/, 			            function get(req, res) { res.sendFile(path.resolve(__dirname + "\\index.html"));                    });
app.get(/^\/style.css$/,	            function get(req, res) { res.sendFile(path.resolve(__dirname + "\\style.css"));                     });
app.get(/^\/editor.js$/,	            function get(req, res) { res.sendFile(path.resolve(__dirname + "\\editor.js"));                     });
app.get(/^\/fwge\.js$/, 	            function get(req, res) { res.sendFile(path.resolve(__dirname + "\\..\\build\\fwge.js"));            });
app.get(/^\/fwge\.map\.js$/,            function get(req, res) { res.sendFile(path.resolve(__dirname + "\\..\\build\\fwge.map.js"));        });
app.get(/^\/.+\.js$/,	                function get(req, res) { res.sendFile(path.resolve(__dirname + "\\js\\" + unescape(req.url)));      });
app.get(/^\/.+(bmp|jpg|png|gif|ico)$/,	function get(req, res) { res.sendFile(path.resolve(__dirname + "\\images" + unescape(req.url)));    });
app.get(/^\/files\/.+$/, 	            function get(req, res) { res.sendFile(path.resolve(__dirname + unescape(req.url)));                 });
app.get(/.+/,                           function get(req, res) { res.sendFile(path.resolve(__dirname + "\\error-404.html"));                });

app.use(body.urlencoded({ extended: true }));
app.use(body.json());
app.post(/^\/$/, function post(req, res)
{
    var request = req.body;
    var response;

    switch (request.type)
    {
        case 'PROJECT': response = get_project(request);    break;
        case 'FILE':    response = get_file(request);       break;
        default:        response = error_404();             break;
    }

    res.send(response);
});

app.listen(3000, function listen(e) { console.log("Server running on 127.0.0.1:3000"); });