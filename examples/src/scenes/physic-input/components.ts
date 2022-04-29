import { AudioPlayer } from "@fwge/audio"
import { Vector3 } from "@fwge/common"
import { Script, Transform } from "@fwge/core"
import { Colour4, Material, OBJParser, ParseResutlt, ShaderAsset, StaticMesh } from "@fwge/render"

import baseMTL from '/public/objects/base/base.mtl?raw'
import baseOBJ from '/public/objects/base/base.obj?raw'
import sphereMTL from '/public/objects/uv_sphere/uv_sphere.mtl?raw'
import sphereOBJ from '/public/objects/uv_sphere/uv_sphere.obj?raw'
import cubeMTL from '/public/objects/cube/cube.mtl?raw'
import cubeOBJ from '/public/objects/cube/cube.obj?raw'
import sponzaMTL from '/public/objects/sponza/sponza.mtl?raw'
import sponzaOBJ from '/public/objects/sponza/sponza.obj?raw'

import basicFrag from '/public/shaders/Basic.frag?raw'
import defaultFrag from '/public/shaders/Default.frag?raw'
import defaultVert from '/public/shaders/Default.vert?raw'
import simpleFrag from '/public/shaders/Simple.frag?raw'
import commonFrag from '/public/shaders/_common.frag?raw'
import commonVert from '/public/shaders/_common.vert?raw'
import lightingFrag from '/public/shaders/_lighting.frag?raw'
import lightingVert from '/public/shaders/_lighting.vert?raw'

export const canvas = document.querySelector('canvas')!
export let cubeMeshVerts!: Vector3[]
export let simpleCubeMeshVerts!: Vector3[]
export let simpleCubeMeshOutline!: number[]
export let spinnerScript!: Script
export let offAudio!: AudioPlayer
export let hmm!: OBJParser
export let prefabs!: ParseResutlt
export let sphere!: ParseResutlt
export let base!: ParseResutlt
export let sponza!: ParseResutlt
export let cubeMesh!: StaticMesh
export let planeMesh!: StaticMesh
export let simpleShader!: ShaderAsset
export let basicShader!: ShaderAsset
export let defaultShader!: ShaderAsset
export let cubeUVMaterial!: Material
export let tebogoMaterial!: Material
export let planeMaterial!: Material

