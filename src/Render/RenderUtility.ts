import { GL } from "../FWGE";
import Camera from "../Logic/Camera/Camera";
import GameObject, { GameObjects } from "../Logic/GameObject";
import { DirectionalLights } from "../Logic/Light/DirectionalLight";
import { PointLights } from "../Logic/Light/PointLight";
import Material from "../Logic/Material";
import Matrix3 from "../Logic/Maths/Matrix3";
import Matrix4 from "../Logic/Maths/Matrix4";
import Mesh from "../Logic/Mesh";
import Shader, { Shaders } from "../Logic/Shader/Shader";
import ModelView from "./ModelView";

type ObjectListType =
{
    mesh: Mesh
    material: Material
    modelView: Matrix4
    normal: Matrix3
}

let ObjectList: Map<number, ObjectListType> = new Map

// Init
//  -> Check is dynamic
//      -> false
//          -> Run program
//          -> Save output to texture

// Update
//  -> Clear screen
//  -> Compute all matrices
//      -> Projection matrix
//      -> Normal matrix
//      -> ModelView matrices
//  -> Check if shader is dynamic
//      -> true 
//          -> Clear buffers
//          -> Run program
//  -> Run Shader Progams
//      -> Bind uniforms
//      -> Does it require attributes
//          -> true
//              -> Bind atributes
//              -> Draw with mesh vertex count to buffer
//          -> false
//              -> Draw with 0 as vertex count to buffer
//  -> Sample and combine all shader on to the screen

let BaseMesh: Mesh
let BaseShader: Shader

let vs = 
`#ifdef GL_VERTEX_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif
    precision mediump int;

attribute vec3 A_Position;
attribute vec3 A_UV;

varying vec2 V_UV;

void main()
{
    V_UV = vec2(A_UV);

    gl_Position = vec4(A_Position, 1.0);
}`

let fs =
`#ifdef GL_VERTEX_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif
    precision mediump int;

const int MAX_SAMPLERS = 16;
uniform int U_SamplerCount;
uniform sampler2D samplers[MAX_SAMPLERS];

varying vec2 V_UV;

void main()
{
    vec4 colour = vec4(1.0);

    for (int i = 0; i < MAX_SAMPLERS; ++i)
    {
        if (i >= U_SamplerCount)
        {
            break;
        }

        colour *= texture2D(samplers[i], V_UV);
    }

    gl_FragColor = colour;
}
`

export function Init(): void
{
    BaseMesh = new Mesh(
    {
        position: [
             -1.0,  1.0,  0.0,
             -1.0, -1.0,  0.0,
              1.0, -1.0,  0.0,
              1.0,  1.0,  0.0
        ],
        uv: [
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0
        ],
        index: [
            0, 1, 2,
            0, 2, 3
        ]
    })
    BaseShader = new Shader({ vertex: vs, fragment: fs })
    Shaders.splice(Shaders.indexOf(BaseShader), 1)

    ClearBuffer()
    GameObjects.forEach(object => CalculateModelViewMatrix(object))
    Shaders.filter(shader => shader.Filter).forEach(shader =>
    {
        RunProgram(shader, null)
    })
}

export function Update(): void
{
    ClearBuffer()
    Shaders.filter(shader => !shader.Filter).forEach(shader => ClearBuffer(shader))
    GameObjects.forEach(object => CalculateModelViewMatrix(object))
    ObjectList.forEach(object => RunProgram(object.material.Shader, object))
    //CombineShaders()
}

export function ClearBuffer(shader?: Shader): void
{
    let width = shader ? shader.Width : GL.drawingBufferWidth
    let height = shader ? shader.Height : GL.drawingBufferHeight
    let buffer = shader ? shader.FrameBuffer : null
    let clear = shader ? shader.Clear : [0.0, 0.0, 0.0, 0.0]

    GL.bindFramebuffer(GL.FRAMEBUFFER, buffer)
    GL.viewport(0, 0, width, height)
    GL.clearColor(clear[0], clear[1], clear[2], clear[3])
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)
}

