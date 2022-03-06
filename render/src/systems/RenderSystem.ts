import { GL, Matrix3, Matrix4 } from '@fwge/common'
import { Entity, EntityId, Registry, Scene, System, Transform } from '@fwge/core'
import { Camera, Material, Mesh, PointLight, Shader } from '../components'
import { Light } from '../components/lights/Light'
import { ShaderAttribute } from '../components/shader/ShaderAttribute'
import { ShaderUniforms } from '../components/shader/ShaderUniforms'
import { CalcuateModelView } from '../utils'

export class RenderSystem extends System
{
    #shaders: Set<Shader> = new Set()
    #lights: Set<Light> = new Set()
    #cameras: Set<Camera> = new Set()

    #transform: number = 0
    #mesh: number = 1
    #material: number = 2
    #shader: number = 3

    constructor(manager: Scene)
    {
        super(manager, Transform, Mesh, Material, Shader)

        this.#transform = this.componentTypeIds[this.#transform]
        this.#mesh = this.componentTypeIds[this.#mesh]
        this.#material = this.componentTypeIds[this.#material]
        this.#shader = this.componentTypeIds[this.#shader]
    }

    Init(): void
    {
        for (const entityId of this.entities)
        {
            const entity = this.scene.GetEntity(entityId)!

            if (entity instanceof Light)
            {
                this.#lights.add(entity)
            }
            else
            {
                const shader = entity.GetComponent(Shader)!
                this.#shaders.add(shader)
            }
        }
    }

    Start(): void
    {
        GL.enable(GL.BLEND)
        GL.disable(GL.DEPTH_TEST)
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

        this.#PostProcess()
        this.#CombineRenders()
    }

    Stop(): void
    {
        GL.enable(GL.DEPTH_TEST)
        GL.disable(GL.BLEND)
    }
    
    #ClearCanvas(): void
    {
        for (const shader of this.#shaders)
        {
            GL.viewport(shader.OffsetX, shader.OffsetY, shader.Width, shader.Height)
            GL.clearColor(shader.Clear[0], shader.Clear[1], shader.Clear[2], shader.Clear[3])
            GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)
        }

        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
        GL.clearColor(0.3, 0.6, 0.9, 1.0)
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)
        
        GL.canvas.width = Camera.Main!.ScreenWidth
        GL.canvas.height = Camera.Main!.ScreenHeight
    }

    #Draw(entity: Entity, delta: number, entityId: EntityId): void
    {
        const [ mv, normal ] = this.#CalculateEntityMatrices(entity)
        const shader = entity.GetComponent(Shader)!
        const mesh = entity.GetComponent(Mesh)!
        const material = entity.GetComponent(Material)!
        
        GL.useProgram(shader.Program)

        this.#BindAttributes(shader.Attributes!, mesh)
        this.#BindUniforms(shader.BaseUniforms!, material, mv, normal, delta, entityId)
        this.#BindGlobalUniforms(shader.BaseUniforms!, shader.Height, shader.Width)
        this.#Render(shader, mesh)

        GL.useProgram(null)
    }

    #PostProcess(): void
    {
        // Bloom
        // Blur
        // Chromatic Abberation
        // Ammbient Occlusion
        // Other 
    }

    #CombineRenders(): void
    {
        
    }
    
    #BindAttributes(attributes: ShaderAttribute, mesh: Mesh): void
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

    #BindUniforms(uniforms: ShaderUniforms, material: Material, mv: Matrix4, n: Matrix3, delta: number, entityId:  EntityId): void
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
        let point_count: number = 0

        for (let light of this.#lights)
        {
            if (light instanceof PointLight)
            {                
                GL.uniform4fv(uniforms.PointLights[point_count].Colour, light.Colour)
                GL.uniform1f(uniforms.PointLights[point_count].Intensity, light.Intensity)
                GL.uniform3fv(uniforms.PointLights[point_count].Position, light.Position)
                GL.uniform1f(uniforms.PointLights[point_count].Radius, light.Radius)
                GL.uniform1f(uniforms.PointLights[point_count].Angle, light.Angle)

                ++point_count
            }
        }

        const camera = Camera.Main!

        if (point_count > 0)
        {
            GL.uniform1i(uniforms.PointLightCount, point_count)
        }

        GL.uniformMatrix4fv(uniforms.Matrix.Projection, false, camera.Matrix)

        GL.uniform1i(uniforms.Global.Time, Date.now())
        GL.uniform2f(uniforms.Global.Resolution, width, height)
        GL.uniform1f(uniforms.Global.NearClip, camera.NearClipping)
        GL.uniform1f(uniforms.Global.FarClip, camera.FarClipping)
        GL.uniform1i(uniforms.Global.ObjectCount, this.entities.size)
    }

    #CalculateEntityMatrices(entity: Entity): [ Matrix4, Matrix3 ]
    {
        let matrix = Matrix4.IDENTITY
        let curr: Entity | undefined = entity

        while (curr)
        {
            const transform = curr.GetComponent(Transform)
            if (transform)
            {
                matrix.Mult(
                    CalcuateModelView(
                        transform.Position,
                        transform.Rotation,
                        transform.Scale
                    )
                )
            }
            curr = curr.Parent
        }
        
        const modelView = matrix.Clone()
        const inverse = matrix.Inverse()
        const normal = new Matrix3(
            inverse[0], inverse[1], inverse[2],
            inverse[3], inverse[4], inverse[5],
            inverse[6], inverse[7], inverse[8]
        )

        return [ modelView, normal ]
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

    override OnUpdateEntity(entity: Entity): void {
        super.OnUpdateEntity(entity)

        const camera = entity.GetComponent(Camera)
        if (camera && !this.#cameras.has(camera))
        {
            this.#cameras.add(camera)
        }        
    }
}
