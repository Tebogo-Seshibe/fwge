import { GL, Matrix2, Matrix3, Matrix4, Vector3, Vector4 } from '@fwge/common'
import { Entity, getComponent, Scene, System, Transform } from '@fwge/core'
import { ColourType, DepthType, RenderTarget, ShaderAsset, ShaderInput } from '../base'
import { Camera, DirectionalLight, Material, Mesh, PointLight, Renderer, RenderMode, StaticMesh } from '../components'
import { Light } from '../components/lights/Light'
import { ShaderVec2, ShaderVec3 } from '../components/shader/types/Types'

export class RenderSystem extends System
{
    private _cameraModelViewMatrix: Matrix4 = Matrix4.Identity
    private _lights: Set<Light> = new Set()
    private _transparentBatch: Map<number, Map<number, Set<number>>> = new Map()
    private _batch: Map<number, Map<number, Set<number>>> = new Map()
    private _modelViewMatrices: Map<number, Matrix4> = new Map()
    private _normalMatrices: Map<number, Matrix3> = new Map()

    private _windows: Window[] = []
    renderTarget!: RenderTarget
    shadowRenderTarget!: RenderTarget
    plane!: StaticMesh
    material!: Material
    shader!: ShaderAsset
    

    projection = Matrix4.OrthographicProjection(-5,-5,-5,5,5,5,90,90)
    modelview = Matrix4.TransformationMatrix([0,-1,0], [-90,0,0], [1,1,1])

    constructor(scene: Scene)
    {
        super(scene, { requiredComponents: [ Transform, Material, Renderer ] })
    }

    Init(): void
    { 
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
            height: 2048,
            width: 2048,
            clear: [0,0,0,0]
        })
        this.plane = new StaticMesh(
        {
            position: [
                [-1, 1, 0.0],
                [-1,-1, 0.0],
                [ 1,-1, 0.0],
                [ 1, 1, 0.0],
            ],
            uv: [
                [0,1],
                [0,0],
                [1,0],
                [1,1],
            ],
            index: [0,1,2,0,2,3]
        })
        this.material = new Material({
            shader: new ShaderAsset(
            {
                vertexShader:
                {
                    source: `#version 300 es

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
                    input: [],
                },
                fragmentShader:
                {
                    source: `#version 300 es
                    
                    void main(void)
                    {
                        
                    }`,
                    input: [],
                }
            })
        })
        this.shader = new ShaderAsset(
        {
            vertexShader: {
                source: `#version 300 es

                layout(location = 0) in vec4 A_Position;
                layout(location = 2) in vec2 A_UV;
                layout(location = 3) in vec4 A_Colour;
        
                out vec2 V_UV;
                out vec4 V_Colour;
                
                void main(void)
                {                
                    V_UV = A_UV;
                    V_Colour = A_Colour;

                    gl_Position = A_Position;
                    gl_PointSize = 5.0;
                }`
            },
            fragmentShader: {
                source: `#version 300 es
        
                precision highp float;
                
                in vec2 V_UV;
                in vec4 V_Colour;
                
                layout(location = 0) out vec4 O_FragColour;            
                                    
                struct Material 
                {
                    vec4 Ambient;
                    vec4 Diffuse;
                    vec4 Specular;
                    float Shininess;
                    float Alpha;
        
                    bool HasImageMap;
                    bool HasBumpMap;
                };
                uniform Material U_Material;
                uniform vec4 U_My_Colour;
                struct Sampler
                {
                  sampler2D Image;
                };
                uniform Sampler U_Sampler;
                
                uniform sampler2D U_RenderImage;
                uniform sampler2D U_DepthImage;

                vec4 Colour()
                {
                    if (U_Material.HasImageMap)
                    {
                        return texture(U_RenderImage, V_UV);
                    }
                    else
                    {
                        return V_Colour;
                    }
                }
        
                void main(void)
                {
                    O_FragColour = U_My_Colour * Colour();
                }
                `,
            },
            inputs: [
                new ShaderInput(ShaderVec3, 'U_My_Colour'),
            ]
        })
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
        
        this.shadowRenderTarget.Bind()
        this.renderBatch(this._batch, this.projection, this.modelview)
        this.renderBatch(this._transparentBatch, this.projection, this.modelview, this.material)
        this.shadowRenderTarget.UnBind()

        this.renderTarget.Bind()
        this.renderBatch(this._batch, Camera.Main!.ProjectionMatrix, this._cameraModelViewMatrix)
        this.renderBatch(this._transparentBatch, Camera.Main!.ProjectionMatrix, this._cameraModelViewMatrix)
        this.renderTarget.UnBind()

        GL.bindFramebuffer(GL.FRAMEBUFFER, null)
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
        GL.clearColor(0, 0, 0, 0)
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)

        this.shader.Bind()
        this.shader.SetVector('U_My_Colour', [1,1,1,1])
        
        this.shader.SetInt('U_Material.HasImageMap', 1)
        GL.activeTexture(GL.TEXTURE0)
        GL.bindTexture(GL.TEXTURE_2D, this.renderTarget.ColourAttachments[0])
        this.shader.SetInt('U_RenderImage', 0)
        GL.activeTexture(GL.TEXTURE1)
        GL.bindTexture(GL.TEXTURE_2D, this.shadowRenderTarget.DepthAttachment)
        this.shader.SetInt('U_DepthImage', 1)

        GL.bindVertexArray(this.plane.VertexArrayBuffer)
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.plane.FaceBuffer)
        GL.drawElements(GL.TRIANGLES, this.plane.FaceCount, GL.UNSIGNED_BYTE, 0)
        GL.bindVertexArray(null)
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
                material.Shader.SetMatrix('U_LightSpaceMatrix', Matrix4.Multiply(this.projection, this.modelview))
                GL.activeTexture(GL.TEXTURE4)
                GL.bindTexture(GL.TEXTURE_2D, this.shadowRenderTarget.DepthAttachment)
                material.Shader.SetInt('U_ShadowMap', 4)
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

    i: number = 0
    private _bindShader(material: Material, projection: Matrix4, modelview: Matrix4)
    {
        const shader = material.Shader!
        GL.uniformMatrix4fv(shader.Matrices!.View, true, modelview)
        GL.uniformMatrix4fv(shader.Matrices!.Projection, true, projection)

        let point_count: number = 0
        for (let light of this._lights)
        {
            if (light instanceof PointLight)
            {
                GL.uniform4fv(shader.Lights![point_count].Colour, light.Colour)
                GL.uniform3fv(shader.Lights![point_count].Position, light.Owner!.GetComponent(Transform)!.GlobalPosition())
                GL.uniform1f(shader.Lights![point_count].Intensity, light.Intensity)
                GL.uniform1f(shader.Lights![point_count].Radius, light.Radius)

                // ++point_count
            }
            else if (light instanceof DirectionalLight)
            {
                GL.uniform4fv(shader.DirectionalLight!.Colour, light.Colour)
                GL.uniform3fv(shader.DirectionalLight!.Direction, light.Direction)
                GL.uniform1f(shader.DirectionalLight!.Intensity, light.Intensity)

                // ++point_count
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
