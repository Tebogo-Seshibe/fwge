var express = require("express");
var path 	= require("path");
var fs 		= require("fs");
var app 	= express();

/*! Root files */
app.get("/", 			function(req, res) { res.sendFile(path.join(__dirname + "/views/index.html")); });
app.get("/style.css", 	function(req, res) { res.sendFile(path.join(__dirname + "/views/style.css")); });
/*! Root files */

/*! Testing files */
app.get("/testing/index.html", 	function(req, res) { res.sendFile(path.join(__dirname + "/views/testing/index.html")); });
app.get("/testing/style.css", 	function(req, res) { res.sendFile(path.join(__dirname + "/views/testing/style.css")); });
app.get("/testing/fwge.js", 	function(req, res) { res.sendFile(path.join(__dirname + "/fwge.js")); });
app.get("/testing/test.js", 	function(req, res) { res.sendFile(path.join(__dirname + "/views/testing/test.js")); });
app.get("/testing/tests",		function(req, res)
{
	var test_content = "[";

	var files = fs.readdirSync(__dirname + "/views/testing/tests/");
	files.forEach(function(item, index){ test_content += fs.readFileSync(__dirname + "/views/testing/tests/" + item, 'utf8') + ","; });

	test_content = test_content.substring(0, test_content.length - 1) + "]";
	res.send(test_content);
});
/*! Testing files */

/*! Project files */
app.get("/projects/cube/index.html",	function(req, res) { res.sendFile(path.join(__dirname + "/views/projects/cube/index.html")); });
app.get("/projects/cube/style.css",		function(req, res) { res.sendFile(path.join(__dirname + "/views/projects/cube/style.css")); });
app.get("/projects/cube/script.js",		function(req, res) { res.sendFile(path.join(__dirname + "/views/projects/cube/script.js")); });
app.get("/projects/cube/fwge.js",		function(req, res) { res.sendFile(path.join(__dirname + "/fwge.js")); });
/*! Project files */

/*! Shaders */
app.get("/shaders/basic", 	function(req, res) { res.send(get_shaders("basic")); });
app.get("/shaders/shadow", 	function(req, res) { res.send(get_shaders("shadow")); });
app.get("/shaders/texture", function(req, res) { res.send(get_shaders("texture")); });

function get_shaders(name)
{
	return JSON.stringify
	({
		Name: 			name.substring(0,1).toUpperCase() + name.substring(1) + " Shader",
		VertexShader: 	fs.readFileSync(__dirname + "/shaders/" + name + "/VertexShader.glsl", 'utf8'),
		FragmentShader: fs.readFileSync(__dirname + "/shaders/" + name + "/FragmentShader.glsl", 'utf8')
	});
}
/*! Shaders */

app.listen(3000, function() { console.log("Listening on port 3000"); });