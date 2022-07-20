import { GL, Matrix3, Matrix4, Vector3, Vector4 } from '@fwge/common'
import { Entity, getComponent, Scene, System, Transform } from '@fwge/core'
import { ShaderAsset } from '../base'
import { Camera, Material, Mesh, PointLight, Renderer, RenderMode } from '../components'
import { Light } from '../components/lights/Light'

export class RenderSystem extends System
{
    private _cameraModelViewMatrix: Matrix4 = Matrix4.Identity
    private _lights: Set<Light> = new Set()
    private _batch: Map<number, Map<number, Set<number>>> = new Map()
    private _modelViewMatrices: Map<number, Matrix4> = new Map()
    private _normalMatrices: Map<number, Matrix3> = new Map()

    constructor(scene: Scene)
    {
        super(scene, { requiredComponents: [ Transform, Material, Renderer ] })
    }

    Init(): void { console.log(this) }
    Start(): void { }
    Stop(): void { }

    Update(_: number): void
    {
        if (!Camera.Main || !Camera.Main?.Owner?.HasComponent(Transform))
        {
            return
        }
        else
        {
            const transform = Camera.Main.Owner.GetComponent(Transform)!
            transform.ModelViewMatrix(this._cameraModelViewMatrix)
        }

        GL.bindFramebuffer(GL.FRAMEBUFFER, null)
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
        GL.clearColor(0, 0, 0, 0)
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)
            
        GL.enable(GL.DEPTH_TEST)
        GL.enable(GL.CULL_FACE)
        GL.depthMask(true)

        for (const [materialId, renderers] of this._batch)
        {
            const material = getComponent(Material, materialId)
            if (!material.Shader)
            {
                continue
            }

            material.Bind() 
            this._bindLightUniforms(material.Shader)          
            GL.uniformMatrix4fv(material.Shader.Matrices!.View, true, Matrix4.Inverse(this._cameraModelViewMatrix))
            GL.uniformMatrix4fv(material.Shader.Matrices!.Projection, true, Camera.Main!.ProjectionMatrix)

            for (const [rendererId, transforms] of renderers)
            {
                const renderer = getComponent(Renderer, rendererId)
                const mesh = renderer.Asset! as Mesh
                let mode = -1
                let count = 0
                let buffer = null
                
                switch (renderer.RenderMode)
                {
                    case RenderMode.FACE:
                    {
                        mode = GL.TRIANGLES
                        if (mesh.FaceCount !== -1)
                        {
                            buffer = mesh.FaceBuffer
                            count = mesh.FaceCount
                        }
                    }
                    break

                    case RenderMode.EDGE:
                    {
                        mode = GL.LINES
                        if (mesh.EdgeCount !== -1)
                        {
                            buffer = mesh.EdgeBuffer
                            count = mesh.EdgeCount
                        }
                    }
                    break

                    case RenderMode.POINT:
                    {
                        mode = GL.POINTS
                        if (mesh.PointCount !== -1)
                        {
                            buffer = mesh.PointBuffer
                            count = mesh.PointCount
                        }
                    }
                    break
                }

                GL.bindVertexArray(mesh.VertexArrayBuffer)
                for (const transformId of transforms)
                {
                    const transform = getComponent(Transform, transformId)
                    const modelView = this._modelViewMatrices.get(transformId)!
                    const normal = this._normalMatrices.get(transformId)!

                    transform.ModelViewMatrix(modelView)
                    Matrix3.Inverse(modelView.Matrix3, normal)
                    
                    GL.uniformMatrix4fv(material.Shader.Matrices!.ModelView, true, modelView)
                    GL.uniformMatrix3fv(material.Shader.Matrices!.Normal, true, normal)
                    
                    if (buffer)
                    {
                        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer)
                        GL.drawElements(mode, count, GL.UNSIGNED_BYTE, 0)
                    }
                    else
                    {
                        console.log(count)
                        GL.drawArrays(mode, 0, count)
                    }
                }
                GL.bindVertexArray(null)
            }
            material.UnBind()
        }
    }

    private _bindLightUniforms(shader: ShaderAsset)
    {
        let point_count: number = 0
        for (let light of this._lights)
        {
            if (light instanceof PointLight)
            {
                const position = light.Owner!.GetComponent(Transform)!.GlobalPosition()

                GL.uniform4f(
                    shader.Lights![point_count].Colour,
                    light.Colour[0],
                    light.Colour[1],
                    light.Colour[2],
                    light.Colour[3],
                )

                GL.uniform3f(
                    shader.Lights![point_count].Position,
                    position[0],
                    position[1],
                    position[2]
                )

                GL.uniform1f(shader.Lights![point_count].Intensity, light.Intensity)
                GL.uniform1f(shader.Lights![point_count].Radius, light.Radius)

                ++point_count
            }
        }
    }

    override OnUpdateEntity(entity: Entity): void
    {
        super.OnUpdateEntity(entity)

        const light = entity.GetComponent(Light)
        if (light && !this._lights.has(light))
        {
            this._lights.add(light)
        }

        if (this.IsValidEntity(entity))
        {
            const material = entity.GetComponent(Material)!
            const renderer = entity.GetComponent(Renderer<any>)!
            const transform = entity.GetComponent(Transform)!

            const materialMap = this._batch ?? new Map<number, Map<number, Set<number>>>()
            const meshMap = materialMap.get(material.Id) ?? new Map<number, Set<number>>()
            const transformSet = meshMap.get(renderer.Id) ?? new Set<number>()

            meshMap.set(renderer.Id, new Set([...transformSet, transform.Id]))
            materialMap.set(material.Id, meshMap)
            this._batch = materialMap
            this._modelViewMatrices.set(transform.Id, Matrix4.Identity)
            this._normalMatrices.set(transform.Id, Matrix3.Identity)
        }
    }
}
