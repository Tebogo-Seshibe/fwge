import { GL, Matrix3, Matrix4 } from "@fwge/common"
import { ColourType, DepthType, RenderTarget, RenderWindow, Scene, Shader } from "../base"
import { DirectionalLight, Material, PointLight, Renderer, RenderMode, RenderType, StaticMesh, Transform } from "../components"
import { Light } from "../components/lights/Light"
import { Entity, getComponent, System } from "../ecs"

export class RenderSystem extends System
{
    private _cameraModelViewMatrix: Matrix4 = Matrix4.Identity
    private _lights: Set<Light> = new Set()
    private _transparentBatch: Map<number, Map<number, Set<number>>> = new Map()
    private _batch: Map<number, Map<number, Set<number>>> = new Map()
    private _modelViewMatrices: Map<number, Matrix4> = new Map()
    private _normalMatrices: Map<number, Matrix3> = new Map()
    private _lightMatrices: Map<number, Matrix4> = new Map()

    windows: Window[] = []
    defaultRenderTarget!: RenderTarget
    renderTarget!: RenderTarget
    shadowRenderTarget!: RenderTarget
    plane!: StaticMesh
    shadowRenderer!: Material
    shader: Shader = new Shader(
        `#version 300 es
        #pragma vscode_glsllint_stage: vert

        layout(location = 0) in vec2 A_Position;

        uniform vec2 U_PanelOffset;
        uniform vec2 U_PanelScale;
        
        out vec2 V_UV;

        void main(void)
        {
            V_UV = A_Position * 0.5 + 0.5;
            gl_Position = vec4((A_Position * U_PanelScale) + U_PanelOffset, 0.0, 1.0);
        }`,

        `#version 300 es
        #pragma vscode_glsllint_stage: frag

        precision highp float;

        in vec2 V_UV;
        layout(location = 0) out vec4 O_FragColour;

        uniform sampler2D U_RenderImage;

        void main(void)
        {
            O_FragColour = texture(U_RenderImage, V_UV);
        }`
    )
    
