const bundle = require('C:\\Users\\Tebogo\\AppData\\Roaming\\npm\\node_modules\\bundle-js');
const fs = require('fs');
const source_files =
[
    // INTERFACES
    './src/Interfaces/BufferedArray.ts',
    './src/Interfaces/Destructable.ts',
    './src/Interfaces/KeyFrame.ts',
    './src/Interfaces/Updatable.ts',
    './src/Interfaces/Converter.ts',
    // INTERFACES


    // GAME ENGINE
    './src/Game Engine/Item.ts',
    './src/Game Engine/GameItem.ts',
    './src/Game Engine/Transform.ts',

    './src/Game Engine/Input.ts',
    './src/Game Engine/Time.ts',
    
    './src/Game Engine/Animation/AnimationFrame.ts',
    './src/Game Engine/Animation/ColourAnimationFrame.ts',
    './src/Game Engine/Animation/TransformAnimationFrame.ts',
    './src/Game Engine/Animation/Animation.ts',
    
    './src/Game Engine/Camera/Camera.ts',
    './src/Game Engine/Camera/Viewer.ts',
    
    './src/Game Engine/Light/LightItem.ts',
    './src/Game Engine/Light/AmbientLight.ts',
    './src/Game Engine/Light/DirectionalLight.ts',
    './src/Game Engine/Light/PointLight.ts',
    './src/Game Engine/Light/Light.ts',

    './src/Game Engine/Maths/Matrix2.ts',
    './src/Game Engine/Maths/Matrix3.ts',
    './src/Game Engine/Maths/Matrix4.ts',
    './src/Game Engine/Maths/Vector2.ts',
    './src/Game Engine/Maths/Vector3.ts',
    './src/Game Engine/Maths/Vector4.ts',
    './src/Game Engine/Maths/Quaternion.ts',
    './src/Game Engine/Maths/Maths.ts',
    
    './src/Game Engine/Particle System/Particle.ts',
    './src/Game Engine/Particle System/ParticleSystem.ts',

    './src/Game Engine/GameObject.ts',
    './src/Game Engine/GameEngine.ts',
    // GAME ENGINE


    // PHYSICS ENGINE
    './src/Physics Engine/PhysicsBody.ts',
    './src/Physics Engine/PhysicsMaterial.ts',
    './src/Physics Engine/PhysicsItem.ts',

    './src/Physics Engine/Collision/Collider.ts',
    './src/Physics Engine/Collision/BoxCollider.ts',
    './src/Physics Engine/Collision/SphereCollider.ts',
    './src/Physics Engine/Collision/Colliders.ts',

    './src/Physics Engine/PhysicsEngine.ts',
    // PHYSICS ENGINE


    // RENDER ENGINE
    './src/Render Engine/Colour.ts',
    './src/Render Engine/Mesh.ts',
    './src/Render Engine/RenderMaterial.ts',

    './src/Render Engine/ModelView.ts',
    './src/Render Engine/Projection.ts',

    './src/Render Engine/Shader.ts',
    './src/Render Engine/Renderer.ts',

    './src/Render Engine/Converter/OBJConverter.ts',

    './src/Render Engine/RenderEngine.ts',
    // RENDER ENGINE


    './src/FWGE.ts',
];
const editor_files =
[
    // VIEWS
    './editor/ts/View/View.ts',
    './editor/ts/View/ProjectsView.ts',
    './editor/ts/View/WindowView.ts',
    './editor/ts/View/ConsoleView.ts',
    // VIEWS


    './editor/ts/Editor.ts'
];

module.exports = function(grunt)
{
    grunt.initConfig(
    {
        concat:
        {
            source:
            {
                src:  source_files,
                dest: './build/fwge.ts'
            },
            editor:
            {
                src:  editor_files,
                dest: './editor/js/editor.ts'
            }
        },
        strip_code:
        {
            source:
            {
                src: './build/fwge.ts',
                options: { patterns: /import.*;s?|export\s?/g }
            },
            editor:
            {
                src: './editor/js/editor.ts',
                options: { patterns: /import.*;s?|export\s?/g }
            }
        },
        ts:
        {
            source:
            {
                src: './build/fwge.ts',
                options:
                {
                    allowJs: false,
                    verbose: true,
                    target: 'es5',
                    newLine: 'CRLF'
                }
            },
            editor:
            { 
                src: './editor/js/editor.ts',
                options:
                {
                    allowJs: false,
                    verbose: true,
                    target: 'es5',
                    newLine: 'CRLF'
                }
            },
        },
        watch:
        {
            source:
            {
                files:  source_files,
                tasks:  ['source:default']
            },
            editor:
            {
                files: editor_files,
                tasks: ['editor:default']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-strip-code');
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ts-concat');

    grunt.registerTask('editor:default',    ['concat:editor',  'strip_code:editor', 'ts:editor', 'bundle:editor']);
    grunt.registerTask('editor:watch',      ['editor:default', 'watch:editor']);

    grunt.registerTask('source:default',    ['concat:source',  'strip_code:source', 'ts:source', 'bundle:source']);
    grunt.registerTask('source:watch',      ['source:default', 'watch:source']);

    grunt.registerTask('default',           ['source']);

    grunt.registerTask('bundle:source', function bundle_source()
    {
        bundle(
        {
            entry: __dirname + '/build/fwge.js',
            target: 'browser',
            exposed: ['FWGE'],
            iife: true,
            dest: __dirname + '/build/fwge.js'
        });

        fs.writeFileSync('./build/fwge.js', fs.readFileSync('./build/fwge.js', 'utf-8').replace('window.FWGE = FWGE;', 'window.FWGE = new FWGE;'), 'utf-8');
    });
    grunt.registerTask('bundle:editor', function bundle_editor()
    {
        bundle(
        {
            entry: __dirname + '/editor/js/editor.js',
            target: 'browser',
            exposed: ['Editor'],
            iife: true,
            dest: __dirname + '/editor/js/editor.js'
        });

        fs.writeFileSync('./editor/js/editor.js', fs.readFileSync('./editor/js/editor.js', 'utf-8').replace('window.Editor = Editor;', 'window.Editor = new Editor;'), 'utf-8');
    });
};