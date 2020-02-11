import Shader from "./Shader";

export let NormalDepthShader: Shader
export let LightShader: Shader
export let BaseShader: Shader
export let CombinedShader: Shader
export let SSAOShader: Shader
export let PostProcessingShader: Shader
export let GUIShader: Shader

export default function BuildShaders(): void
{
    
    NormalDepthShader = new Shader(
    {
        name: 'Normal Depth Shader',
        
        vertex: `
        #ifdef GL_VERTEX_PRECISION_HIGH
            precision highp float;
        #else
            precision mediump float;
        #endif
            precision mediump int;
    
        attribute vec3 A_Position;
        attribute vec3 A_Normal;
        
        struct Matrix
        {
            mat4 ModelView;
            mat4 Projection;
            mat4 Camera;
            mat3 Normal;
        };
    
        uniform Matrix U_Matrix;    
        
        varying vec3 V_Normal;
        varying float V_Distance;
    
        void main(void)
        {
            vec4 position = vec4(A_Position, 1.0);
            position = U_Matrix.Projection * U_Matrix.ModelView * position;
            V_Normal = U_Matrix.Normal * A_Normal;
            V_Distance = clamp(position.z, 0.0, 1.0);
        }`,
    
        fragment:`
        #ifdef GL_FRAGMENT_PRECISION_HIGH
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
    
        varying vec3 V_Normal;
        varying float V_Distance;
    
        void main(void)
        { 
            gl_FragColor = vec4(V_Normal, V_Distance);
        }`
    })
    
    LightShader = new Shader(
    {
        name: 'Light Shader',
        
        vertex: `void main() { }`,
    
        fragment: `void main() { }`
    })
    
    BaseShader = new Shader(
    {
        name: 'Base Shader',
        
        vertex: `void main() { }`,
    
        fragment: `void main() { }`
    })
    
    CombinedShader = new Shader(
    {
        name: 'Combined Shader',
        
        vertex: `void main() { }`,
    
        fragment: `void main() { }`
    })
    
    SSAOShader = new Shader(
    {
        name: 'SSAO Shader',
        
        vertex: `void main() { }`,
    
        fragment: `void main() { }`
    })
    
    PostProcessingShader = new Shader(
    {
        name: 'PostProcessing Shader',
        
        vertex: `void main() { }`,
    
        fragment: `void main() { }`
    })
    
    GUIShader = new Shader(
    {
        name: 'GUI Shader',
        
        vertex: `void main() { }`,
    
        fragment: `void main() { }`
    })
    
}
