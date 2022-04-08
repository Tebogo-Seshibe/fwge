import { GL, Vector2 } from '@fwge/common'
import { Entity, EntityId, Scene, System, Transform } from '@fwge/core'
import { ShaderAsset } from '../base'
import { Camera, DynamicMesh, Material, Mesh, PointLight, StaticMesh } from '../components'
import { Light } from '../components/lights/Light'
import { ShaderUniforms } from '../components/shader/ShaderUniforms'

export class RenderSystem extends System
{
    private _screenVAO: WebGLVertexArrayObject | null = null
    private _lights: Set<Light> = new Set()
    private _cameras: Set<Camera> = new Set()
    private _screenShader: ShaderAsset | null = null

    private _batches: Map<Material, EntityId[]> = new Map()

    constructor(manager: Scene)
    {
        super(manager,
        {
            requiredComponents: [ Transform, Mesh, Material ]
        })
    }

    Init(): void
    {
        this._buildScreenShader()

        for (const entityId of this.entities)
        {
            const entity = this.scene.GetEntity(entityId)!
            const material = entity.GetComponent(Material)!

            if (!this._batches.has(material))
            {
                this._batches.set(material, [])
            }
            
            this._batches.get(material)!.push(entity.Id)
        }
    }

    private _buildScreenShader()
    {
        this._screenShader = new ShaderAsset(
        { 
            vertexShader:
            {
                source: `#version 300 es
                layout(location = 0) in vec3 A_Position;
                layout(location = 1) in vec2 A_UV;

                out vec2 V_UV;
                void main()
                {
                    V_UV =  A_UV;
                    gl_Position = vec4(A_Position,  1.0);
                }`,
                input: []
            },
            fragmentShader:
            {
                source: `#version 300 es
                precision highp float;
                
                out vec4 colour;
                void main()
                {
                    colour = vec4(1.0);
                }`,
                input: []
            }
        })

        const vertexbuffer = GL.createBuffer()
        const indexBuffer = GL.createBuffer()
        GL.bindBuffer(GL.ARRAY_BUFFER, vertexbuffer)
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(
        [
            -0.5,  0.5,    0.0, 1.0,
            -0.5, -0.5,    0.0, 0.0,
             0.5, -0.5,    1.0, 0.0,
             0.5,  0.5,    1.0, 1.0,
        ]), GL.STATIC_DRAW)
        GL.bindBuffer(GL.ARRAY_BUFFER, indexBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(
        [
            0, 1, 2,
            0, 2, 3
        ]), GL.STATIC_DRAW)

        this._screenVAO = GL.createVertexArray()
        GL.bindVertexArray(this._screenVAO)
        GL.enableVertexAttribArray(0)
        GL.vertexAttribPointer(0, Vector2.SIZE, GL.FLOAT, false, 16, 0)

        GL.enableVertexAttribArray(1)
        GL.vertexAttribPointer(1, Vector2.SIZE, GL.FLOAT, false, 16, 8)

