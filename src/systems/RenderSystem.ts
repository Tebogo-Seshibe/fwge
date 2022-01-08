import { Light } from '../entities/lights/Light'
import { Matrix3 } from '../atoms/matrix/Matrix3'
import { Matrix4 } from '../atoms/matrix/Matrix4'
import { Material, Mesh, Shader, ShaderAttribute, ShaderUniforms } from '../components'
import { Transform } from '../components/Transform'
import { GL, glUseProgram } from '../ecs/Game'
import { EntityId } from '../ecs/Registry'
import { Scene } from '../ecs/Scene'
import { System } from '../ecs/System'

export class RenderSystem extends System
{
    private shaders: Set<Shader> = new Set()
    private lights: Set<Light> = new Set()

    constructor(manager: Scene)
    {
        super(manager, Transform, Mesh, Material, Shader)
    }

    //#region Updateable
    public Init(): void
    {
        for (const entityId of this.entities)
        {
            const entity = this.scene.GetEntity(entityId)!

            if (entity instanceof Light)
            {
                this.lights.add(entity)
            }
            else
            {
                const shader = entity.GetComponent(Shader)!
                this.shaders.add(shader)
            }
            
        }
    }

    public Start(): void
    {
        GL.enable(GL.BLEND)
        GL.disable(GL.DEPTH_TEST)
    }

    public Update(delta: number): void
    {
        this.ClearCanvas()

        for (const entityId of this.entities)
        {
            const entity = this.scene.GetEntity(entityId)!
            const [ transform, shader, mesh, material ] = [
                entity.GetComponent(Transform)!,
                entity.GetComponent(Shader)!,
                entity.GetComponent(Mesh)!,
                entity.GetComponent(Material)!
            ]

            this.Draw(transform, shader, mesh, material, delta, entityId)
        }

        this.PostProcess()
        this.CombineRenders()
    }

    public Stop(): void
    {
        GL.enable(GL.DEPTH_TEST)
        GL.disable(GL.BLEND)
    }
    //#endregion

