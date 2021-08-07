import IEngine from "./IEngine";
import BuildShaders, { CombinedShader, GUIShader, LightShader, NormalDepthShader, PostProcessingShader, SSAOShader } from "../Shader/Shaders";
import { Shader } from "../Render";
import { Shaders } from "../Shader/Shader";
import { Mesh, Material, GameObject } from "../Object";
import { Matrix4, Matrix3 } from "../Maths";
import { DirectionalLights } from "../Light/DirectionalLight";
import { PointLights } from "../Light/PointLight";
import { GameObjects } from "../Object/GameObject";
import { Camera, ViewMode } from "../Camera";
import { Perspective, Orthographic, LookAt } from "../Render/Projection";
import ModelView from "../Render/ModelView";

/**
 * 1) Depth Pass -> Main camera
 * 2) Point/Spot Light Pass -> Main Camera
 * 3) Directional Pass -> Main Camera
 * 4) G-Buffer
 * 5) Screen Space Ambient Occlusion Pass
 * 6) Post-Processing Pass
 * 6.1) Shadows
 * 6.2) AA
 * 6.3) DoF
 * 6.4) Motion Blur
 * 6.5) Reflections
 * 6.6) Glows
 * 6.7) Vigette
 * 6.8) Edge Detection
 * 7) GUI Pass
 */

 /**
  * Pass Process
  * -> Clear buffer
  * -> Render to texture
  */


type ObjectListType =
{
    id: number
    mesh?: Mesh
    material?: Material
    modelView: Matrix4
    normal: Matrix3
}

let ObjectList: Map<number, ObjectListType> = new Map


export default class RenderEngine implements IEngine
{
    private modelView: ModelView = new ModelView
    private GL: WebGLRenderingContext

    public constructor(gl: WebGLRenderingContext)
    {
        this.GL = gl

        BuildShaders()

        this.GL.enable(this.GL.DEPTH_TEST)
        this.GL.disable(this.GL.BLEND)
        this.GL.blendFunc(this.GL.SRC_ALPHA, this.GL.ONE)

        Shaders.filter(shader => shader.Filter).forEach(shader => this.RunProgram(shader, null))
    }

    public Update(): void
    {
        GameObjects.forEach(object => this.CalculateObjectMatrices(object, this.modelView))

        // ObjectList.forEach(object => RunProgram(NormalDepthShader, object))
        // ObjectList.forEach(object => RunProgram(LightShader, object))
        // ObjectList.forEach(object => RunProgram(CombinedShader, object))
        // ObjectList.forEach(object => RunProgram(PostProcessingShader, object))
        // ObjectList.forEach(object => RunProgram(SSAOShader, object))
        // ObjectList.forEach(object => RunProgram(GUIShader, object))

        this.ClearBuffer()
        // ObjectList.forEach(object => RunProgram(object.material.Shader, object))
        // RunProgram(null)
    }

    public Reset(): void
    {
        Shaders.forEach(shader => this.ClearBuffer(shader))
    }

        
    public ClearBuffer(shader?: Shader): void
    {   
        const width = shader ? shader.Width : this.GL.drawingBufferWidth
        const height = shader ? shader.Height : this.GL.drawingBufferHeight
        const buffer = shader ? shader.FrameBuffer : null
        const clear = shader ? shader.Clear : [0.0, 0.0, 0.0, 0.0]

        this.GL.bindFramebuffer(this.GL.FRAMEBUFFER, buffer)
        this.GL.viewport(0, 0, width, height)
        this.GL.clearColor(clear[0], clear[1], clear[2], clear[3])
        this.GL.clear(this.GL.COLOR_BUFFER_BIT | this.GL.DEPTH_BUFFER_BIT)
    }

