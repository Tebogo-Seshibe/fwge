import { GL, Matrix3, Matrix4, Vector3 } from '@fwge/common'
import { Entity, getComponent, Scene, System, Transform } from '@fwge/core'
import { ColourType, DepthType, RenderTarget, ShaderAsset } from '../base'
import { Camera, DirectionalLight, Material, Mesh, PointLight, Renderer, RenderMode, StaticMesh } from '../components'
import { Light } from '../components/lights/Light'

export class RenderSystem extends System
{
    private _cameraModelViewMatrix: Matrix4 = Matrix4.Identity
    private _lights: Set<Light> = new Set()
    private _transparentBatch: Map<number, Map<number, Set<number>>> = new Map()
    private _batch: Map<number, Map<number, Set<number>>> = new Map()
    private _modelViewMatrices: Map<number, Matrix4> = new Map()
    private _normalMatrices: Map<number, Matrix3> = new Map()
    private _lightMatrices: Map<number, Matrix4> = new Map()

    private _windows: Window[] = []
    defaultRenderTarget!: RenderTarget
    renderTarget!: RenderTarget
    shadowRenderTarget!: RenderTarget
    plane!: StaticMesh
    material!: Material
    shader!: ShaderAsset
    
    // projection = Matrix4.OrthographicProjectionMatrix(-50, 50, 500)
    projection = Matrix4.OrthographicProjection(
        [-35,-35, -35],
        [ 35, 35,  35],
        [ 90, 90]
    ).Transpose()
    modelview = Matrix4.TransformationMatrix(
        [   0,   0,   0],
        [ -45,   0,   0],
        [   1,   1,   1]
    )
    
    constructor(scene: Scene)
    {
        super(scene, { requiredComponents: [ Transform, Material, Renderer ] })
    }

