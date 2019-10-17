import Shader from "../Logic/Shader/Shader";

export let DepthShader: Shader

export function InitShaders()
{
    DepthShader = new Shader(
    {
        clear: [0,0,0,0],
        filter: false,
        vertex:
`#ifdef GL_VERTEX_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif
    precision mediump int;

attribute vec3 A_Position;

struct Matrix
{
    mat4 ModelView;
    mat4 Projection;
    mat4 Camera;
};
uniform Matrix U_Matrix;

varying vec4 V_Position;

void main(void)
{
    V_Position = U_Matrix.Camera * U_Matrix.ModelView * vec4(A_Position, 1.0);
    
    gl_Position = U_Matrix.Projection * V_Position;
}`,
        fragment:
`#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif
    precision mediump int;

struct Global
{
    int U_ObjectID;
};
uniform Global U_Global;

varying vec4 V_Position;

void main(void)
{ 
    gl_FragColor = vec4(float(U_Global.U_ObjectID), 0.0, 0.0, V_Position.z);
}`,
        width: 1024,
        height: 1024
    })
}