        GL.bindVertexArray(null)
    }

    Start(): void
    {
        GL.enable(GL.DEPTH_TEST)
        GL.disable(GL.BLEND)
        GL.enable(GL.CULL_FACE)
        
        GL.canvas.width = Camera.Main!.ScreenWidth
        GL.canvas.height = Camera.Main!.ScreenHeight
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
        GL.clearColor(0.3, 0.6, 0.9, 1.0)
        
    }

    Update(delta: number): void
    {
        if (!Camera.Main)
        {
            return
        }

        for (const [material, entityList] of this._batches)
        {
            this._useShader(material, delta)
            for (const entityId of entityList)
            {
                const entity = this.scene.GetEntity(entityId)!
                this._draw(entity)
            }
        }

        GL.bindVertexArray(null)
        GL.useProgram(null)
    }

    Stop(): void
    {
        GL.enable(GL.BLEND)
        GL.disable(GL.DEPTH_TEST)
        GL.disable(GL.CULL_FACE)
    }

    _draw(entity: Entity): void
    {
        const mesh = entity.GetComponent(Mesh)!
        const material = entity.GetComponent(Material)!
        const transform = entity.GetComponent(Transform)!
        
        GL.bindVertexArray(mesh.VertexArrayBuffer)
        GL.uniformMatrix4fv(material.Shader!.Matrices!.ModelView, false, transform.ModelViewMatrix)
        GL.uniformMatrix3fv(material.Shader!.Matrices!.Normal, false, transform.NormalMatrix)

        // GL.uniform1i(uniforms.Global.ObjectID, entityId)
        this._render(mesh)
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

    _bindMaterialUniforms()
    {
        
    }

    _bindLightUniforms()
    {

    }

    _bindGlobalUniforms(uniforms: ShaderUniforms): void
    {
        const camera = Camera.Main!
        GL.uniformMatrix4fv(uniforms.Matrix.View, false, camera.View)
        GL.uniformMatrix4fv(uniforms.Matrix.Projection, false, camera.Projection)   

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
        // GL.bindFramebuffer(GL.FRAMEBUFFER, shader.FrameBuffer)
        if (mesh.IndexBuffer)
        {
            GL.drawElements(GL.TRIANGLES, mesh.IndexCount, GL.UNSIGNED_BYTE, 0)
        }
        else if (mesh.WireframeBuffer)
        {
            GL.drawElements(GL.LINES, mesh.WireframeCount, GL.UNSIGNED_BYTE, 0)
        }
        else
        {
            GL.drawArrays(GL.TRIANGLES, 0, mesh.VertexCount)
        }
    }

    private _useShader(material: Material, delta: number)
    {
        const shader: ShaderAsset = material.Shader!
        GL.useProgram(shader.Program)

        GL.uniformMatrix4fv(shader.Matrices!.View, false, Camera.Main!.View)
        GL.uniformMatrix4fv(shader.Matrices!.Projection, false, Camera.Main!.Projection)

        // let point_count: number = 0
        // for (let light of this._lights)
        // {
        //     if (light instanceof PointLight)
        //     {
        //         const modelView = light.Owner!.GetComponent(Transform)!.ModelViewMatrix

        //         GL.uniform4f(
        //             uniforms.PointLights[point_count].Colour, 
        //             light.Colour[0],
        //             light.Colour[1],
        //             light.Colour[2],
        //             light.Colour[3],
        //         )
        //         GL.uniform1f(uniforms.PointLights[point_count].Intensity, light.Intensity)
        //         GL.uniform3f(uniforms.PointLights[point_count].Position, modelView[12], modelView[13], modelView[14])
        //         GL.uniform1f(uniforms.PointLights[point_count].Radius, light.Radius)

        //         ++point_count
        //     }
        // }
        // GL.uniform1i(uniforms.PointLightCount, point_count)

        GL.uniform4f(
            shader.Material!.AmbientColour,
            material.Ambient[0],
            material.Ambient[1],
            material.Ambient[2],
            material.Ambient[3],
        )
        GL.uniform4f(
            shader.Material!.DiffuseColour,
            material.Diffuse[0],
            material.Diffuse[1],
            material.Diffuse[2],
            material.Diffuse[3],
        )
        GL.uniform4f(
            shader.Material!.SpecularColour,
            material.Specular[0],
            material.Specular[1],
            material.Specular[2],
            material.Specular[3],
        )
        GL.uniform1f(shader.Material!.Shininess, material.Shininess)
        GL.uniform1f(shader.Material!.Alpha, material.Alpha)
        
        if (material.ImageTexture)
        {
            GL.activeTexture(GL.TEXTURE0)
            GL.bindTexture(GL.TEXTURE_2D, material.ImageTexture)
            GL.uniform1i(shader.Material!.HasImageMap, 1)
            GL.uniform1i(shader.Material!.ImageSampler, 0)
        }
        else
        {
            GL.uniform1i(shader.Material!.HasImageMap, 0)
            GL.activeTexture(GL.TEXTURE0)
            GL.bindTexture(GL.TEXTURE_2D, null)
        }

        if (material.NormalTexture)
        {
            GL.activeTexture(GL.TEXTURE1)
            GL.bindTexture(GL.TEXTURE_2D, material.NormalTexture)
            GL.uniform1i(shader.Material!.BumpSampler, 0)
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
            GL.uniform1i(shader.Material!.SpecularSampler, 0)
        }
        else
        {
            GL.activeTexture(GL.TEXTURE2)
            GL.bindTexture(GL.TEXTURE_2D, null)
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
