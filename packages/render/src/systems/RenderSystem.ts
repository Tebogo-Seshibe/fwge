import { GL } from '@fwge/common'
import { Entity, getComponent, System, Transform } from '@fwge/core'
import { ShaderAsset } from '../base'
import { Camera, Material, Mesh, PointLight, Renderer, RenderMode } from '../components'
import { Light } from '../components/lights/Light'

export class RenderSystem extends System
{
    #lights: Set<Light> = new Set()
    #newBatch: Map<number, Map<number, Set<number>>> = new Map()

    constructor()
    {
        super({ requiredComponents: [ Transform, Mesh, Material, Renderer ] })
    }

    Init(): void { }
    Start(): void { }
    Stop(): void { }

    Update(_: number): void
    {
        if (!Camera.Main)
        {
            return
        }

        GL.bindFramebuffer(GL.FRAMEBUFFER, null)
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
        GL.clearColor(0, 0, 0, 0)
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)
            
        GL.enable(GL.DEPTH_TEST)
        GL.enable(GL.CULL_FACE)
        GL.depthMask(true)

        for (const [materialId, renderers] of this.#newBatch)
        {
            const material = getComponent(Material, materialId)
            const shader = material.Shader
            if (!shader)
            {
                continue
            }

            shader.Bind()
            material.Bind()
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
                        mode = GL.TRIANGLES
                        if (mesh.FaceBuffer)
                        {
                            buffer = mesh.FaceBuffer
                            count = mesh.FaceCount
                        }
                        break

                    case RenderMode.EDGE: 
                        mode = GL.LINES
                        if (mesh.EdgeBuffer)
                        {
                            buffer = mesh.EdgeBuffer
                            count = mesh.EdgeCount
                        }
                        break

                    case RenderMode.POINT: 
                        mode = GL.POINTS
                        if (mesh.PointBuffer)
                        {
                            buffer = mesh.PointBuffer
                            count = mesh.PointCount
                        }
                        break
                }
                
                GL.bindVertexArray(mesh.VertexArrayBuffer)
                // count = 3
                // buffer = null
                for (const transformId of transforms)
                {
                    const transform = getComponent(Transform, transformId)
                    const modelView = transform.ModelViewMatrix

                    GL.uniformMatrix4fv(shader.Matrices!.ModelView, true, modelView)
                    GL.uniformMatrix3fv(shader.Matrices!.Normal, true, modelView.Matrix3.Inverse())
                    
                    if (buffer)
                    {
                        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer)
                        GL.drawElements(mode, count, GL.UNSIGNED_BYTE, 0)
                    }
                    else
                    {
                        GL.drawArrays(mode, 0, count)
                    }
                }
                GL.bindVertexArray(null)
            }
            material.UnBind()
            shader.UnBind()
        }
    }

    private _bindLightUniforms(shader: ShaderAsset)
    {
        let point_count: number = 0
        for (let light of this.#lights)
        {
            if (light instanceof PointLight)
            {
                const position = light.Owner!.GetComponent(Transform)!.Position

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

        const pointLight = entity.GetComponent(PointLight)
        if (pointLight && !this.#lights.has(pointLight))
        {
            this.#lights.add(pointLight)
        }

        if (this.IsValidEntity(entity))
        {
            const material = entity.GetComponent(Material)!
            const renderer = entity.GetComponent(Renderer<any>)!
            const transform = entity.GetComponent(Transform)!

            const materialMap = this.#newBatch ?? new Map<number, Map<number, Set<number>>>()
            const meshMap = materialMap.get(material.Id) ?? new Map<number, Set<number>>()
            const transformSet = meshMap.get(renderer.Id) ?? new Set<number>()

            meshMap.set(renderer.Id, new Set([...transformSet, transform.Id]))
            materialMap.set(material.Id, meshMap)
            this.#newBatch = materialMap
        }
    }
}
