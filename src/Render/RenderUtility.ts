import Shader, { Shaders } from "../Logic/Shader/Shader";
import Camera from "../Logic/Camera/Camera";
import Matrix4 from "../Logic/Maths/Matrix4";
import Matrix3 from "../Logic/Maths/Matrix3";
import { GL } from "../FWGE";
import GameObject, { GameObjects } from "../Logic/GameObject";
import ModelView from "./ModelView";

type ObjectListType =
{
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

export function ClearBuffers(shader: Shader): void
{
    GL.bindFramebuffer(GL.FRAMEBUFFER, shader.FrameBuffer)
    GL.viewport(0, 0, shader.Width, shader.Height)
    GL.clearColor(shader.Clear[0], shader.Clear[1], shader.Clear[2], shader.Clear[3])
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)
}

export function RunProgram(shader: Shader): void
{
    GL.bindFramebuffer(GL.FRAMEBUFFER, null)
    GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)
    
    Shaders.filter(shader => shader.Dynamic).forEach(shader =>
    {
        GL.useProgram(shader.Program)
        ClearBuffers(shader)

        if (shader.Attribute.size > 0)
        {
            RenderToBuffer(shader)
        }
        else
        {
            RenderToTexture()
        }

        GL.useProgram(null)
    })
    
}


export function RenderToTexture(): void
{
    
}

export function RenderToBuffer(shader: Shader): void
{
    shader.Objects.forEach(objectId => 
    {
        let object = ObjectList.get(objectId)
        BindAttributes()
    })
}

export function BindUniforms(): void
{
    
}

export function BindAttributes(): void
{
    
}

export function Render(): void
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
        modelView: mv,
        normal: new Matrix3(mv.Clone().Inverse())
    })
}
