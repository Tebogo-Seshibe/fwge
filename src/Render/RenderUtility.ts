import Shader, { Shaders } from "../Logic/Shader/Shader";
import Camera from "../Logic/Camera/Camera";
import Matrix4 from "../Logic/Maths/Matrix4";
import Matrix3 from "../Logic/Maths/Matrix3";
import { GL } from "../FWGE";
import GameObject, { GameObjects } from "../Logic/GameObject";
import ModelView from "./ModelView";
import Mesh from "../Logic/Mesh";
import Material from "../Logic/Material";

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

}

export function Update(): void
{
    ClearBuffer()
    CalculateMatrices(Camera.Main)
    Shaders.filter(shader => shader.Dynamic).forEach(shader =>
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
    
    if (shader.Attribute.size <= 0)
    {
        GL.bindFramebuffer(GL.FRAMEBUFFER, null)
        GL.drawElements(GL.TRIANGLES, 0, GL.UNSIGNED_BYTE, 0)
        GL.bindFramebuffer(GL.FRAMEBUFFER, null)
    }
    else
    {
        shader.Objects.forEach(objectId => 
        {
            let object = ObjectList.get(objectId)

            BindAttributes(shader, object.mesh)
            BindUniforms(shader, object.material)

            GL.bindFramebuffer(GL.FRAMEBUFFER, null)
            GL.drawElements(GL.TRIANGLES, 0, GL.UNSIGNED_BYTE, 0)
            GL.bindFramebuffer(GL.FRAMEBUFFER, null)
        })
    }

    GL.useProgram(null)    
}

export function BindAttributes(shader: Shader, mesh: Mesh): void
{    
    GL.bindBuffer(GL.ARRAY_BUFFER, mesh.PositionBuffer)

    const position = shader.Attribute.get('A_Position')
    const uv = shader.Attribute.get('A_UV')
    const normal = shader.Attribute.get('A_Normal')
    const colour = shader.Attribute.get('A_Colour')

    if (position !== -1)
    {
        if (mesh.PositionBuffer)
        {
            GL.bindBuffer(GL.ARRAY_BUFFER, mesh.PositionBuffer)
            GL.vertexAttribPointer(position, 3, GL.FLOAT, false, 0, 0)
        }
        else
        {
            GL.disableVertexAttribArray(position)
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
    
    if (normal !== -1)
    {
        if (!!mesh.NormalBuffer)
        {
            GL.bindBuffer(GL.ARRAY_BUFFER, mesh.NormalBuffer)
            GL.vertexAttribPointer(normal, 3, GL.FLOAT, false, 0, 0)
        }
        else
        {
            GL.disableVertexAttribArray(normal)
        }
    }
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer)    
}

export function BindUniforms(shader: Shader, material: Material): void
{
    
}

export function CombineShaders(): void
{
    
}

export function CalculateMatrices(camera: Camera): void
{
    // Projection
    const projectionMatrix = camera.ProjectionMatrix

    // ModelView
    GameObjects.forEach(object => 
    {
        CalculateModelViewMatrix(object)

        GL.uniformMatrix4fv(uniforms.Matrix.ModelView, false, mv)
        GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, new Matrix3(mv.Clone().Inverse()))
    })


    // Normal
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