    Init(): void
    {
        this.defaultRenderTarget = new RenderTarget({
            colour: [],
            depth: DepthType.NONE,
            height: 1080,
            width: 1920,
            clear: [0,0,0,0]
        })
        
        this.renderTarget = new RenderTarget(
        {
            colour: [ ColourType.RGBA, ColourType.RGBA ],
            depth: DepthType.INT24,
            height: 1080,
            width: 1920,
            clear: [0,0,0,0]
        })

        this.shadowRenderTarget = new RenderTarget(
        {
            colour: [],
            depth: DepthType.FLOAT32,
            height: 8192,
            width: 8192,
            clear: [1,1,1,1]
        })

        this.plane = new StaticMesh(
        {
            position: [
                [-1, 1, 0],
                [-1,-1, 0],
                [ 1,-1, 0],
                [ 1, 1, 0],
            ],
            uv: [
                [0,1],
                [0,0],
                [1,0],
                [1,1],
            ],
            index: [
                0,1,2,0,2,3
            ]
        })

        this.material = new Material(
        {
            shader: new ShaderAsset(
                `#version 300 es
                #pragma vscode_glsllint_stage: vert

                layout(location = 0) in vec4 A_Position;
        
                struct Matrix
                {
                    mat4 ModelView;
                    mat4 View;
                    mat4 Projection;
                };
                uniform Matrix U_Matrix;
                
                void main(void)
                {                    
                    gl_Position = U_Matrix.Projection * U_Matrix.View * U_Matrix.ModelView * A_Position;
                }`,

                `#version 300 es
                #pragma vscode_glsllint_stage: frag
                
                void main(void)
                {
                    
                }`
            )
        })

        this.shader = new ShaderAsset(
            `#version 300 es
            #pragma vscode_glsllint_stage: vert

            layout(location = 0) in vec4 A_Position;
            layout(location = 2) in vec2 A_UV;    
            out vec2 V_UV;

            void main(void)
            {
                V_UV = A_UV;
                gl_Position = A_Position;
            }`,

            `#version 300 es
            #pragma vscode_glsllint_stage: frag

            precision highp float;

            in vec2 V_UV;
            layout(location = 0) out vec4 O_FragColour;

            uniform sampler2D U_RenderImage;
            uniform sampler2D U_DepthImage;

            void main(void)
            {
                O_FragColour = texture(U_DepthImage, V_UV).rrrr;
                O_FragColour = texture(U_RenderImage, V_UV);
            }`
        )
    }

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
            transform.ModelViewMatrix(this._cameraModelViewMatrix).Inverse()
        }
            
        GL.enable(GL.DEPTH_TEST)
        GL.enable(GL.CULL_FACE)
        GL.depthMask(true)
        
        // const dir = [...this._lights].filter(light => light instanceof DirectionalLight) as DirectionalLight[]
        // for (const light of dir)
        // {
        //     light.renderTarget.Bind()
        //     this.renderBatch(this._batch, this.projection, this.modelview)
        //     this.renderBatch(this._transparentBatch, this.projection, this.modelview, this.material)
        //     light.renderTarget.UnBind()
        // }
        
        this.shadowRenderTarget.Bind()
        this.renderBatch(this._batch, this.projection, this.modelview)
        this.renderBatch(this._transparentBatch, this.projection, this.modelview, this.material)
        this.shadowRenderTarget.UnBind()

        this.renderTarget.Bind()
        this.renderBatch(this._batch, Camera.Main!.ProjectionMatrix, this._cameraModelViewMatrix)
        this.renderBatch(this._transparentBatch, Camera.Main!.ProjectionMatrix, this._cameraModelViewMatrix)
        this.renderTarget.UnBind()

        this.defaultRenderTarget.Bind()
        this.shader.Bind()
        this.shader.SetTexture(0, 'U_RenderImage' , this.renderTarget.ColourAttachments[0])
        this.shader.SetTexture(1, 'U_DepthImage', this.shadowRenderTarget.DepthAttachment!)

        GL.bindVertexArray(this.plane.VertexArrayBuffer)
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.plane.FaceBuffer)
        GL.drawElements(GL.TRIANGLES, this.plane.FaceCount, GL.UNSIGNED_BYTE, 0)
        GL.bindVertexArray(null)
        this.defaultRenderTarget.UnBind()
        
    }

    renderBatch(batch: Map<number, Map<number, Set<number>>>, projection: Matrix4, modelview: Matrix4, mat?: Material)
    {
        for (const [materialId, renderers] of batch)
        {
            const material = mat ?? getComponent(Material, materialId)
            if (!material.Shader)
            {
                continue
            }

            material.Bind() 
            this._bindShader(material, projection, modelview) 
            if (!this.projection.Equals(projection))         
            {
                material.Shader.SetMatrix(
                    'U_LightSpaceMatrix',
                    Matrix4.Multiply(this.projection, this.modelview)
                )
                GL.activeTexture(GL.TEXTURE7)
                GL.bindTexture(GL.TEXTURE_2D, this.shadowRenderTarget.DepthAttachment)
                material.Shader.SetInt('U_ShadowMap', 7)
            }

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
                        count = mesh.FaceCount

                        if (mesh.IsIndexed)
                        {
                            buffer = mesh.FaceBuffer
                        }
                    }
                    break

                    case RenderMode.EDGE:
                    {
                        mode = GL.LINES
                        count = mesh.EdgeCount

                        if (mesh.IsIndexed)
                        {
                            buffer = mesh.EdgeBuffer
                            mode = GL.LINES
                        }
                    }
                    break

                    case RenderMode.POINT:
                    {
                        mode = GL.POINTS
                        count = mesh.PointCount

                        if (mesh.IsIndexed)
                        {
                            buffer = mesh.PointBuffer
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
                    Matrix3.Inverse(modelView.Matrix3.Transpose(), normal)
                    
                    GL.uniformMatrix4fv(material.Shader.Matrices!.ModelView, true, modelView)
                    GL.uniformMatrix3fv(material.Shader.Matrices!.Normal, true, normal)
                    
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
        }
    }

    private _bindShader(material: Material, projection: Matrix4, modelview: Matrix4): void
    {
        const shader = material.Shader!
        GL.uniformMatrix4fv(shader.Matrices!.View, true, modelview)
        GL.uniformMatrix4fv(shader.Matrices!.Projection, true, projection)

        let point_count: number = 0
        for (let light of this._lights)
        {
            if (light instanceof PointLight)
            {
                shader.SetFloatVector(`U_PointLight[${point_count}].Ambient`, light.Ambient)
                shader.SetFloatVector(`U_PointLight[${point_count}].Diffuse`, light.Diffuse)
                shader.SetFloatVector(`U_PointLight[${point_count}].Specular`, light.Specular)
                shader.SetFloat(`U_PointLight[${point_count}].Radius`, light.Radius)
                shader.SetFloat(`U_PointLight[${point_count}].Intensity`, light.Intensity)
                shader.SetFloatVector(`U_PointLight[${point_count}].Position`, light.Owner!.GetComponent(Transform)!.GlobalPosition())
            }
            else if (light instanceof DirectionalLight)
            {
                shader.SetFloatVector(`U_DirectionalLight.Ambient`, light.Ambient)
                shader.SetFloatVector(`U_DirectionalLight.Diffuse`, light.Diffuse)
                shader.SetFloatVector(`U_DirectionalLight.Specular`, light.Specular)
                shader.SetFloat(`U_DirectionalLight.Intensity`, light.Intensity)
                shader.SetFloatVector(`U_DirectionalLight.Direction`, Vector3.Negate(light.Direction).Normalize())
            }
            point_count++
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
            const renderer = entity.GetComponent(Renderer)!
            const transform = entity.GetComponent(Transform)!

            const materialMap = (material.HasTransparency ? this._transparentBatch : this._batch) ?? new Map<number, Map<number, Set<number>>>()
            const meshMap = materialMap.get(material.Id) ?? new Map<number, Set<number>>()
            const transformSet = meshMap.get(renderer.Id) ?? new Set<number>()

            meshMap.set(renderer.Id, new Set([...transformSet, transform.Id]))
            materialMap.set(material.Id, meshMap)
            if (material.HasTransparency)
            {
                this._transparentBatch = materialMap
            }
            else
            {
                this._batch = materialMap
            }
            this._modelViewMatrices.set(transform.Id, Matrix4.Identity)
            this._normalMatrices.set(transform.Id, Matrix3.Identity)
        }
    }
}
