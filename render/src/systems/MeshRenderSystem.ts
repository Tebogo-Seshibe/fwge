import { GL, Matrix3, Matrix4 } from '@fwge/common'
import { Entity, EntityId, Scene, System, Transform } from '@fwge/core'
import { Camera, DynamicMesh, Material, Mesh, PointLight, Shader } from '../components'
import { Light } from '../components/lights/Light'
import { ShaderUniforms } from '../components/shader/ShaderUniforms'

export class MeshRenderSystem extends System
{
    private _shaders: Set<Shader> = new Set()
    private _lights: Set<Light> = new Set()
    private _cameras: Set<Camera> = new Set()

    constructor(manager: Scene)
    {
        super(manager, Mesh, Mesh, Material, Shader)
    }

    Init(): void
    {
        for (const entityId of this.entities)
        {
            const entity = this.scene.GetEntity(entityId)!
            const shader = entity.GetComponent(Shader)!
            
            this._shaders.add(shader)
        }
    }

    Start(): void
    {
        GL.enable(GL.BLEND)
        GL.disable(GL.DEPTH_TEST)
        GL.enable(GL.CULL_FACE)
                
        for (const shader of this._shaders)
        {
            GL.useProgram(shader.Program)

            shader.AttributeList.forEach(attribute =>
            {
                GL.enableVertexAttribArray(attribute.Id)
            })
        }
        
        GL.useProgram(null)
    }

    Update(delta: number): void
    {
        this._ClearCanvas()

        if (Camera.Main)
        {
            for (const entityId of this.entities)
            {
                this._Draw(entityId, delta)
            }
        }

    }

    Stop(): void
    {
        GL.enable(GL.DEPTH_TEST)
        GL.disable(GL.BLEND)
        GL.disable(GL.CULL_FACE)
        
        for (const shader of this._shaders)
        {
            GL.useProgram(shader.Program)
            
            shader.AttributeList.forEach(attribute =>
            {
                GL.disableVertexAttribArray(attribute.Id)
            })
        }
        
        GL.useProgram(null)
    }
    
    private _ClearCanvas(): void
    {
        for (const shader of this._shaders)
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

    private _Draw(entityId: EntityId, delta: number): void
    {
        const entity = this.scene.GetEntity(entityId)!
        const shader = entity.GetComponent(Shader)!
        const mesh = entity.GetComponent(Mesh)!
        const material = entity.GetComponent(Material)!
        const transform = entity.GetComponent(Transform)!
        
        GL.useProgram(shader.Program)

        shader.AttributeList.forEach(attribute =>
        {
            GL.bindBuffer(GL.ARRAY_BUFFER, attribute.Accessor(entity))
            GL.vertexAttribPointer(attribute.Id, attribute.Size, attribute.Type, attribute.Normalized, 0, 0)
        })
        shader.UniformList.forEach(uniform =>
        {
            uniform.Bind(uniform.Accessor(entity))
        })
        

        const mat4 = transform.ModelViewMatrix
        const mat3 = transform.NormalMatrix

        this._BindUniforms(shader.BaseUniforms!, material, mat4, mat3, delta, entityId)
        this._BindGlobalUniforms(shader.BaseUniforms!, shader.Height, shader.Width)
        this._Render(shader, mesh)

        GL.useProgram(null)
    }


    private _BindUniforms(uniforms: ShaderUniforms, material: Material, mv: Matrix4, n: Matrix3, delta: number, entityId:  EntityId): void
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

    private _BindGlobalUniforms(uniforms: ShaderUniforms, width: number, height: number): void
    {
        const camera = Camera.Main!
        GL.uniformMatrix4fv(uniforms.Matrix.Projection, false, camera.Projection)

        GL.uniform1i(uniforms.Global.Time, Date.now())
        GL.uniform2f(uniforms.Global.Resolution, width, height)
        GL.uniform1f(uniforms.Global.NearClip, camera.NearClipping)
        GL.uniform1f(uniforms.Global.FarClip, camera.FarClipping)
        GL.uniform1i(uniforms.Global.ObjectCount, this.entities.size)
        
        let point_count = 0
        for (let light of this._lights)
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

    private _Render(_: Shader, mesh: Mesh): void
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
