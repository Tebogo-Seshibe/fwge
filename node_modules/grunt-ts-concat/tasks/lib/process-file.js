"use strict";

var _ = require("lodash/array");

var localModulesMap = {};
var externModulesMap = {};
var processedFiles = [];
var modulePaths = {};
var importRegEx = /^\s*import[\s\r\n]*\{[\r\n]*([\r\n\s\w,]*)[\r\n]*\}[\s\r\n]*from[\s\r\n]*[\"\'](.*)[\"\'][\s\r\n]*;*$/gm;
var importsSplitRegEx = /[\s\r\n]*,[\s\r\n]*/;

exports.clean = function () {
    localModulesMap = {};
    externModulesMap = {};
    processedFiles = [];
    modulePaths = {};
}

exports.process = function (src, filepath, dest, bundles) {

    var match;
    var finalSrc = src;

    var index = filepath.lastIndexOf("/") + 1;
    var fileName = filepath.substr(index);
    var path = filepath.substr(0, index - 1);

    processedFiles.push(fileName.substr(0, fileName.lastIndexOf(".")).trim());

    while ((match = importRegEx.exec(src)) !== null) {

        finalSrc = finalSrc.replace(match[0], "");
        console.log(match[1]);
        var allImports = match[1].split(importsSplitRegEx).map(function (str) {
            return str.trim();
        });

        if (match[2].charAt(0) === ".") {

            let module = match[2].substr(match[2].lastIndexOf("/") + 1);

            if (!localModulesMap[module]) {
                localModulesMap[module] = [];
            }

            localModulesMap[module] = _.union(localModulesMap[module], allImports);

            if (!modulePaths[module]) {

                var modulePath = path;
                match[2].split("/").forEach(function (mark) {
                    if (mark === "..") {
                        modulePath = modulePath.substr(0, modulePath.lastIndexOf("/"));
                    }
                });

                if (modulePath === "") modulePath = ".";

                modulePath += "/" + _.join(match[2].split("/")
                    .filter(function (part) {
                        return part !== "." && part !== "..";
                    }), "/");

                if(modulePath.indexOf("../") < 0 && modulePath.indexOf("./") < 0) {
                    modulePath = "./" + modulePath;
                }

                var bundleFound = false;
                for (var bundle in bundles) {
                    var bundleExists = bundles[bundle].filter(function (filepath) {
                        return filepath === modulePath;
                    });
                    if (bundleExists.length > 0) {
                        bundleFound = true;
                        modulePaths[module] = convertToDestRelativePath(bundle, dest);
                    }
                }

                if (!bundleFound) {
                    modulePaths[module] = convertToDestRelativePath(modulePath, dest);
                }
            }

        } else {

            if (!externModulesMap[match[2]]) {
                externModulesMap[match[2]] = [];
            }

            externModulesMap[match[2]] = _.union(externModulesMap[match[2]], allImports);

        }
    }

    return finalSrc;
}

exports.removeDuplicates = function () {
    Object.keys(localModulesMap).forEach(function (key) {
        if (processedFiles.indexOf(key) >= 0) {
            delete localModulesMap[key];
        }
    });
}

exports.returnImports = function () {

    var finalImports = "";

    for (var module in externModulesMap) {
        finalImports += "import { " + _.join(externModulesMap[module], ", ") + " } from \"" + module + "\";\n";
    }

    for (var module in localModulesMap) {
        finalImports += "import { " + _.join(localModulesMap[module], ", ") + " } from \"" + modulePaths[module] + "\";\n";
    }

    return finalImports;
}

function cleanPath(path) {

    if (path.indexOf("../") >= 0) {

        return path
            .split("/")
            .filter(function (part) {
                return part !== ".";
            })
            .reduce(function (path, part) {
                if (path === "") {
                    path += part;
                    return path;
                }
                path += "/" + part;
                return path;
            }, "");
    }
    return path;
}

function convertToDestRelativePath(path, dest) {

    var destPath = dest;
    var backPartsLen = dest.split("/")
        .filter(function (part) {
            return part === "..";
        }).length;

    var partRe = new RegExp("^(\\.\\.\\/){" + backPartsLen + "," + backPartsLen + "}");
    path = path.replace(partRe, "");
    destPath = destPath.replace(partRe, "");

    for (var i = 0; i < destPath.split("/").length - 1; i++) {
        path = "../" + path;
    }

    if (path[0] !== ".") path = "./" + path;

    return cleanPath(path);
}