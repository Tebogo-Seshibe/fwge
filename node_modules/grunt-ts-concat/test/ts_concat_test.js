'use strict';

var grunt = require('grunt');

exports.ts_concat = {
    
    setUp: function(done) {
        done();
    },
    
    default: function(test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/first-test/bundle.ts');
        var expected = grunt.file.read('test/expected/first-test/bundle.ts');
        test.equal(actual, expected, "multiple files are bundled into single file correctly.");

        test.done();
    },

    bundles_prop: function(test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/second-test/bundle.ts');
        var expected = grunt.file.read('test/expected/second-test/bundle.ts');
        test.equal(actual, expected, "multiple files are bundled into single file correctly when using bundles option.");

        test.done();
    },

    multiple_bundles: function(test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/third-test/bundle.ts');
        var expected = grunt.file.read('test/expected/third-test/bundle.ts');
        test.equal(actual, expected, "files are concatenated correctly when there are more than one bundle in bundles options.");

        test.done();
    },

    one_bundle_with_mutiple_folders: function(test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/fourth-test/bundle.ts');
        var expected = grunt.file.read('test/expected/fourth-test/bundle.ts');
        test.equal(actual, expected, "files are concatenated correctly when a bundle is given using bundles prop which has files from multiple folders.");

        test.done();
    },

    full_lib: function(test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/main.ts');
        var expected = grunt.file.read('test/expected/main.ts');
        test.equal(actual, expected, "full library is bundled correctly.");

        test.done();
    }
};