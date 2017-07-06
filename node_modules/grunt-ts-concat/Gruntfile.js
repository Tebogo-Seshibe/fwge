module.exports = function (grunt) {

    grunt.initConfig({

        clean: {
            tests: [
                "tmp"
            ],
            compiled: [
                "compiled"
            ]
        },

        ts_concat: {

            interfaces: {
                src: [
                    "test/fixtures/lib/**/*.ts"
                ],
                dest: "tmp/lib/validators-bundle.ts"
            },
            util: {
                src: [
                    "test/fixtures/util/**/*.ts"
                ],
                dest: "tmp/util/util-bundle.ts"
            },

            /**
             * Using dynamic mappings.
             * You should typically avoid using dynamic mappings with this task but if you have to please follow this example.
             */
            default: {
                expand: true,
                cwd: "test/fixtures",
                src: [
                    "files/**/*.ts",
                    "!files/**/date.pipe.ts"
                ],
                dest: "tmp/first-test/",
                //rename function must be used in case of dynamic bindings.
                rename: function (dest, src) {
                    //function must return same file name for all src files for bundling to happen properly.
                    //for example: the output file will be bundle.ts. any name can be used here.
                    return dest + "bundle.ts";
                }
            },

            /**
             * Using static mappings.
             */
            bundles_prop: {
                src: [
                    "test/fixtures/files/**/*.ts",
                    "!test/fixtures/files/**/date.pipe.ts"
                ],
                dest: "tmp/second-test/bundle.ts",
                options: {
                    bundles: {
                        "tmp/lib/validators-bundle.ts": [
                            "test/fixtures/lib/**/*.ts"
                        ]
                    }
                }
            },
            multi_src: {
                src: [
                    "test/fixtures/lib/**/*.ts",
                    "test/fixtures/util/**/*.ts"
                ],
                dest: "tmp/all-utils.ts"
            },
            multi_bundles: {
                src: [
                    "test/fixtures/files/**/*.ts"
                ],
                dest: "tmp/third-test/bundle.ts",
                options: {
                    bundles: {
                        "tmp/lib/validators-bundle.ts": [
                            "test/fixtures/lib/**/*.ts"
                        ],
                        "tmp/util/util-bundle.ts": [
                            "test/fixtures/util/**/*.ts"
                        ]
                    }
                }
            },
            one_bundle_with_multiple_inputs: {
                src: [
                    "test/fixtures/files/**/*.ts"
                ],
                dest: "tmp/fourth-test/bundle.ts",
                options: {
                    bundles: {
                        "tmp/all-utils.ts": [
                            "test/fixtures/lib/**/*.ts",
                            "test/fixtures/util/**/*.ts"
                        ]
                    }
                }
            },
            full_lib: {
                src: [
                    "tmp/fourth-test/**/*.ts",
                    "tmp/all-utils.ts"
                ],
                dest: "tmp/main.ts"
            }
        },

        nodeunit: {
            tests: [
                'test/*_test.js'
            ]
        }
    });

    grunt.loadTasks("tasks");

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('main-concat', ['clean:tests', 'ts_concat']);
    grunt.registerTask('test', ['main-concat', 'nodeunit']);
    grunt.registerTask("default", ["test"]);
}