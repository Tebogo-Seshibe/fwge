let mesh
let mat
let shader

window.onload = e =>
{
    FWGE.Init(
    {
        canvas: document.getElementById('canvas'),
        clear: [0,0,0,0],
        physcisUpdate: 30,
        renderUpdate: 60
    })
    
    shader = new Shader(
    {
        gl: FWGE.GL,
        fragmentshader: ``,
        vertexshader: ``,
        height: 1920,
        width: 1080
    })

    mesh = new Mesh(
    {
        position: [
            -1, 1, 0,
            -1, -1, 0,
            1, -1, 0,
            1, 1, 0
        ],
        uv: [],
        colour: [
            255, 255, 255, 255,
            255, 255, 255, 255,
            255, 255, 255, 255,
            255, 255, 255, 255
        ],
        normal: [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ],
        index: [
            0,1,2,
            0,2,3
        ],
        wireframe: [
            0,1,
            1,2,
            2,3,
            3,0
        ]
    })

    mat = new RenderMaterial(
    {
        ambient: [125,125,125,255],  
        diffuse: [125,125,125,255],  
        specular: [125,125,125,255],
        shininess: 32,
        shader: shader,
        alpha: 1
    })
}