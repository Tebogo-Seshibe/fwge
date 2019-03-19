import Mesh from '../../src/Render/Mesh'
import RenderMaterial from '../../src/Render/RenderMaterial'
import Shader from '../../src/Shader/Shader'
import FWGE from '../../src/FWGE'
import Control from '../../src/Utility/Control'
import GameObject from '../../src/GameObject';
import Transform from '../../src/Transform';
import Vector3 from '../../src/Maths/Vector3';
import Time from '../../src/Utility/Time';

window.onload = e => {
    FWGE.Init(
    {
        canvas: <HTMLCanvasElement>document.getElementById('canvas'),
        clear: [0, 0, 0, 0],
        physcisupdate: 30,
        renderupdate: 60
    })

    let shader = new Shader(
    {
        name: 'Just another shader',
        vertexshader: `
            attribute vec3 A_Position;

            struct Matrix
            {
                mat4 ModelView;
                mat4 Projection;
            };
            uniform Matrix U_Matrix;
            
            void main(void)
            {
                gl_Position = U_Matrix.Projection * U_Matrix.ModelView * vec4(A_Position, 1.0);
            }`,
        fragmentshader: `            
            precision mediump float;

            struct Material 
            {
                vec4 Diffuse;
            };
            uniform Material U_Material;
            
            void main(void)
            {
                gl_FragColor = vec4(U_Material.Diffuse);
            }`,
        height: 1920,
        width: 1080
    })

    let mesh = new Mesh(
    {
        position: [
            -1,  1, 0,
            -1, -1, 0,
             1, -1, 0,
             1,  1, 0
        ],
        index: [
            0, 1, 2,
            0, 2, 3
        ]
    })

    let material = new RenderMaterial(
    {
        ambient: [
            125, 125, 125, 255
        ],
        diffuse: [
            125, 125, 125, 255
        ],
        specular: [
            125, 125, 125, 255
        ],
        shininess: 32,
        shader: shader,
        alpha: 1
    })

    let gameObject = new GameObject(
    {
        name: "First Object",
        mesh,
        material,
        transform: new Transform(
        {
            position: new Vector3(0, 0, -2)
        }),
        children: [],
        begin: (): void => null,
        update: (): void =>
        {
            
            gameObject.Transform.Rotation.Y += Time.RenderDelta
        },
        end: (): void => null
    })
 
    console.info({ shader, mesh, material, gameObject })

    Control.Start()
}