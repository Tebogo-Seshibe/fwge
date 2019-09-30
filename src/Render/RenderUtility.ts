import { GL } from "../FWGE";
import Camera, { Cameras } from "../Logic/Camera/Camera";
import GameObject, { GameObjects } from "../Logic/GameObject";
import { AmbientLights } from "../Logic/Light/AmbientLight";
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

export function Init(): void
{
    ClearBuffer()
    CalculateMatrices()
    Shaders.filter(shader => shader.Filter).forEach(shader =>
    {
        RunProgram(shader)
    })
}

export function Update(): void
{
    ClearBuffer()
    CalculateMatrices()
    Shaders.filter(shader => !shader.Filter).forEach(shader =>
    {
        RunProgram(shader)
    })
}

export function ClearScreen(): void
{
    GL.bindFramebuffer(GL.FRAMEBUFFER, null)
    GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
    GL.clearColor(0.0, 0.0, 0.0, 0.0)
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)
}

export function ClearBuffer(shader?: Shader): void
{
    let width = shader ? shader.Width : GL.drawingBufferWidth; 
    let height = shader ? shader.Height : GL.drawingBufferHeight; 
    let buffer = shader ? shader.FrameBuffer : null
    let clear = shader ? shader.Clear : [0, 0, 0, 0]

    GL.bindFramebuffer(GL.FRAMEBUFFER, buffer)
    GL.viewport(0, 0, width, height)
    GL.clearColor(clear[0], clear[1], clear[2], clear[3])
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)
}

export function RunProgram(shader: Shader): void
{
    GL.useProgram(shader.Program)

    ClearBuffer(shader)
    BindUniforms(shader)

    if (shader.Attribute.size <= 0)
    {
        GL.bindFramebuffer(GL.FRAMEBUFFER, null)
        GL.drawElements(GL.TRIANGLES, 0, GL.UNSIGNED_BYTE, 0)
    }
    else
    {
        shader.Objects.forEach(objectId => 
        {
            let object = ObjectList.get(objectId)

            BindAttributes(shader, object.mesh)
            BindShaderUniforms(shader, object)

            GL.bindFramebuffer(GL.FRAMEBUFFER, shader.FrameBuffer)
            GL.drawElements(GL.TRIANGLES, object.mesh.VertexCount, GL.UNSIGNED_BYTE, 0)
        })
    }

    GL.useProgram(null)    
}

export function BindAttributes(shader: Shader, mesh: Mesh): void
{    
    const position: number = shader.Attribute.get('A_Position')
    const normal: number = shader.Attribute.get('A_Normal')
    const uv: number = shader.Attribute.get('A_UV')
    const colour: number = shader.Attribute.get('A_Colour')
    
    if (position !== -1)
    {
        if(mesh.PositionBuffer)
        {
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

export function BindUniforms(shader: Shader): void
{
    for (let light of AmbientLights)
    {
        GL.uniform4fv(shader.Uniforms.Light.Ambient.Colour, light.Colour)
        GL.uniform1f(shader.Uniforms.Light.Ambient.Intensity, light.Intensity)
    }

    for (let light of DirectionalLights)
    {
        GL.uniform4fv(shader.Uniforms.Light.Directional.Colour, light.Colour)
        GL.uniform1f(shader.Uniforms.Light.Directional.Intensity, light.Intensity)
        GL.uniform3fv(shader.Uniforms.Light.Directional.Direction, light.Direction)
    }
    
    let point_count: number = 0
    for (let light of PointLights)
    {
        GL.uniform4fv(shader.Uniforms.Light.Point[point_count].Colour, light.Colour)
        GL.uniform1f(shader.Uniforms.Light.Point[point_count].Intensity, light.Intensity)
        GL.uniform3fv(shader.Uniforms.Light.Point[point_count].Position, light.Position)
        GL.uniform1f(shader.Uniforms.Light.Point[point_count].Radius, light.Radius)
        GL.uniform1f(shader.Uniforms.Light.Point[point_count].Angle, light.Angle)

        ++point_count
    }

    GL.uniform1i(shader.Uniforms.Light.PointCount, point_count)
    GL.uniformMatrix4fv(shader.Uniforms.Matrix.Projection, false, Camera.Main.ProjectionMatrix)
}

export function BindShaderUniforms(shader: Shader, object: ObjectListType): void
{
    GL.uniformMatrix4fv(shader.Uniforms.Matrix.ModelView, false, object.modelView)
    GL.uniformMatrix3fv(shader.Uniforms.Matrix.Normal, false, object.normal)

    GL.uniform4fv(shader.Uniforms.Material.Ambient, object.material.Ambient)
    GL.uniform4fv(shader.Uniforms.Material.Diffuse, object.material.Diffuse)
    GL.uniform4fv(shader.Uniforms.Material.Specular, object.material.Specular)
    GL.uniform1f(shader.Uniforms.Material.Shininess, object.material.Shininess)
    GL.uniform1f(shader.Uniforms.Material.Alpha, object.material.Alpha)

    if (object.material.ImageMap)
    {
        GL.activeTexture(GL.TEXTURE0)
        GL.bindTexture(GL.TEXTURE_2D, object.material.ImageMap)
        GL.uniform1i(shader.Uniforms.Material.HasImage, 1)
        GL.uniform1i(shader.Uniforms.Sampler.Image, 0)
    }
    else
    {
        GL.activeTexture(GL.TEXTURE0)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.uniform1i(shader.Uniforms.Material.HasImage, 0)
    }
    
    if (object.material.BumpMap)
    {
        GL.activeTexture(GL.TEXTURE1)
        GL.bindTexture(GL.TEXTURE_2D, object.material.BumpMap)
        GL.uniform1i(shader.Uniforms.Material.HasBump, 1)
        GL.uniform1i(shader.Uniforms.Sampler.Bump, 1)
    }
    else
    {
        GL.activeTexture(GL.TEXTURE1)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.uniform1i(shader.Uniforms.Material.HasBump, 0)
    }
    
    if (object.material.SpecularMap)
    {
        GL.activeTexture(GL.TEXTURE2)
        GL.bindTexture(GL.TEXTURE_2D, object.material.SpecularMap)
        GL.uniform1i(shader.Uniforms.Material.HasSpecular, 1)
        GL.uniform1i(shader.Uniforms.Sampler.Specular, 2)
    }
    else
    {
        GL.activeTexture(GL.TEXTURE2)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.uniform1i(shader.Uniforms.Material.HasBump, 0)
    }   
}

export function CombineShaders(): void
{
    let shaderCount: number = 0

    Shaders.filter(shader => shader.Filter).forEach((shader, index) =>
    {
        GL.activeTexture(GL.TEXTURE0 + shaderCount++)
        GL.bindTexture(GL.TEXTURE_2D, shader.Texture)
    })

    // base shader
}

export function CalculateMatrices(): void
{
    Cameras.forEach(camera =>
    {
        // Projection
        const projectionMatrix = camera.ProjectionMatrix
        
        // ModelView
        GameObjects.forEach(object => 
        {
            CalculateModelViewMatrix(object)
            
            let obj = ObjectList.get(object.ID)

            // GL.uniformMatrix4fv(uniforms.Matrix.ModelView, false, obj.modelView)
            // GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, obj.normal)
        })        
        
        // Normal
    })
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
