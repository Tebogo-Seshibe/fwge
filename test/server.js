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

app.get(/^\/$/, 			            function get(req, res) { res.sendFile(path.resolve(__dirname + "\\index.html"));                    });
app.get(/^\/style.css$/,	            function get(req, res) { res.sendFile(path.resolve(__dirname + "\\style.css"));                     });
app.get(/^\/test.js$/,                  function get(req, res) { res.sendFile(path.resolve(__dirname + "\\test.js"));                       });
app.get(/^\/fwge.js$/, 	                function get(req, res) { res.sendFile(path.resolve(__dirname + "\\..\\build\\fwge.js"));            });
app.get(/^\/.+(bmp|jpg|png|gif|ico)$/,	function get(req, res) { res.sendFile(path.resolve(__dirname + "\\img" + unescape(req.url)));       });

app.use(body.urlencoded({ extended: true }));
app.use(body.json());
app.post(/^\/$/, function post(req, res)
{
    var request = req.body;
    var response = {};

    switch (request.type)
    {
        case "SHADER": 
            response = getShaders(request.name);
        break;
    }

    res.send(response);
});

app.get(/^\/.+(glsl)$/,	function get(req, res)
{
    let name = unescape(req.url.substring(0, req.url.length - 4));
    let src = "/shaders" + name + req.url;
    res.sendFile(path.resolve(__dirname + src));
});
app.get(/^.+\.(obj|mtl)$/,              function get(req, res)
{
    let name = unescape(req.url.substring(0, req.url.length - 4));
    let src = "/objects" + name + req.url;
    res.sendFile(path.resolve(__dirname + src));
});
app.listen(3000, function() { console.log("Listening on: 127.0.0.1:3000"); });

function getShaders(name)
{
    try
    {
        let dir = fs.readdirSync(__dirname + "/shaders/" + name);
        return {
            code: 200,
            vertexshader: fs.readFileSync(__dirname + "/shaders/" + name + "/VertexShader.glsl", "utf-8"),
            fragmentshader: fs.readFileSync(__dirname + "/shaders/" + name + "/FragmentShader.glsl", "utf-8")
        };
    }
    catch (e)
    {
        return { code: 404, message: e };
    }
}