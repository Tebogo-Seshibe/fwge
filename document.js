var files = require("./files.js");
var fs = require("fs");
var no;

files.forEach(function forEach(item, index)
{
	if (0 < index && index < files.length  - 1)
	{
		var file = fs.readFileSync(__dirname + "/" + item, 'utf8');
		var pivot = -1;

		while (pivot < file.length)
		{
			var result = get_comments(file, pivot);
			
			/*if (pivot === -1)
				describe(result.text);
			else
				property(result.text);*/

			console.log("= = = = = = = = = = = = = = = =\n" +
						result.text +
						"\n= = = = = = = = = = = = = = = =");


			pivot = result.index;
		}
	}
});

function get_comments(file, index)
{
	var text = "";
	var reading = false;

	while (++index < file.length)
	{
		if (reading)
			text += file[index];

		if (!!file.slice(index, index + 3).match(/\/\*\!/) || !!file.slice(index, index + 3).match(/\/\*\*/))
			reading = true;

		if (!!file.slice(index - 2, index + 1).match(/\*\//))
		{
			text += '\n';
			reading = false;
			index += 3;
		}

	}

	return {text: clean(text), index: index};
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

function clean(text)
{
	var arr = text.split('\n');
	var len = arr.length - 1;
	var s = "";

	for (var i = 1; i < len; ++i)
		s += arr[i].trim().substring(2).trim().split(/\s+/).join(" ") + '\n';

	return s;
}