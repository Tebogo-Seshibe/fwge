var compressor = require("node-minify");

var target_file = "build/fwge.js";
var target_file_min = "build/fwge.min.js";
var target_file_test = "test/fwge.js";

var files = require("./files.js");
console.log(files);

compressor.minify
({
	compressor: "no-compress",
	input: files,
	output: target_file,
	callback: function callback()
	{
		compressor.minify
		({
			compressor: "no-compress",
			input: target_file,
			output: target_file_test
		});

		compressor.minify
		({
			compressor: "gcc",
			input: target_file,
			output: target_file_min
		});
	}
});