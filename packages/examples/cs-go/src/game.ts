import { BasicLitMaterial, Game, RenderType } from '@fwge/core'
import { basicShader, createBasicShader, createDefaultShader, createSimpleShader } from './assets/Shaders'
import { createCube, mtlCube, objBase, objCube, objSphere } from './components'
import { basicAnimation } from './components/Animations'
import { createBasicMaterial, createPrincipledBSDFMaterial } from './components/Materials'
import { Round } from './scenes'
import { SolarSystem } from './scenes/SolarSystem'

export class CSGO extends Game
{
    constructor()
    {
        super(
        {
            canvas: () => document.querySelector<HTMLCanvasElement>('#canvas')!,
            height: 1080,
            width: 1920,
            scenes: [
                // MainMenu,
                // LoadingScreen,
                // Credits,
                // Round,
                SolarSystem,
                // Test
            ],
            components: [
                { name: 'CubeMaterial', create: createBasicMaterial },
                { name: 'PlaneMaterial', create: createBasicMaterial },
                { name: 'BasicAnimation', create: basicAnimation },
                { name: 'MTL Cube', create: mtlCube },
                { name: 'Basis Lit Material', create()
                {
                    return new BasicLitMaterial(
                    {
                        shininess: 32,
                        imagemap: '/img/8k_earth_daymap.jpg',
                        normalmap: '/img/8k_earth_normal_map.png',
                        colour: [ Math.random(), Math.random(), Math.random() ],
                        shader: basicShader(),
                        renderType: RenderType.OPAQUE,
                        alpha: 1.0
                    })
                } },
                { name: 'Default BSDF', create: createPrincipledBSDFMaterial },
            ],
            assets: [
                { name: 'Cube', create: createCube },
                { name: 'Basic Shader', create: basicShader },
                { name: 'OBJ Cube', create: objCube },
                { name: 'OBJ Base', create: objBase },
                { name: 'OBJ Sphere', create: objSphere },
                { name: 'Simple Shader', create: createSimpleShader },
                { name: 'Basic Shader 2', create: createBasicShader },
                { name: 'Default Shader', create: createDefaultShader },
            ],
            startupScene: SolarSystem
        })
    }
}
