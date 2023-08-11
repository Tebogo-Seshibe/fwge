import { BasicLitMaterial, Game, Image2D, RenderType } from "@fwge/core";
import { EditorScene } from "./EditorScene";
import { createBasicMaterial } from "./Materials";
import { createCube, objCube, objBase, objSphere, mtlCube } from "./Meshes";
import { basicShader, basicShader2, createSimpleShader, createBasicShader, createDefaultShader } from "./assets/Shaders";
import { basicAnimation } from "./components/Animations";

export class EditorProject extends Game
{
    constructor(canvas: HTMLCanvasElement){
        super({
            canvas,
            debug: false,
            height: 1920,
            width: 1080,
            scenes: [ EditorScene ],
            startupScene: EditorScene,
            assets: [
                { name: 'Cube', create: createCube },
                { name: 'Basic Shader', create: basicShader },
                { name: 'Basic Shader 2', create: basicShader2 },
                { name: 'OBJ Cube', create: objCube },
                { name: 'OBJ Base', create: objBase },
                { name: 'OBJ Sphere', create: objSphere },
                { name: 'Simple Shader', create: createSimpleShader },
                { name: 'Basic Shader 3', create: createBasicShader },
                { name: 'Default Shader', create: createDefaultShader },
                { name: '8k_earth_daymap', create: () => new Image2D({ source: '$lib/res/img/8k_earth_daymap.jpg' }) },
                { name: '8k_earth_normal_map', create: () => new Image2D({ source: '$lib/res/img/8k_earth_normal_map.png' }) },
            ],
            components: [
                { name: 'CubeMaterial', create: createBasicMaterial },
                { name: 'PlaneMaterial', create: createBasicMaterial },
                { name: 'BasicAnimation', create: basicAnimation },
                { name: 'MTL Cube', create: mtlCube },
                {
                    name: 'Basic Lit Material', create: () => new BasicLitMaterial(
                    {
                        shader: basicShader(),
                        renderType: RenderType.OPAQUE,
                        imagemap: '$lib/res/img/8k_earth_daymap.jpg',
                        normalmap: '$lib/res/img/8k_earth_normal_map.png',
                        colour: [Math.random(), Math.random(), Math.random()],
                        shininess: 32.0,
                        alpha: 1.0,
                    })
                },
            ],
            prefabs: []
        });

        canvas.addEventListener('resize', e =>
        {
            console.log(e);
        });
    }
}