export function RunProgram(shader: Shader, object?: ObjectListType): void
{
    GL.useProgram(shader.Program)

    ClearBuffer(shader)
    BindGlobalUniforms(shader)

    if (!shader.Attributes.Exists || !object)
    {
        GL.bindFramebuffer(GL.FRAMEBUFFER, null)
        GL.drawElements(GL.TRIANGLES, 0, GL.UNSIGNED_BYTE, 0)
    }
    else
    {
        BindAttributes(shader, object.mesh)
        BindObjectUniforms(shader, object.material, object.modelView, object.normal)

        GL.bindFramebuffer(GL.FRAMEBUFFER, null) //shader.FrameBuffer)
        GL.drawElements(GL.TRIANGLES, object.mesh.VertexCount, GL.UNSIGNED_BYTE, 0)
    }

    GL.useProgram(null)    
}

export function BindAttributes(shader: Shader, mesh: Mesh): void
{    
    const position: number = shader.Attributes.Position
    const normal: number = shader.Attributes.Normal
    const uv: number = shader.Attributes.UV
    const colour: number = shader.Attributes.Colour
    
    if (position !== -1)
    {
        if(mesh.PositionBuffer)
        {
            GL.enableVertexAttribArray(position)
            GL.bindBuffer(GL.ARRAY_BUFFER, mesh.PositionBuffer)
            GL.vertexAttribPointer(position, 3, GL.FLOAT, false, 0, 0)
        }
        else
        {
            GL.disableVertexAttribArray(position)
        }
    }
    
    if (normal !== -1)
    {
        if (mesh.NormalBuffer)
        {
            GL.enableVertexAttribArray(normal)
            GL.bindBuffer(GL.ARRAY_BUFFER, mesh.NormalBuffer)
            GL.vertexAttribPointer(normal, 3, GL.FLOAT, false, 0, 0)
        }
        else
        {
            GL.disableVertexAttribArray(normal)
        }
    }

    if (uv !== -1)
    {
        if (mesh.UVBuffer)
        {
            GL.enableVertexAttribArray(uv)
            GL.bindBuffer(GL.ARRAY_BUFFER, mesh.UVBuffer)
            GL.vertexAttribPointer(uv, 2, GL.FLOAT, false, 0, 0)
        }
        else
        {
            GL.disableVertexAttribArray(uv)
        }

    }

    if (colour !== -1)
    {
        if (mesh.ColourBuffer)
        {
            GL.enableVertexAttribArray(colour)
            GL.bindBuffer(GL.ARRAY_BUFFER, mesh.ColourBuffer)
            GL.vertexAttribPointer(colour, 4, GL.FLOAT, false, 0, 0)
        }
        else
        {
            GL.disableVertexAttribArray(colour)
        }
    }
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer)
    // GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.WireframeBuffer)
}

export function BindGlobalUniforms(shader: Shader): void
{
    let directional_count: number = 0
    for (let light of DirectionalLights)
    {
        GL.uniform4fv(shader.BaseUniforms.DirectionalLights[directional_count].Colour, light.Colour)
        GL.uniform1f(shader.BaseUniforms.DirectionalLights[directional_count].Intensity, light.Intensity)
        GL.uniform3fv(shader.BaseUniforms.DirectionalLights[directional_count].Direction, light.Direction)

        ++directional_count
    }
    
    let point_count: number = 0
    for (let light of PointLights)
    {
        GL.uniform4fv(shader.BaseUniforms.PointLights[point_count].Colour, light.Colour)
        GL.uniform1f(shader.BaseUniforms.PointLights[point_count].Intensity, light.Intensity)
        GL.uniform3fv(shader.BaseUniforms.PointLights[point_count].Position, light.Position)
        GL.uniform1f(shader.BaseUniforms.PointLights[point_count].Radius, light.Radius)
        GL.uniform1f(shader.BaseUniforms.PointLights[point_count].Angle, light.Angle)

        ++point_count
    }

    GL.uniform1i(shader.BaseUniforms.DirectionalLightCount, directional_count)
    GL.uniform1i(shader.BaseUniforms.PointLightCount, point_count)
    GL.uniformMatrix4fv(shader.BaseUniforms.Matrix.Projection, false, Camera.Main.ProjectionMatrix)
    GL.uniform1f(shader.BaseUniforms.Global.Time, Date.now())
    GL.uniform2f(shader.BaseUniforms.Global.Resolution, shader.Width, shader.Height)
}