    public BindAttributes(shader: Shader, mesh: Mesh): void
    {
        const position: number = shader.Attribute!.Position
        const normal: number = shader.Attribute!.Normal
        const uv: number = shader.Attribute!.UV
        const colour: number = shader.Attribute!.Colour

        if (position !== -1)
        {
            if(mesh.PositionBuffer)
            {
                this.GL.enableVertexAttribArray(position)
                this.GL.bindBuffer(this.GL.ARRAY_BUFFER, mesh.PositionBuffer)
                this.GL.vertexAttribPointer(position, 3, this.GL.FLOAT, false, 0, 0)
            }
            else
            {
                this.GL.disableVertexAttribArray(position)
            }
        }

        if (normal !== -1)
        {
            if (mesh.NormalBuffer)
            {
                this.GL.enableVertexAttribArray(normal)
                this.GL.bindBuffer(this.GL.ARRAY_BUFFER, mesh.NormalBuffer)
                this.GL.vertexAttribPointer(normal, 3, this.GL.FLOAT, false, 0, 0)
            }
            else
            {
                this.GL.disableVertexAttribArray(normal)
            }
        }

        if (uv !== -1)
        {
            if (mesh.UVBuffer)
            {
                this.GL.enableVertexAttribArray(uv)
                this.GL.bindBuffer(this.GL.ARRAY_BUFFER, mesh.UVBuffer)
                this.GL.vertexAttribPointer(uv, 2, this.GL.FLOAT, false, 0, 0)
            }
            else
            {
                this.GL.disableVertexAttribArray(uv)
            }

        }

        if (colour !== -1)
        {
            if (mesh.ColourBuffer)
            {
                this.GL.enableVertexAttribArray(colour)
                this.GL.bindBuffer(this.GL.ARRAY_BUFFER, mesh.ColourBuffer)
                this.GL.vertexAttribPointer(colour, 4, this.GL.FLOAT, false, 0, 0)
            }
            else
            {
                this.GL.disableVertexAttribArray(colour)
            }
        }

        this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer)
        // this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, mesh.WireframeBuffer)
    }

    public BindGlobalUniforms(shader: Shader): void
    {
        let directional_count: number = 0
        for (let light of DirectionalLights)
        {
            this.GL.uniform4fv(shader.BaseUniforms!.DirectionalLights[directional_count].Colour, light.Colour)
            this.GL.uniform1f(shader.BaseUniforms!.DirectionalLights[directional_count].Intensity, light.Intensity)
            this.GL.uniform3fv(shader.BaseUniforms!.DirectionalLights[directional_count].Direction, light.Direction)

            ++directional_count
        }

        let point_count: number = 0
        for (let light of PointLights)
        {
            this.GL.uniform4fv(shader.BaseUniforms!.PointLights[point_count].Colour, light.Colour)
            this.GL.uniform1f(shader.BaseUniforms!.PointLights[point_count].Intensity, light.Intensity)
            this.GL.uniform3fv(shader.BaseUniforms!.PointLights[point_count].Position, light.Position)
            this.GL.uniform1f(shader.BaseUniforms!.PointLights[point_count].Radius, light.Radius)
            this.GL.uniform1f(shader.BaseUniforms!.PointLights[point_count].Angle, light.Angle)

            ++point_count
        }

        let projectionMatrix =
            Camera.Main.Mode == ViewMode.PERSPECTIVE
            ? Perspective(Camera.Main.NearClipping, Camera.Main.FarClipping, Camera.Main.FieldOfView, Camera.Main.AspectRatio)
            : Orthographic(Camera.Main.Left, Camera.Main.Right, Camera.Main.Top, Camera.Main.Bottom, Camera.Main.NearClipping, Camera.Main.FarClipping, Camera.Main.HorizontalTilt, Camera.Main.VericalTilt)

        let lookAtMatrix = LookAt(Camera.Main.Position, Camera.Main.Target, Camera.Main.Up)

        console.log(shader)
        this.GL.uniform1i(shader.BaseUniforms!.DirectionalLightCount, directional_count)
        this.GL.uniform1i(shader.BaseUniforms!.PointLightCount, point_count)
        this.GL.uniformMatrix4fv(shader.BaseUniforms!.Matrix.Projection, false, projectionMatrix)
        this.GL.uniformMatrix4fv(shader.BaseUniforms!.Matrix.View, false, lookAtMatrix)

        this.GL.uniform1i(shader.BaseUniforms!.Global.Time, Date.now())
        this.GL.uniform2f(shader.BaseUniforms!.Global.Resolution, shader.Width, shader.Height)
        this.GL.uniform1f(shader.BaseUniforms!.Global.NearClip, Camera.Main.NearClipping)
        this.GL.uniform1f(shader.BaseUniforms!.Global.FarClip, Camera.Main.FarClipping)
        this.GL.uniform1i(shader.BaseUniforms!.Global.ObjectCount, GameObjects.length)
    }

    public BindObjectUniforms(shader: Shader, material: Material, mv: Matrix4, n: Matrix3): void
    {
        this.GL.uniform4fv(shader.BaseUniforms!.Material.AmbientColour, material.Ambient)
        this.GL.uniform4fv(shader.BaseUniforms!.Material.DiffuseColour, material.Diffuse)
        this.GL.uniform4fv(shader.BaseUniforms!.Material.SpecularColour, material.Specular)
        this.GL.uniform1f(shader.BaseUniforms!.Material.Shininess, material.Shininess)
        this.GL.uniform1f(shader.BaseUniforms!.Material.Alpha, material.Alpha)

        if (material.ImageMap)
        {
            this.GL.activeTexture(this.GL.TEXTURE0)
            this.GL.bindTexture(this.GL.TEXTURE_2D, material.ImageMap)
            this.GL.uniform1i(shader.BaseUniforms!.Material.ImageSampler, 0)
        }
        else
        {
            this.GL.activeTexture(this.GL.TEXTURE0)
            this.GL.bindTexture(this.GL.TEXTURE_2D, null)
        }

        if (material.BumpMap)
        {
            this.GL.activeTexture(this.GL.TEXTURE1)
            this.GL.bindTexture(this.GL.TEXTURE_2D, material.BumpMap)
            this.GL.uniform1i(shader.BaseUniforms!.Material.BumpSampler, 0)
        }
        else
        {
            this.GL.activeTexture(this.GL.TEXTURE1)
            this.GL.bindTexture(this.GL.TEXTURE_2D, null)
        }

        if (material.SpecularMap)
        {
            this.GL.activeTexture(this.GL.TEXTURE2)
            this.GL.bindTexture(this.GL.TEXTURE_2D, material.SpecularMap)
            this.GL.uniform1i(shader.BaseUniforms!.Material.SpecularSampler, 0)
        }
        else
        {
            this.GL.activeTexture(this.GL.TEXTURE2)
            this.GL.bindTexture(this.GL.TEXTURE_2D, null)
        }

        this.GL.uniformMatrix4fv(shader.BaseUniforms!.Matrix.Model, false, mv)
        this.GL.uniformMatrix3fv(shader.BaseUniforms!.Matrix.Normal, false, n)
    }

    public CalculateObjectMatrices(gameObject: GameObject, mv: ModelView): void
    {
        mv.Push(gameObject.Transform)
        let modelView: Matrix4  = mv.Peek()
        let inverse: Matrix4 = modelView.Clone().Inverse()

        ObjectList.set(gameObject.ID,
        {
            id: gameObject.ObjectID,
            mesh: gameObject.Mesh,
            material: gameObject.Material,
            modelView,
            normal: new Matrix3(
                inverse.M11, inverse.M12, inverse.M13,
                inverse.M21, inverse.M22, inverse.M23,
                inverse.M31, inverse.M32, inverse.M33
            )
        })

        gameObject.Children.forEach(child => this.CalculateObjectMatrices(child, mv))

        mv.Pop()
    }

    public RunProgram(shader: Shader, object: ObjectListType | null): void
    {
        this.GL.useProgram(shader.Program)

        this.ClearBuffer(shader)
        this.BindGlobalUniforms(shader)

        if (!shader.Attribute!.Exists || !object)
        {
            this.GL.bindFramebuffer(this.GL.FRAMEBUFFER, null)
            this.GL.drawElements(this.GL.TRIANGLES, 0, this.GL.UNSIGNED_BYTE, 0)
        }
        else
        {
            if (object.material!.Alpha !== 1.0)
            {
                this.GL.enable(this.GL.BLEND)
                this.GL.disable(this.GL.DEPTH_TEST)
            }

            this.BindAttributes(shader, object.mesh!)
            this.BindObjectUniforms(shader, object.material!, object.modelView, object.normal)
            this.GL.uniform1i(shader.BaseUniforms!.Global.ObjectID, object.id)

            this.GL.bindFramebuffer(this.GL.FRAMEBUFFER, null) //shader.FrameBuffer)
            this.GL.drawElements(this.GL.TRIANGLES, object.mesh!.VertexCount, this.GL.UNSIGNED_BYTE, 0)


            if (object.material!.Alpha !== 1.0)
            {
                this.GL.enable(this.GL.DEPTH_TEST)
                this.GL.disable(this.GL.BLEND)
            }
        }

        this.GL.useProgram(null)
    }

    public MainPass()
    {
        // ObjectList.forEach(object => RunProgram(object.material.Shader, object))
    }
}