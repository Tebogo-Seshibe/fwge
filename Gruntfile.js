module.exports = function(grunt)
{
    grunt.initConfig(
    {
        bundle:
        {
            source:
            {
                src:    './src/**/**.js',
                dest:   './build/fwge.js',
            },
            source_min:
            {
                src:    './src/**/**.js',
                dest:   './build/fwge.min.js',
                tasks:  ['uglify:app']
            },
            editor: {}
        },
        clean:
        {
            source:
            {
                src:    ['./src/**/**.js']
            }
        },
        ts:
        { 
            source:
            { 
                src:            './fwge.ts',
                reference:      './references.ts',
                declarations:   true,
                outDir:         '.'
            },
            editor:
            { 
                src:            './editor/**/**.ts',
                declarations:   true,
                outDir:         '.'
            },
        },
        watch:
        {
            source:
            {
                files:  "./src/**/**.ts",
                tasks:  ['source']
            },
            editor:
            {
                files: './editor/**/**.ts',
                tasks: ['editor']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-strip-code');
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('editor', ['']);
    grunt.registerTask('source', []);
}