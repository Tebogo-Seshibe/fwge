const fs        = require("fs");
//const uglify    = require("uglify");
var paths       = get_paths("./src").split(",");

fs.writeFileSync("./build/fwge.js",
[
`(function(window)
{
    "use strict";

`,
    read_files(paths),
`
})(window);
`
].join("\n"), { encoding: "utf-8" });


/**
 * @param   {string} path
 * @return  {Object}
 */
function get_paths(path)
{
    return fs.readdirSync(path).map(function(value, index, array)
    {
        var full_path = path + "/" + value;

        if (fs.lstatSync(full_path).isFile())
            return full_path;
        else
            return get_paths(full_path);
    }).join();
}

function read_files(paths)
{
    return paths.map(function(path, path_index, paths_array)
    {
        console.log(path);
        return fs.readFileSync(path, "utf-8").split("\n").map(function(line, line_index, lines_array)
        {
            return "    " + line;
        }).join("\n");
    }).join("\n");
}