export function BindObjectUniforms(shader: Shader, material: Material, mv: Matrix4, n: Matrix3): void
{
    GL.uniform4fv(shader.BaseUniforms.Material.AmbientColour, material.Ambient)
    GL.uniform4fv(shader.BaseUniforms.Material.DiffuseColour, material.Diffuse)
    GL.uniform4fv(shader.BaseUniforms.Material.SpecularColour, material.Specular)
    GL.uniform1f(shader.BaseUniforms.Material.Shininess, material.Shininess)
    GL.uniform1f(shader.BaseUniforms.Material.Alpha, material.Alpha)

    if (material.ImageMap)
    {
        GL.activeTexture(GL.TEXTURE0)
        GL.bindTexture(GL.TEXTURE_2D, material.ImageMap)
        GL.uniform1i(shader.BaseUniforms.Material.ImageSampler, 0)
    }
    else
    {
        GL.activeTexture(GL.TEXTURE0)
        GL.bindTexture(GL.TEXTURE_2D, null)
    }
    
    if (material.BumpMap)
    {
        GL.activeTexture(GL.TEXTURE1)
        GL.bindTexture(GL.TEXTURE_2D, material.BumpMap)
        GL.uniform1i(shader.BaseUniforms.Material.BumpSampler, 0)
    }
    else
    {
        GL.activeTexture(GL.TEXTURE1)
        GL.bindTexture(GL.TEXTURE_2D, null)
    }
    
    if (material.SpecularMap)
    {
        GL.activeTexture(GL.TEXTURE2)
        GL.bindTexture(GL.TEXTURE_2D, material.SpecularMap)
        GL.uniform1i(shader.BaseUniforms.Material.SpecularSampler, 0)
    }
    else
    {
        GL.activeTexture(GL.TEXTURE2)
        GL.bindTexture(GL.TEXTURE_2D, null)
    }

    GL.uniformMatrix4fv(shader.BaseUniforms.Matrix.ModelView, false, mv)
    GL.uniformMatrix3fv(shader.BaseUniforms.Matrix.Normal, false, n)
}

export function CombineShaders(): void
{
    let shaderCount: number = 0

    // use main shader program
    GL.useProgram(BaseShader.Program)
    Shaders.filter(shader => shader.Filter).forEach(shader =>
    {
        GL.activeTexture(GL.TEXTURE0 + shaderCount++)
        GL.bindTexture(GL.TEXTURE_2D, shader.Texture)
    })

    GL.uniform1i(BaseShader.UserUniforms.get('U_SamplerCount').index, shaderCount)
    BindAttributes(BaseShader, BaseMesh)
    
    GL.bindFramebuffer(GL.FRAMEBUFFER, null)
    GL.drawElements(GL.TRIANGLES, BaseMesh.VertexCount, GL.UNSIGNED_BYTE, 0)
}

export function CalculateModelViewMatrix(gameObject: GameObject): void
{
    ModelView.Push(gameObject.Transform)
    let mv = ModelView.Peek()

    ObjectList.set(gameObject.ID,
    {
        mesh: gameObject.Mesh,
        material: gameObject.Material,
        modelView: mv,
        normal: new Matrix3(mv.Clone().Inverse())
    })

    gameObject.Children.forEach(child => CalculateModelViewMatrix(child))

    ModelView.Pop()
}
