import { AudioPlayer } from "@fwge/audio"
import { Vector3 } from "@fwge/common"
import { Script, Transform } from "@fwge/core"
import { Colour4, Material, OBJ, OBJParser, ShaderAsset, StaticMesh } from "@fwge/render"
import cubeMTL from '../../../assets/objects/Cube/Cube.mtl?raw'
import cubeOBJ from '../../../assets/objects/Cube/Cube.obj?raw'
import basicFrag from '../../../assets/shaders/Basic.frag?raw'
import defaultFrag from '../../../assets/shaders/Default.frag?raw'
import defaultVert from '../../../assets/shaders/Default.vert?raw'
import simpleFrag from '../../../assets/shaders/Simple.frag?raw'
import commonFrag from '../../../assets/shaders/_common.frag?raw'
import commonVert from '../../../assets/shaders/_common.vert?raw'
import lightingFrag from '../../../assets/shaders/_lighting.frag?raw'
import lightingVert from '../../../assets/shaders/_lighting.vert?raw'

export const canvas = document.querySelector('canvas')!
export let cubeMeshVerts!: Vector3[]
export let simpleCubeMeshVerts!: Vector3[]
export let simpleCubeMeshOutline!: number[]
export let spinnerScript!: Script
export let offAudio!: AudioPlayer
export let hmm!: OBJParser
export let prefabs!: OBJ[]
export let cubeMesh!: StaticMesh
export let simpleShader!: ShaderAsset
export let basicShader!: ShaderAsset
export let defaultShader!: ShaderAsset
export let cubeUVMaterial!: Material
export let tebogoMaterial!: Material

export function init()
{
    hmm = new OBJParser()
    prefabs = hmm.hmm(cubeOBJ, cubeMTL)
    offAudio = new AudioPlayer({ source: '/assets/audio/Minecraft Death Sound Effect.mp3' })
    
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
        ],
        wireframe:
        [
                0,  1,  1,  2,  2,  3,  3,  0,
                4,  5,  5,  6,  6,  7,  7,  4,
                8,  9,  9, 10, 10, 11, 11,  8,
            12, 13, 13, 14, 14, 15, 15, 12,
            16, 17, 17, 18, 18, 19, 19, 16,
            20, 21, 21, 22, 22, 23, 23, 20,
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
        imagemap: 'assets/objects/cube_2/CubeUV.png',
    })

    tebogoMaterial = new Material(
    {
        ambient: new Colour4(0.25, 0.25, 0.25, 1),
        diffuse: new Colour4(0.75, 0.75, 0.75, 1),
        specular: new Colour4(1, 1, 1, 1),
        alpha: 1,
        shininess: 32,
        // imagemap: 'assets/img/Tebogo.png'
    })
    
    cubeUVMaterial.Shader = basicShader
    tebogoMaterial.Shader = basicShader
    prefabs[0].material.Shader = basicShader
}
