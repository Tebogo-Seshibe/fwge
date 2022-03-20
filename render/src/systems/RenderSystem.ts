import { GL, Matrix3, Matrix4 } from '@fwge/common'
import { Entity, EntityId, Scene, System, Transform } from '@fwge/core'
import { Camera, Material, Mesh, PointLight, Shader } from '../components'
import { Light } from '../components/lights/Light'
import { ShaderUniforms } from '../components/shader/ShaderUniforms'

export class RenderSystem extends System
{
    #shaders: Set<Shader> = new Set()
    #lights: Set<Light> = new Set()
    #cameras: Set<Camera> = new Set()

    constructor(manager: Scene)
    {
        super(manager, Transform, Mesh, Material, Shader)
    }

    Init(): void
    {
        for (const entityId of this.entities)
        {
            const entity = this.scene.GetEntity(entityId)!
            const shader = entity.GetComponent(Shader)!

            this.#shaders.add(shader)
        }
    }

    Start(): void
    {
        GL.enable(GL.DEPTH_TEST)
        GL.disable(GL.BLEND)
        GL.enable(GL.CULL_FACE)
        
        for (const { Attributes } of this.#shaders)
        {
            GL.enableVertexAttribArray(Attributes!.Position)
            GL.enableVertexAttribArray(Attributes!.Normal)
            GL.enableVertexAttribArray(Attributes!.UV)
            GL.enableVertexAttribArray(Attributes!.Colour)
        }
    }

    Update(delta: number): void
    {
        this.#ClearCanvas()

        let i = 0;
        for (const entityId of this.entities)
        {
            const entity = this.scene.GetEntity(entityId)!

            if (Camera.Main)
            {
                this.#Draw(entity, delta, i++)
            }
        }
    }

    Stop(): void
    {
        GL.enable(GL.BLEND)
        GL.disable(GL.DEPTH_TEST)
        GL.disable(GL.CULL_FACE)
        
        for (const { Attributes } of this.#shaders)
        {
            GL.disableVertexAttribArray(Attributes!.Position)
            GL.disableVertexAttribArray(Attributes!.Normal)
            GL.disableVertexAttribArray(Attributes!.UV)
            GL.disableVertexAttribArray(Attributes!.Colour)
        }
    }
    
    #ClearCanvas(): void
    {
        for (const shader of this.#shaders)
        {
            GL.viewport(shader.Offset[0], shader.Offset[1], shader.Width, shader.Height)
            GL.clearColor(shader.Clear[0], shader.Clear[1], shader.Clear[2], shader.Clear[3])
            GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)
        }

        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
        GL.clearColor(0.0, 0.0, 0.0, 1.0)
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)
        
        GL.canvas.width = Camera.Main!.ScreenWidth
        GL.canvas.height = Camera.Main!.ScreenHeight
    }

    #Draw(entity: Entity, delta: number, entityId: EntityId): void
    {
        const shader = entity.GetComponent(Shader)!
        const mesh = entity.GetComponent(Mesh)!
        const material = entity.GetComponent(Material)!
        const transform = entity.GetComponent(Transform)!
        const [ mv, normal ] = [transform.ModelViewMatrix, transform.NormalMatrix]
        
        GL.useProgram(shader.Program)
        
        GL.bindBuffer(GL.ARRAY_BUFFER, mesh.PositionBuffer)
        GL.vertexAttribPointer(shader.Attributes!.Position, 3, GL.FLOAT, false, 0, 0)
        GL.bindBuffer(GL.ARRAY_BUFFER, mesh.NormalBuffer)
        GL.vertexAttribPointer(shader.Attributes!.Normal, 3, GL.FLOAT, false, 0, 0)
        GL.bindBuffer(GL.ARRAY_BUFFER, mesh.UVBuffer)
        GL.vertexAttribPointer(shader.Attributes!.UV, 2, GL.FLOAT, false, 0, 0)
        GL.bindBuffer(GL.ARRAY_BUFFER, mesh.ColourBuffer)
        GL.vertexAttribPointer(shader.Attributes!.Colour, 4, GL.FLOAT, false, 0, 0)        
        GL.uniform4fv(shader.BaseUniforms!.Material.AmbientColour, material.Ambient)
        GL.uniform4fv(shader.BaseUniforms!.Material.DiffuseColour, material.Diffuse)
        GL.uniform4fv(shader.BaseUniforms!.Material.SpecularColour, material.Specular)
        GL.uniform1f(shader.BaseUniforms!.Material.Shininess, material.Shininess)
        GL.uniform1f(shader.BaseUniforms!.Material.Alpha, material.Alpha)

        this.#BindUniforms(shader.BaseUniforms!, material, mv, normal, delta, entityId)
        this.#BindGlobalUniforms(shader.BaseUniforms!, shader.Height, shader.Width)
        this.#Render(shader, mesh)

        GL.useProgram(null)
    }
    

    #BindUniforms(uniforms: ShaderUniforms, material: Material, mv: Matrix4, n: Matrix3, delta: number, entityId:  EntityId): void
    {
        GL.uniform1f(uniforms.Global.Time, delta)
        GL.uniform1i(uniforms.Global.ObjectID, entityId)

        if (material.ImageTexture)
        {
            GL.activeTexture(GL.TEXTURE0)
            GL.bindTexture(GL.TEXTURE_2D, material.ImageTexture)
            GL.uniform1i(uniforms.Material.HasImageMap, 1)
            GL.uniform1i(uniforms.Material.ImageSampler, 0)
        }
        else
        {
            GL.uniform1i(uniforms.Material.HasImageMap, 0)
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

    #BindGlobalUniforms(uniforms: ShaderUniforms, width: number, height: number): void
    {
        const camera = Camera.Main!
        const transform = camera.Owner?.GetComponent(Transform)!
        GL.uniformMatrix4fv(uniforms.Matrix.View, false, transform.ModelViewMatrix.Inverse())
        GL.uniformMatrix4fv(uniforms.Matrix.Projection, false, camera.Projection)

        GL.uniform1i(uniforms.Global.Time, Date.now())
        GL.uniform2f(uniforms.Global.Resolution, width, height)
        GL.uniform1f(uniforms.Global.NearClip, camera.NearClipping)
        GL.uniform1f(uniforms.Global.FarClip, camera.FarClipping)
        GL.uniform1i(uniforms.Global.ObjectCount, this.entities.size)

        let point_count: number = 0
        for (let light of this.#lights)
        {
            if (light instanceof PointLight)
            {                
                const modelView = light.Owner!.GetComponent(Transform)!.ModelViewMatrix

                GL.uniform4fv(uniforms.PointLights[point_count].Colour, light.Colour)
                GL.uniform1f(uniforms.PointLights[point_count].Intensity, light.Intensity)
                GL.uniform3f(uniforms.PointLights[point_count].Position, modelView.M41, modelView.M42, modelView.M43)
                GL.uniform1f(uniforms.PointLights[point_count].Radius, light.Radius)

                ++point_count
            }
        }
        GL.uniform1i(uniforms.PointLightCount, point_count)
    }

    #Render(_: Shader, mesh: Mesh): void
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

    override OnUpdateEntity(entity: Entity): void
    {
        super.OnUpdateEntity(entity)

        const camera = entity.GetComponent(Camera)
        if (camera && !this.#cameras.has(camera))
        {
            this.#cameras.add(camera)
        }
        
        const pointLight = entity.GetComponent(PointLight)
        if (pointLight && !this.#lights.has(pointLight))
        {
            this.#lights.add(pointLight)
        }
    }
}
