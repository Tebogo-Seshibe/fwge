var files = require("./files.js").list;
var fs = require("fs");

files.forEach(function forEach(item, index)
{
	if (0 < index && index < files.length  - 1)
	{
		var file = fs.readFileSync(__dirname + "/" + item, 'utf8');
		var pivot = -1;

		console.log("================ " + item + " ================");
		while (pivot < file.length)
		{
			var result = get_comments(file, pivot);
			
			/*if (pivot === -1)
				describe(result.text);
			else
				property(result.text);*/

			console.log(result.text);

			pivot = result.index;
		}
		console.log("================ " + item + " ================");
	}
});

function get_comments(file, index)
{
	var text = "";
	var reading = false;

	while (++index < file.length)
	{
		if (reading && file[index] === '/' && file[index - 1] === '*')
		{
			reading = false;
			break;
		}

		if (reading)
			text += file[index]

		if (!reading && file[index] === '/')
			reading = true;
	}

	return {text: text, index: index};
}

function describe(comments)
{
	var obj = [];

	var index = -1;
	while (++index < comments.length)
	{

	}

	return obj;
}

function property(comments)
{
	var obj = [];

	return obj;
}