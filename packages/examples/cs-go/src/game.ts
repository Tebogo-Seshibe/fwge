import { BasicLitMaterial, Game, Image2D, RenderType } from '@fwge/core'
import { basicShader, basicShader2, createBasicShader, createDefaultShader, createSimpleShader } from './assets/Shaders'
import { createCube, mtlCube, objBase, objCube, objSphere } from './components'
import { basicAnimation } from './components/Animations'
import { createBasicMaterial, createPrincipledBSDFMaterial } from './components/Materials'
import { De_Dust2 } from './scenes/De_Dust2'
import { SolarSystem } from './scenes/SolarSystem'
import { Sponza } from './scenes/Sponza'
import { Test } from './scenes/Test'

export class CSGO extends Game
{
    constructor()
    {
        super(
        {
            canvas: () => document.querySelector<HTMLCanvasElement>('#canvas')!,
            height: 2560,
            width: 1440,
            startupScene: Test,
            scenes: [
                // Round,
                Test,
                // Sponza,
                // SolarSystem,
                // ModernWarfare,
                // De_Dust2
            ],
            components: [
                { name: 'CubeMaterial', create: createBasicMaterial },
                { name: 'PlaneMaterial', create: createBasicMaterial },
                { name: 'BasicAnimation', create: basicAnimation },
                { name: 'MTL Cube', create: mtlCube },
                { name: 'Basic Lit Material', create()
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
                { name: 'Basic Shader 2', create: basicShader2 },
                { name: 'OBJ Cube', create: objCube },
                { name: 'OBJ Base', create: objBase },
                { name: 'OBJ Sphere', create: objSphere },
                { name: 'Simple Shader', create: createSimpleShader },
                { name: 'Basic Shader 3', create: createBasicShader },
                { name: 'Default Shader', create: createDefaultShader },
                { name: '8k_earth_daymap', create: () => new Image2D({ source: '/img/8k_earth_daymap.jpg'}) },
                { name: '8k_earth_normal_map', create: () => new Image2D({ source: '/img/8k_earth_normal_map.png'}) },
            ],
            prefabs: []
        })
    }
}