    //#region Render
    private ClearCanvas(): void
    {
        for (const shader of this.shaders)
        {
            GL.viewport(shader.OffsetX, shader.OffsetY, shader.Width, shader.Height)
            GL.clearColor(shader.Clear.R, shader.Clear.G, shader.Clear.B, shader.Clear.A)
            GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)
        }
        
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
        GL.clearColor(0.3, 0.6, 0.9, 1.0)
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)
    }

    private Draw(transform: Transform, shader: Shader, mesh: Mesh, material: Material, delta: number, entityId: EntityId): void
    {
        const [ mv, normal ] = this.CalculateMatrices(transform)

        glUseProgram(shader.Program)

        this.BindAttributes(shader.Attributes!, mesh)
        this.BindUniforms(shader.BaseUniforms!, material, mv, normal, delta, entityId)
        this.BindGlobalUniforms(shader.BaseUniforms!, shader.Height, shader.Width)
        this.Render(shader, mesh)

        glUseProgram(null)
    }

    private PostProcess(): void
    {
        // Bloom
        // Blur
        // Chromatic Abberation
        // Ammbient Occlusion
        // Other 
    }

    private CombineRenders(): void
    {
        
    }
    //#endregion

    //#region Helpers
    private BindAttributes(attributes: ShaderAttribute, mesh: Mesh): void
    {
        if (attributes.Position !== -1)
        {
            if (mesh.PositionBuffer)
            {
                GL.enableVertexAttribArray(attributes.Position)
                GL.bindBuffer(GL.ARRAY_BUFFER, mesh.PositionBuffer)
                GL.vertexAttribPointer(attributes.Position, 3, GL.FLOAT, false, 0, 0)
            }
            else
            {
                GL.disableVertexAttribArray(attributes.Position)
            }
        }

        if (attributes.Normal !== -1)
        {
            if (mesh.NormalBuffer)
            {
                GL.enableVertexAttribArray(attributes.Normal)
                GL.bindBuffer(GL.ARRAY_BUFFER, mesh.NormalBuffer)
                GL.vertexAttribPointer(attributes.Normal, 3, GL.FLOAT, false, 0, 0)
            }
            else
            {
                GL.disableVertexAttribArray(attributes.Normal)
            }
        }

        if (attributes.UV !== -1)
        {
            if (mesh.UVBuffer)
            {
                GL.enableVertexAttribArray(attributes.UV)
                GL.bindBuffer(GL.ARRAY_BUFFER, mesh.UVBuffer)
                GL.vertexAttribPointer(attributes.UV, 2, GL.FLOAT, false, 0, 0)
            }
            else
            {
                GL.disableVertexAttribArray(attributes.UV)
            }

        }

        if (attributes.Colour !== -1)
        {
            if (mesh.ColourBuffer)
            {
                GL.enableVertexAttribArray(attributes.Colour)
                GL.bindBuffer(GL.ARRAY_BUFFER, mesh.ColourBuffer)
                GL.vertexAttribPointer(attributes.Colour, 4, GL.FLOAT, false, 0, 0)
            }
            else
            {
                GL.disableVertexAttribArray(attributes.Colour)
            }
        }
    }

    private BindUniforms(uniforms: ShaderUniforms, material: Material, mv: Matrix4, n: Matrix3, delta: number, entityId:  EntityId): void
    {
        GL.uniform4fv(uniforms.Material.AmbientColour, material.Ambient)
        GL.uniform4fv(uniforms.Material.DiffuseColour, material.Diffuse)
        GL.uniform4fv(uniforms.Material.SpecularColour, material.Specular)
        GL.uniform1f(uniforms.Material.Shininess, material.Shininess)
        GL.uniform1f(uniforms.Material.Alpha, material.Alpha)
        GL.uniform1f(uniforms.Global.Time, delta)
        GL.uniform1i(uniforms.Global.ObjectID, entityId)

        if (material.ImageTexture)
        {
            GL.activeTexture(GL.TEXTURE0)
            GL.bindTexture(GL.TEXTURE_2D, material.ImageTexture)
            GL.uniform1i(uniforms.Material.ImageSampler, 0)
        }
        else
        {
            GL.activeTexture(GL.TEXTURE0)
            GL.bindTexture(GL.TEXTURE_2D, null)
        }

        if (material.NormalTexture)
        {
            GL.activeTexture(GL.TEXTURE1)
            GL.bindTexture(GL.TEXTURE_2D, material.NormalTexture)
            GL.uniform1i(uniforms.Material.BumpSampler, 0)
        }
        else
        {
            GL.activeTexture(GL.TEXTURE1)
            GL.bindTexture(GL.TEXTURE_2D, null)
        }

        if (material.SpecularTexture)
        {
            GL.activeTexture(GL.TEXTURE2)
            GL.bindTexture(GL.TEXTURE_2D, material.SpecularTexture)
            GL.uniform1i(uniforms.Material.SpecularSampler, 0)
        }
        else
        {
            GL.activeTexture(GL.TEXTURE2)
            GL.bindTexture(GL.TEXTURE_2D, null)
        }

        GL.uniformMatrix4fv(uniforms.Matrix.ModelView, false, mv)
        GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, n)
    }

    private BindGlobalUniforms(uniforms: ShaderUniforms, width: number, height: number): void
    {
        // let directional_count: number = 0
        // for (let light of DirectionalLights)
        // {
        //     GL.uniform4fv(shader.BaseUniforms!.DirectionalLights[directional_count].Colour, light.Colour)
        //     GL.uniform1f(shader.BaseUniforms!.DirectionalLights[directional_count].Intensity, light.Intensity)
        //     GL.uniform3fv(shader.BaseUniforms!.DirectionalLights[directional_count].Direction, light.Direction)

        //     ++directional_count
        // }

        // let point_count: number = 0
        // for (let light of PointLights)
        // {
        //     GL.uniform4fv(shader.BaseUniforms!.PointLights[point_count].Colour, light.Colour)
        //     GL.uniform1f(shader.BaseUniforms!.PointLights[point_count].Intensity, light.Intensity)
        //     GL.uniform3fv(shader.BaseUniforms!.PointLights[point_count].Position, light.Position)
        //     GL.uniform1f(shader.BaseUniforms!.PointLights[point_count].Radius, light.Radius)
        //     GL.uniform1f(shader.BaseUniforms!.PointLights[point_count].Angle, light.Angle)

        //     ++point_count
        // }

        const camera = this.scene.Camera!

        // GL.uniform1i(shader.BaseUniforms!.DirectionalLightCount, directional_count)
        // GL.uniform1i(shader.BaseUniforms!.PointLightCount, point_count)
        GL.uniformMatrix4fv(uniforms.Matrix.Projection, false, camera.Matrix)

        GL.uniform1i(uniforms.Global.Time, Date.now())
        GL.uniform2f(uniforms.Global.Resolution, width, height)
        GL.uniform1f(uniforms.Global.NearClip, camera.NearClipping)
        GL.uniform1f(uniforms.Global.FarClip, camera.FarClipping)
        GL.uniform1i(uniforms.Global.ObjectCount, this.entities.size)
    }

    private CalculateMatrices(transform: Transform): [ Matrix4, Matrix3 ]
    {
        const modelView = transform.Matrix.Clone()
        const inverse = modelView.Clone().Inverse()
        const normal = new Matrix3(
            inverse.M11, inverse.M12, inverse.M13,
            inverse.M21, inverse.M22, inverse.M23,
            inverse.M31, inverse.M32, inverse.M33
        )

        return [ modelView, normal ]
    }

    private Render(_: Shader, mesh: Mesh): void
    {
        GL.bindFramebuffer(GL.FRAMEBUFFER, null) //shader.FrameBuffer)

        if (mesh.IndexBuffer)
        {
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer)
            GL.drawElements(GL.TRIANGLES, mesh.IndexCount, GL.UNSIGNED_BYTE, 0)
        }
        else if (mesh.WireframeBuffer)
        {
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.WireframeBuffer)
            GL.drawElements(GL.LINES, mesh.WireframeCount, GL.UNSIGNED_BYTE, 0)
        }
        else
        {
            GL.drawArrays(GL.TRIANGLES, 0, mesh.VertexCount)
        }
    }
    //#endregion
}