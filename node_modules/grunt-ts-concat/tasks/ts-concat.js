"use strict";

module.exports = function (grunt) {

    var util = require("./lib/process-file");

    var cleanRegEx = /^\n$/gm;
    var finalImports = "";
    var finalMainSrc = "";
    var tsFileExtension = /\.ts$/;

    grunt.registerMultiTask("ts_concat", "Concatenate typescript files gracefully", function () {

        var options = this.options({});

        this.files.forEach(function (file) {

            var processedBundles = {};

            if (options.bundles) {

                for (var bundle in options.bundles) {

                    var bundlePath = grunt.template.process(bundle).replace(tsFileExtension, "");

                    if (bundlePath.indexOf("../") < 0) {
                        processedBundles["./" + bundlePath] = grunt.file.expand(options.bundles[bundle])
                            .map(function (filepath) {
                                if (filepath.indexOf("../") < 0) {
                                    return "./" + filepath.replace(tsFileExtension, "");
                                }
                                return filepath.replace(tsFileExtension, "");
                            });
                    } else {
                        processedBundles[bundlePath] = grunt.file.expand(options.bundles[bundle])
                            .map(function (filepath) {
                                if (filepath.indexOf("../") < 0) {
                                    return "./" + filepath.replace(tsFileExtension, "");
                                }
                                return filepath.replace(tsFileExtension, "");
                            });
                    }
                }
            }

            if (grunt.file.exists(file.dest)) {
                grunt.file.delete(file.dest);
            }

            finalImports = "";
            finalMainSrc = "";

            file.src
                .filter(function (filepath) {
                    if (grunt.file.exists(filepath)) {
                        return true;
                    }
                    grunt.fail.warn('Source file "' + filepath + '" not found.');
                    return false;
                })
                .forEach(function (filepath) {

                    var src = grunt.file.read(filepath);

                    var finalSrc = util.process(src, filepath, this.data.dest, processedBundles);
                    finalMainSrc += finalSrc + "\n";

                }, this);

            util.removeDuplicates();

            finalImports = util.returnImports();

            grunt.file.write(file.dest, (finalImports + finalMainSrc).replace(cleanRegEx, ""));

            util.clean();

        }, this);

    });

}