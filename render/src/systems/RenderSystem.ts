import { GL } from '@fwge/common'
import { Entity, EntityId, Scene, System, Transform } from '@fwge/core'
import { Camera, DynamicMesh, Material, Mesh, PointLight, Shader, StaticMesh } from '../components'
import { Light } from '../components/lights/Light'
import { ShaderUniforms } from '../components/shader/ShaderUniforms'

export class RenderSystem extends System
{
    private _shaders: Set<Shader> = new Set()
    private _lights: Set<Light> = new Set()
    private _cameras: Set<Camera> = new Set()
    private _groupedObjects: Map<Shader, EntityId[]> = new Map()

    private _batches: Map<Shader, Map<Mesh, Entity[]>> = new Map()

    constructor(manager: Scene)
    {
        super(manager, Transform, Mesh, Material, Shader)
    }

    Init(): void
    {
        for (const entity of this.entities)
        {
            const shader = entity.GetComponent(Shader)!
            const mesh = entity.GetComponent(Mesh)!

            this._shaders.add(shader)
            if (!this._groupedObjects.has(shader))
            {
                this._groupedObjects.set(shader, [])
            }
            this._groupedObjects.get(shader)!.push(entity.Id)

            if (!this._batches.has(shader))
            {
                this._batches.set(shader, new Map())
            }
            const meshes = this._batches.get(shader)!
            if (!meshes.has(mesh))
            {
                meshes.set(mesh, [])   
            }
            meshes.get(mesh)!.push(entity)
        }

        console.log(this._batches)
    }

    Start(): void
    {
        console.log(this)        

        GL.enable(GL.DEPTH_TEST)
        GL.disable(GL.BLEND)
        GL.enable(GL.CULL_FACE)
        
        GL.canvas.width = Camera.Main!.ScreenWidth
        GL.canvas.height = Camera.Main!.ScreenHeight
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
        GL.clearColor(0.3, 0.6, 0.9, 1.0)
        
        for (const { Attributes } of this._shaders)
        {
            if (Attributes!.Position !== -1) GL.enableVertexAttribArray(Attributes!.Position)
            if (Attributes!.Normal !== -1) GL.enableVertexAttribArray(Attributes!.Normal)
            if (Attributes!.UV !== -1) GL.enableVertexAttribArray(Attributes!.UV)
            if (Attributes!.Colour !== -1) GL.enableVertexAttribArray(Attributes!.Colour)
        }
    }

    Update(delta: number): void
    {
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)

        let i = 0;
        for (const [shader, entityList] of this._groupedObjects)
        {
            GL.useProgram(shader.Program)
            this._bindGlobalUniforms(shader.BaseUniforms!, shader.Height, shader.Width)
            for (const entityId of entityList)
            {
                const entity = this.scene.GetEntity(entityId)!

                if (Camera.Main)
                {
                    this._draw(entity, delta, i++)
                }
            }

            GL.useProgram(null)
        }
    }

    Stop(): void
    {
        GL.enable(GL.BLEND)
        GL.disable(GL.DEPTH_TEST)
        GL.disable(GL.CULL_FACE)
        
        for (const { Attributes } of this._shaders)
        {
            GL.disableVertexAttribArray(Attributes!.Position)
            GL.disableVertexAttribArray(Attributes!.Normal)
            GL.disableVertexAttribArray(Attributes!.UV)
            GL.disableVertexAttribArray(Attributes!.Colour)
        }
    }

    _draw(entity: Entity, delta: number, entityId: EntityId): void
    {
        const shader = entity.GetComponent(Shader)!
        const mesh = entity.GetComponent(Mesh)!
        const material = entity.GetComponent(Material)!
        const transform = entity.GetComponent(Transform)!        
        
        GL.bindVertexArray(mesh.VertexArrayBuffer)

        GL.uniform4f(
            shader.BaseUniforms!.Material.AmbientColour,
            material.Ambient[0],
            material.Ambient[1],
            material.Ambient[2],
            material.Ambient[3],
        )
        GL.uniform4f(
            shader.BaseUniforms!.Material.DiffuseColour,
            material.Diffuse[0],
            material.Diffuse[1],
            material.Diffuse[2],
            material.Diffuse[3],
        )
        GL.uniform4f(
            shader.BaseUniforms!.Material.SpecularColour,
            material.Specular[0],
            material.Specular[1],
            material.Specular[2],
            material.Specular[3],
        )
        GL.uniform1f(shader.BaseUniforms!.Material.Shininess, material.Shininess)
        GL.uniform1f(shader.BaseUniforms!.Material.Alpha, material.Alpha)

        this._bindUniforms(shader.BaseUniforms!, material, transform, delta, entityId)
        this._render(mesh)
        GL.bindVertexArray(null)
    }
    

    _bindUniforms(uniforms: ShaderUniforms, material: Material, transform: Transform, delta: number, entityId:  EntityId): void
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

        GL.uniformMatrix4fv(uniforms.Matrix.ModelView, false, transform.ModelViewMatrix)
        GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, transform.NormalMatrix)
    }

    _bindGlobalUniforms(uniforms: ShaderUniforms, width: number, height: number): void
    {
        const camera = Camera.Main!
        GL.uniformMatrix4fv(uniforms.Matrix.View, false, camera.View)
        GL.uniformMatrix4fv(uniforms.Matrix.Projection, false, camera.Projection)

        GL.uniform1i(uniforms.Global.Time, performance.now())
        GL.uniform2f(uniforms.Global.Resolution, width, height)
        GL.uniform1f(uniforms.Global.NearClip, camera.NearClipping)
        GL.uniform1f(uniforms.Global.FarClip, camera.FarClipping)
        GL.uniform1i(uniforms.Global.ObjectCount, this.entities.length)

        let point_count: number = 0
        for (let light of this._lights)
        {
            if (light instanceof PointLight)
            {
                const modelView = light.Owner!.GetComponent(Transform)!.ModelViewMatrix

                GL.uniform4f(
                    uniforms.PointLights[point_count].Colour, 
                    light.Colour[0],
                    light.Colour[1],
                    light.Colour[2],
                    light.Colour[3],
                )
                GL.uniform1f(uniforms.PointLights[point_count].Intensity, light.Intensity)
                GL.uniform3f(uniforms.PointLights[point_count].Position, modelView[12], modelView[13], modelView[14])
                GL.uniform1f(uniforms.PointLights[point_count].Radius, light.Radius)

                ++point_count
            }
        }
        GL.uniform1i(uniforms.PointLightCount, point_count)
    }

    _render(mesh: Mesh): void
    {
        GL.bindFramebuffer(GL.FRAMEBUFFER, null) //shader.FrameBuffer)

        if (mesh instanceof DynamicMesh)
        {
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
        else if (mesh instanceof StaticMesh)
        {
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
    }

    override OnUpdateEntity(entity: Entity): void
    {
        super.OnUpdateEntity(entity)

        const camera = entity.GetComponent(Camera)
        if (camera && !this._cameras.has(camera))
        {
            this._cameras.add(camera)
        }
        
        const pointLight = entity.GetComponent(PointLight)
        if (pointLight && !this._lights.has(pointLight))
        {
            this._lights.add(pointLight)
        }
    }
}