    // projection = Matrix4.OrthographicProjectionMatrix(-50, 50, 50)
    projection = Matrix4.OrthographicProjection(
        [-65, -65, -65],
        [ 65,  65,  65],
        [ 90, 90]
    ).Transpose()
    modelview = Matrix4.TransformationMatrix(
        [   0,   0,   0],
        [  90,   0,   0],
        [   1,   1,   1]
    ).Inverse()
    
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
            colour: [ ColourType.UINT_RGBA, ColourType.UINT_RGBA ],
            depth: DepthType.INT24,
            height: 1080,
            width: 1920,
            clear: [0,0,0,0]
        })

        this.shadowRenderTarget = new RenderTarget(
        {
            colour: [],
            depth: DepthType.FLOAT32,
            height: 2**14,
            width: 2**14,
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

        this.shadowRenderer = new Material(
            new Shader(
                `#version 300 es
                #pragma vscode_glsllint_stage: vert

                layout(location = 0) in vec3 A_Position;

                struct Matrix
                {
                    mat4 ModelView;
                    mat4 View;
                    mat4 Projection;
                };
                uniform Matrix U_Matrix;
                
                void main(void)
                {
                    gl_Position = U_Matrix.Projection * U_Matrix.View * U_Matrix.ModelView * vec4(A_Position, 1.0);
                }`,

                `#version 300 es
                #pragma vscode_glsllint_stage: frag

                void main(void)
                {
                    
                }`
            ),
            RenderType.OPAQUE
        )

    }

    Start(): void { }
    Stop(): void { }    

    Update(_: number): void
    {
        for (const window of this.Scene.Windows)
        {
            const projection = window.Camera.ProjectionMatrix
            const modelview = window.Camera.Owner?.GetComponent(Transform)?.ModelViewMatrix().Inverse() ?? Matrix4.Identity
            
            window.MainPass.Output.Bind()
            this.renderBatch(this._batch, projection, modelview)
            this.renderBatch(this._transparentBatch, projection, modelview)
            window.MainPass.Output.UnBind()

            for (const step of window.RenderPipeline)
            {
                step.Output.Bind()
                step.Shader!.Bind()

                for (const inputName of step.Input)
                {
                    if (!window.RenderPipelineMap.has(inputName))
                    {
                        continue
                    }
                    
                    const inputIndex = window.RenderPipelineMap.get(inputName)!
                    const input = inputIndex === -1
                        ? window.MainPass 
                        : window.RenderPipeline[inputIndex]
                    
                    for (let outputIndex = 0; outputIndex < input.Output.ColourAttachments.length; ++outputIndex)
                    {
                        step.Shader!.SetTexture(`U_${inputName}_Colour[${outputIndex}]`, input.Output.ColourAttachments[outputIndex]!)
                    }
                    step.Shader!.SetTexture(`U_${inputName}_Depth`, input.Output.DepthAttachment!)
                }

                step.Shader!.SetFloat('U_Width', step.Output.Width)
                step.Shader!.SetFloat('U_Height', step.Output.Height)

                GL.bindVertexArray(window.Panel.VertexArrayBuffer)
                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, window.Panel.FaceBuffer)
                GL.drawElements(GL.TRIANGLES, window.Panel.FaceCount, GL.UNSIGNED_BYTE, 0)
                GL.bindVertexArray(null)
                
                step.Shader!.UnBind()
                step.Output.UnBind()
            }
        }
            
        GL.enable(GL.DEPTH_TEST)
        GL.enable(GL.CULL_FACE)
        GL.depthMask(true)

        GL.bindFramebuffer(GL.FRAMEBUFFER, null)
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
        GL.clearColor(0,0,0,0)
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT | GL.STENCIL_BUFFER_BIT)

        this.shader.Bind()
        for (let i = this.Scene.Windows.length - 1; i >= 0; --i)
        {
            const window = this.Scene.Windows[i]

            this.shader.SetTexture(`U_RenderImage`, window.FinalComposite.ColourAttachments.first())
            this.shader.SetFloatVector('U_PanelOffset', window.Offset)
            this.shader.SetFloatVector('U_PanelScale', window.Scale)
            
            GL.bindVertexArray(window.Panel.VertexArrayBuffer)
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, window.Panel.FaceBuffer)
            GL.drawElements(GL.TRIANGLES, window.Panel.FaceCount, GL.UNSIGNED_BYTE, 0)
            GL.bindVertexArray(null)
        }
        this.shader.UnBind()
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
                material.Shader.SetTexture('U_Sampler.ShadowMap', this.shadowRenderTarget.DepthAttachment!)
            }

            for (const [rendererId, transforms] of renderers)
            {
                const renderer = getComponent(Renderer, rendererId)
                const mesh = renderer.Asset!
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
                    
                    material.Shader.SetMatrix('U_Matrix.ModelView', modelView, true)
                    material.Shader.SetMatrix('U_Matrix.Normal', normal, true)
                    
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

    private forwardRenderPipeline(window: RenderWindow)
    {
        
    }

    private deferredRenderPipeline(window: RenderWindow)
    {

    }

    private _bindShader(material: Material, projection: Matrix4, modelview: Matrix4): void
    {
        const shader = material.Shader!
        shader.SetMatrix('U_Matrix.View', modelview, true)
        shader.SetMatrix('U_Matrix.Projection', projection, true)

        let point_count: number = 0
        let directional_count: number = 0
        for (let light of this._lights)
        {
            if (light instanceof PointLight)
            {
                light.Bind(shader, point_count++)
            }
            else if (light instanceof DirectionalLight)
            {
                light.Bind(shader, directional_count++)
            }
            else
            {
                light.Bind(shader)
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
            const renderer = entity.GetComponent(Renderer)!
            const transform = entity.GetComponent(Transform)!

            const materialMap = (material.RenderType === RenderType.TRANSPARENT ? this._transparentBatch : this._batch) ?? new Map<number, Map<number, Set<number>>>()
            const meshMap = materialMap.get(material.Id) ?? new Map<number, Set<number>>()
            const transformSet = meshMap.get(renderer.Id) ?? new Set<number>()

            meshMap.set(renderer.Id, new Set([...transformSet, transform.Id]))
            materialMap.set(material.Id, meshMap)
            if (material.RenderType === RenderType.TRANSPARENT)
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
