var files = require("./files.js");
var fs = require("fs");
var template = fs.readFileSync(__dirname + "/" + files.template, 'utf8');

files.path.forEach(function forEach(item, index)
{
    fs.readFile(__dirname + "/" + item, { encoding:'utf8' }, function(err, data)
    {
        if (err)
            console.log(err);
        else
        {
            var filename = __dirname + "/documentation" + item.substring(5, item.length - 2) + "html";
            var count = item.match(/\\|\//g).length;
            var path = "";
            var title = "";

            var file_text = get_comments(data);
                file_text = read_docs(file_text);
                    title = file_text.details.name;
                file_text = create_docs(file_text);

            while (--count > 1)
                path += "../";

            file_text = template.toString()
                                .replace("{title}", title)
                                .replace("{body}", file_text)
                                .replace(/{path}/g, path);

            if (!fs.exists(filename))
                fs.closeSync(fs.openSync(filename, "a"));

            fs.writeFile(filename, file_text, { encoding: "utf8" });
        }            
    });
});


// PARSING THE COMMENTS
function get_comments(file)
{
	var comments = [];
	var comment = "";
	var start = 0;
	var end = 0;

	while (true)
	{
		start = file.indexOf("/**", start);
        if (start === -1)
            break;

        start += 4;
		end = file.indexOf("*/", start);
		comment = file.substring(start, end);

		comments.push(clean_comment(comment));
	}
	return comments;
}

function clean_comment(comment)
{
    var tags = [];
    comment = comment.split("\n");
    for (var i = comment.length - 1; i >= 0; --i)
    {
        comment[i] = comment[i].trim().substring(2);

        if (i > 0 && comment[i].indexOf("@") === -1)
        {
            comment[i - 1] += " " + comment[i].substring(comment[i].indexOf("*")).trim();
            comment[i] = undefined;
        }
    }

    for (var i = 0; i < comment.length; ++i)
        if (!!comment[i])
            tags.push(tag_comment(comment[i]));

    return tags;
}

function tag_comment(line)
{
    if (!line)
        return undefined;

    var text = line.match(/@[a-z]+\s/g)[0].trim();
    
    return {
        key: text,
        value: line.substring(text.length).trim()
    }
}
// PARSING THE COMMENTS

// READING THE DOCUMENTATION
function read_docs(doc)
{
	return {
		details: read_details(doc[0]),
		fields: read_fields(doc.slice(1))
	};
}

function read_details(doc)
{
    if (!doc)
        doc = [];

	var name = "";
	var module = "";
	var description = "";

	for (var i = 0; i < doc.length; ++i)
	{
		switch (doc[i].key)
		{
			case "@name": name = doc[i].value; break;
			case "@module": module = doc[i].value; break;
			case "@description": description = doc[i].value; break;
		}
	}

	return {
		name: name,
		module: module,
		description: description
	};
}

function read_fields(doc)
{
    if (!doc)
        doc = [];
        
    var fields = { properties: [], functions: [] };

    for (var i = 0; i < doc.length; ++i)
    {
        switch (doc[i][0].key)
        {
            case "@property": fields.properties.push(read_property(doc[i])); break;
            case "@function": fields.functions.push(read_function(doc[i])); break;
        }
    }

    return fields;
}

function read_property(doc)
{
	var name = "";
	var type = "";
    var read_write = false;
	var description = "";

	for (var i = 0; i < doc.length; ++i)
	{
		switch (doc[i].key)
		{
			case "@property":
                name = doc[i].value.substring(0, doc[i].value.indexOf(":"));
                type = doc[i].value.substring(doc[i].value.indexOf("{") + 1, doc[i].value.indexOf("}"));
                read_write = doc[0].value.indexOf(" > set") !== -1;
            break;

			case "@description": description = doc[i].value; break;
		}
	}

    return {
        name: name,
        type: type,
        read_write: read_write,
        description: description
    };
}

function read_function(doc)
{
	var name = "";
	var type = "";
    var overrides = [];
	var description = "";
    var param_count = 0;

	for (var i = 0; i < doc.length; ++i)
	{        
		switch (doc[i].key)
		{
			case "@function":
                name = doc[i].value.substring(0, doc[i].value.indexOf(":"));
                type = doc[i].value.substring(doc[i].value.indexOf("{") + 1, doc[i].value.indexOf("}"));
            break;

            case "@param":
                param_count = parseInt(doc[i].value.split("override: ")[1]);
                if (isNaN(param_count))
                    param_count = 1;

                if (!overrides[param_count - 1])
                    overrides[param_count - 1] = [];

                overrides[param_count - 1].push({ 
                    name: doc[i].value.substring(0, doc[i].value.indexOf(":")),
                    type: doc[i].value.substring(doc[i].value.indexOf("{") + 1, doc[i].value.indexOf("}")) 
                });
            break;

			case "@description": description = doc[i].value; break;
		}
	}


    return {
        name: name,
        type: type,
        overrides: overrides,
        description: description
    };
}
// READING THE DOCUMENTATION

// CREATING THE DOCUMENTATION
function create_docs(obj)
{
	return create_details(obj.details) + "\n\n" + create_fields(obj.fields);
}

function create_details(obj)
{
	var details = "";

	details += '\t\t\t\t' + '<div id="details">\n';
    details += '\t\t\t\t\t' + '<h1>' + obj.name + '</h1>\n';
    details += '\t\t\t\t\t' + '<h3>' + obj.module + '</h3>\n';
    details += '\t\t\t\t\t' + '<p>' + obj.description + '</p>\n';
	details += '\t\t\t\t' + '</div>\n';

	return details;
}

function create_fields(obj)
{
	return create_properties(obj.properties) + "\n\n" + create_functions(obj.functions);
}

function create_properties(obj)
{
	var properties = "";

	properties += '\t\t\t\t' + '<div id="properties">\n';
	for (var i = 0; i < obj.length; ++i)
	{
		properties += create_property(obj[i]);
		properties += i < obj.length - 1 ? '\n' : '';
	}
	properties += '\t\t\t\t' + '</div>\n';

	return properties;
}

function create_property(obj)
{
	var property = "";

    property += '\t\t\t\t\t' + '<div class="property">\n';
    property += '\t\t\t\t\t\t' + '<p>';
    property +=  '<span class="field-name">' + obj.name + '</span>';
    property += ': <span class="property-type">' + obj.type + "</span>";
    property += '</p>\n';
    property += '\t\t\t\t\t\t' + '<p class="property-description">' + obj.description + '</p>\n';
    property += '\t\t\t\t\t' + '</div>\n';

	return property;
}

function create_functions(obj)
{
	var methods = "";

	methods += '\t\t\t\t' + '<div id="functions">\n';
	for (var i = 0; i < obj.length; ++i)
	{
		methods += create_overrides(obj[i]);
		methods += i < obj.length - 1 ? '\n' : '';
	}
	methods += '\t\t\t\t' + '</div>\n';

	return methods;
}

function create_overrides(obj)
{
	var overrides = "";

    if (obj.overrides.length === 0)
        obj.overrides.push([{name: "param", type: "undefined"}]);

    overrides += '\t\t\t\t\t' + '<div class="function-overrides">\n';
	for (var i = 0; i < obj.overrides.length; ++i)
	{
		overrides += '\t\t\t\t\t\t' + '<p class="function-declaration">';
        overrides += create_arguments(obj.name, obj.overrides[i]);
        overrides += ': <span class="property-type">' + obj.return + '</span>';
		overrides += '</p>\n';
	}
	overrides += '\t\t\t\t\t\t' + '<p class="property-description">' + obj.description + '</p>\n';
    overrides += '\t\t\t\t\t' + '</div>\n';

	return overrides;
}

function create_arguments(name, obj)
{
	var arguments = "";

	arguments += '<span class="field-name">' + name + '</span>';
	arguments += "(";
	for (var i = 0; i < obj.length; ++i)
	{
		arguments += '<span class="property-name">' + obj[i].name + '</span>';
		arguments += ': <span class="property-type">' + obj.type + '</span>';
		arguments += i < obj.length - 1 ? ', ' : '';
	}
	arguments += ")";

	return arguments;
}
// CREATING THE DOCUMENTATION