export function init()
{
    hmm = new OBJParser()
    sphere = hmm.hmm(sphereOBJ, sphereMTL)
    prefabs = hmm.hmm(cubeOBJ, cubeMTL)
    base = hmm.hmm(baseOBJ, baseMTL)
    sponza = hmm.hmm(sponzaOBJ, sponzaMTL)
    
    offAudio = new AudioPlayer({ source: '/audio/Minecraft Death Sound Effect.mp3' })
    
    spinnerScript = new Script(
    {
        start()
        {
            this.GetComponent(Transform)!.Rotation.Set(0, Math.random() * 360, Math.random() * 360)
        },
        update(delta: number)
        {
            this.GetComponent(Transform)!.Rotation.Y += delta * 70
            this.GetComponent(Transform)!.Rotation.Z += delta * 120
        }
    })

    cubeMeshVerts = [
        new Vector3(-0.5,  0.5, -0.5 ),
        new Vector3( 0.0,  0.5, -0.5 ),
        new Vector3( 0.5,  0.5, -0.5 ),
    
        new Vector3(-0.5,  0.5,  0.0 ),
        new Vector3( 0.0,  0.5,  0.0 ),
        new Vector3( 0.5,  0.5,  0.0 ),
    
        new Vector3(-0.5,  0.5,  0.5 ),
        new Vector3( 0.0,  0.5,  0.5 ),
        new Vector3( 0.5,  0.5,  0.5 ),
        
        new Vector3(-0.5,  0.0, -0.5 ),
        new Vector3( 0.0,  0.0, -0.5 ),
        new Vector3( 0.5,  0.0, -0.5 ),
    
        new Vector3(-0.5,  0.0,  0.0 ),
        new Vector3( 0.0,  0.0,  0.0 ),
        new Vector3( 0.5,  0.0,  0.0 ),
    
        new Vector3(-0.5,  0.0,  0.5 ),
        new Vector3( 0.0,  0.0,  0.5 ),
        new Vector3( 0.5,  0.0,  0.5 ),
        
        new Vector3(-0.5, -0.5, -0.5 ),
        new Vector3( 0.0, -0.5, -0.5 ),
        new Vector3( 0.5, -0.5, -0.5 ),
    
        new Vector3(-0.5, -0.5,  0.0 ),
        new Vector3( 0.0, -0.5,  0.0 ),
        new Vector3( 0.5, -0.5,  0.0 ),
    
        new Vector3(-0.5, -0.5,  0.5 ),
        new Vector3( 0.0, -0.5,  0.5 ),
        new Vector3( 0.5, -0.5,  0.5 ),
    ]

    simpleCubeMeshVerts = [
        new Vector3(-0.5,  0.5,  0.5 ),
        new Vector3(-0.5, -0.5,  0.5 ),
        new Vector3( 0.5, -0.5,  0.5 ),
        new Vector3( 0.5,  0.5,  0.5 ),
    
        new Vector3(-0.5,  0.5,  -0.5 ),
        new Vector3(-0.5, -0.5,  -0.5 ),
        new Vector3( 0.5, -0.5,  -0.5 ),
        new Vector3( 0.5,  0.5,  -0.5 ),
    ]

    simpleCubeMeshOutline = [
        0,1, 1,2, 2,3, 3,0, // FRONT
        4,5, 5,6, 6,7, 7,4, // BACK
        4,0, 0,3, 3,7, 7,4, // TOP
        1,5, 5,6, 6,2, 2,1, // BOTTOM
        4,5, 5,1, 1,0, 0,4, // LEFT
        3,2, 2,6, 6,7, 7,3, // RIGHT
    ]
    
    cubeMesh = new StaticMesh(
    {
        position:
        [
            [-0.5,  0.5,  0.5 ],
            [-0.5, -0.5,  0.5 ],
            [ 0.5, -0.5,  0.5 ],
            [ 0.5,  0.5,  0.5 ],
            [ 0.5,  0.5,  0.5 ],
            [ 0.5, -0.5,  0.5 ],
            [ 0.5, -0.5, -0.5 ],
            [ 0.5,  0.5, -0.5 ],
            [ 0.5,  0.5, -0.5 ],
            [ 0.5, -0.5, -0.5 ],
            [-0.5, -0.5, -0.5 ],
            [-0.5,  0.5, -0.5 ],
            [-0.5,  0.5, -0.5 ],
            [-0.5, -0.5, -0.5 ],
            [-0.5, -0.5,  0.5 ],
            [-0.5,  0.5,  0.5 ],
            [-0.5,  0.5, -0.5 ],
            [-0.5,  0.5,  0.5 ],
            [ 0.5,  0.5,  0.5 ],
            [ 0.5,  0.5, -0.5 ],
            [-0.5, -0.5,  0.5 ],
            [-0.5, -0.5, -0.5 ],
            [ 0.5, -0.5, -0.5 ],
            [ 0.5, -0.5,  0.5 ],
        ],
        normal:
        [
            [ 0.0,  0.0, -1.0],
            [ 0.0,  0.0, -1.0],
            [ 0.0,  0.0, -1.0],
            [ 0.0,  0.0, -1.0],
            [ 1.0,  0.0,  0.0],
            [ 1.0,  0.0,  0.0],
            [ 1.0,  0.0,  0.0],
            [ 1.0,  0.0,  0.0],
            [ 0.0,  0.0,  1.0],
            [ 0.0,  0.0,  1.0],
            [ 0.0,  0.0,  1.0],
            [ 0.0,  0.0,  1.0],
            [-1.0,  0.0,  0.0],
            [-1.0,  0.0,  0.0],
            [-1.0,  0.0,  0.0],
            [-1.0,  0.0,  0.0],
            [ 0.0,  1.0,  0.0],
            [ 0.0,  1.0,  0.0],
            [ 0.0,  1.0,  0.0],
            [ 0.0,  1.0,  0.0],
            [ 0.0, -1.0,  0.0],
            [ 0.0, -1.0,  0.0],
            [ 0.0, -1.0,  0.0],
            [ 0.0, -1.0,  0.0],
        ],
        colour:
        [
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
        ],
        uv:
        [                
            [0.0, 1.0],
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
            [0.0, 1.0],
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
            [0.0, 1.0],
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
            [0.0, 1.0],
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
            [0.0, 1.0],
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
            [0.0, 1.0],
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
        ],
        index:
        [
            0,  1,  2,  0,  2,  3,
            4,  5,  6,  4,  6,  7,
            8,  9, 10,  8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23,
        ]
    })

    
    planeMesh = new StaticMesh(
    {
        position:
        [
            [-0.5,  0.5,  0.5 ],
            [-0.5, -0.5,  0.5 ],
            [ 0.5, -0.5,  0.5 ],
            [ 0.5,  0.5,  0.5 ],
        ],
        normal:
        [
            [ 0.0,  0.0, -1.0],
            [ 0.0,  0.0, -1.0],
            [ 0.0,  0.0, -1.0],
            [ 0.0,  0.0, -1.0],
        ],
        colour:
        [
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
            [1.0, 1.0, 1.0, 1.0],
        ],
        uv:
        [                
            [0.0, 1.0],
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
        ],
        index:
        [
            0, 1, 2,  0, 2, 3,
        ]
    })
    
    simpleShader = new ShaderAsset(
    {
        vertexShader:
        {
            source: defaultVert.replace('// common.vert', commonVert).replace('// lighting.vert', lightingVert),
            input: []
        },
        fragmentShader:
        {
            source: simpleFrag.replace('// common.frag', commonFrag).replace('// lighting.frag', lightingFrag),
            input: []
        },
    })
    console.log(simpleShader)
    basicShader = new ShaderAsset(
    {
        vertexShader:
        {
            source: defaultVert.replace('// common.vert', commonVert).replace('// lighting.vert', lightingVert),
            input: []
        },
        fragmentShader:
        {
            source: basicFrag.replace('// common.frag', commonFrag).replace('// lighting.frag', lightingFrag),
            input: []
        },
    })
    defaultShader = new ShaderAsset(
    {
        vertexShader:
        {
            source: defaultVert.replace('// common.vert', commonVert).replace('// lighting.vert', lightingVert),
            input: []
        },
        fragmentShader:
        {
            source: defaultFrag.replace('// common.frag', commonFrag).replace('// lighting.frag', lightingFrag),
            input: []
        },
    })

    cubeUVMaterial = new Material(
    {
        ambient: new Colour4(0.25, 0.25, 0.25, 1),
        diffuse: new Colour4(0.75, 0.75, 0.75, 1),
        specular: new Colour4(1, 1, 1, 1),
        alpha: 1,
        shininess: 32,
        imagemap: '/objects/cube/textures/CubeUV.png',
    })

    tebogoMaterial = new Material(
    {
        ambient: new Colour4(0.25, 0.25, 0.25, 1),
        diffuse: new Colour4(0.75, 0.75, 0.75, 1),
        specular: new Colour4(1, 1, 1, 1),
        alpha: 1,
        shininess: 32,
    })

    planeMaterial = new Material(
    {
        alpha: 0.1,
        ambient: new Colour4(1.0, 1.0, 1.0, 1.0),
        diffuse: new Colour4(1.0, 1.0, 1.0, 1.0),
        specular: new Colour4(1.0, 1.0, 1.0, 1.0),
    })
    
    setShader(prefabs, basicShader)
    setShader(base, basicShader)
    setShader(sponza, basicShader)
    setShader(sphere, basicShader)
    sphere.mtl["None"].Alpha = 0.05
    cubeUVMaterial.Shader = basicShader
    tebogoMaterial.Shader = basicShader
    planeMaterial.Shader = basicShader
}

function setShader(prefab: ParseResutlt, shader: ShaderAsset): void
{
    const names = Object.keys(prefab.mtl)
    for (const name of names)
    {
        prefab.mtl[name].Shader = shader   
    }
}
