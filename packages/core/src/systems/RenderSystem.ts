import { System } from "@fwge/ecs";

export class RenderSystem extends System {
    Init(): void {
        throw new Error("Method not implemented.");
    }
    Start(): void {
        throw new Error("Method not implemented.");
    }
    Update(delta: number): void {
        throw new Error("Method not implemented.");
    }
    Stop(): void {
        throw new Error("Method not implemented.");
    }
    // private _transparentObjects = Symbol();
    // private _opaqueObjects = Symbol();
    
    // private _allLights = Symbol();
    // private _pointLights = Symbol();
    // private _directionalLights = Symbol();
    // private _areaLights = Symbol();

    // private _lights: Light[] = []
    // private _transparentBatch: Map<number, Map<number, Set<number>>> = new Map()
    // private _batch: Map<number, Map<number, Set<number>>> = new Map()
    // private _modelViewMatrices: Map<number, Matrix4> = new Map()
    // private _normalMatrices: Map<number, Matrix3> = new Map()

    // windows: Window[] = []
    // shader: Shader = new Shader(
    //     `#version 300 es
    //     #pragma vscode_glsllint_stage: vert

    //     layout(location = 0) in vec2 A_Position;

    //     uniform vec2 U_PanelOffset;
    //     uniform vec2 U_PanelScale;
        
    //     out vec2 V_UV;

    //     void main(void)
    //     {
    //         V_UV = A_Position * 0.5 + 0.5;
    //         gl_Position = vec4((A_Position * U_PanelScale) + U_PanelOffset, 0.0, 1.0);
    //     }`,

    //     `#version 300 es
    //     #pragma vscode_glsllint_stage: frag

    //     precision highp float;

    //     in vec2 V_UV;
    //     layout(location = 0) out vec4 O_FragColour;

    //     uniform sampler2D U_RenderImage;

    //     void main(void)
    //     {
    //         O_FragColour = texture(U_RenderImage, V_UV);
    //     }`
    // )
    
    // Init(): void
    // {
    //     Registry.registerView(this._allLights, [Light]);
    //     Registry.registerView(
    //         this._opaqueObjects, 
    //         [Transform, Material, Renderer],
    //         [
    //             (_0, mat, _2) => mat.RenderType === RenderType.OPAQUE
    //         ]
    //     );
    //     Registry.registerView(
    //         this._transparentObjects, 
    //         [Transform, Material, Renderer],
    //         [
    //             (_0, mat, _2) => mat.RenderType === RenderType.TRANSPARENT
    //         ]
    //     );
        
    //     this._lights = Registry.getView(this._allLights).map(entityId => Registry.getComponent(entityId, Light)!);
    //     this._batch = this._createBatch(Registry.getView(this._opaqueObjects))
    //     this._transparentBatch = this._createBatch(Registry.getView(this._transparentObjects))
    // }

    // private _createBatch(entities: readonly EntityId[]): Map<number, Map<number, Set<number>>>
    // {
    //     const map = new Map<number, Map<number, Set<number>>>()

    //     for (const entityId of entities)
    //     {
    //         const material = Registry.getComponent(entityId, Material)!
    //         const renderer = Registry.getComponent(entityId, Renderer)!
    //         const transform = Registry.getComponent(entityId, Transform)!

    //         const rendererMap = map.get(material.Id) ?? new Map<number, Set<number>>()
    //         const transformSet = rendererMap.get(renderer.Id) ?? new Set<number>()

    //         rendererMap.set(renderer.Id, new Set([...transformSet, transform.Id]))
    //         map.set(material.Id, rendererMap)
            
    //         this._modelViewMatrices.set(transform.Id, Matrix4.Identity)
    //         this._normalMatrices.set(transform.Id, Matrix3.Identity)
    //     }

    //     return map
    // }

    // Start(): void { }
    // Stop(): void { }    

    // Update(_: number): void
    // {
    //     GL.enable(GL.DEPTH_TEST)
    //     GL.enable(GL.CULL_FACE)
    //     GL.depthMask(true)

    //     for (const window of this.Scene.Windows)
    //     {
    //         this.createShadowMaps(window.Camera)

    //         window.MainPass.Output.Bind()
    //         // this.renderBatch(this._batch, window.Camera)
    //         // this.renderBatch(this._transparentBatch, window.Camera)
    //         // this.renderSkybox(window.Camera)

    //         for (const step of window.RenderPipeline)
    //         {
    //             step.Output.Bind()
    //             step.Shader!.Bind()

    //             for (const inputName of step.Input)
    //             {
    //                 if (!window.RenderPipelineMap.has(inputName))
    //                 {
    //                     continue
    //                 }
                    
    //                 const inputIndex = window.RenderPipelineMap.get(inputName)!
    //                 const input = inputIndex === -1
    //                     ? window.MainPass 
    //                     : window.RenderPipeline[inputIndex]
                    
    //                 for (let outputIndex = 0; outputIndex < input.Output.ColourAttachments.length; ++outputIndex)
    //                 {
    //                     step.Shader!.SetTexture(`U_${inputName}_Colour[${outputIndex}]`, input.Output.ColourAttachments[outputIndex]!)
    //                 }
    //                 step.Shader!.SetTexture(`U_${inputName}_Depth`, input.Output.DepthAttachment!)
    //             }

    //             step.Shader!.SetFloat('U_Width', step.Output.Width)
    //             step.Shader!.SetFloat('U_Height', step.Output.Height)

    //             GL.bindVertexArray(window.Panel.VertexArrayBuffer)
    //             GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, window.Panel.FaceBuffer)
    //             GL.drawElements(GL.TRIANGLES, window.Panel.FaceCount, GL.UNSIGNED_BYTE, 0)
    //             GL.bindVertexArray(null)
    //         }
    //     }            

    //     GL.bindFramebuffer(GL.FRAMEBUFFER, null)
    //     GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
    //     GL.clearColor(0, 0, 0, 0)
    //     GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT | GL.STENCIL_BUFFER_BIT)

    //     this.shader.Bind()
    //     for (let i = this.Scene.Windows.length - 1; i >= 0; --i)
    //     {
    //         const window = this.Scene.Windows[i]

    //         this.shader.SetTexture(`U_RenderImage`, window.FinalComposite.ColourAttachments.first)
    //         this.shader.SetFloatVector('U_PanelOffset', window.Offset)
    //         this.shader.SetFloatVector('U_PanelScale', window.Scale)

    //         // const dir = [...this._lights].filter(x => x instanceof DirectionalLight).first as DirectionalLight
    //         // this.shader.SetTexture(`U_RenderImage`, dir.RenderTarget.DepthAttachment!)
    //         // this.shader.SetFloatVector('U_PanelOffset', 0, 0)
    //         // this.shader.SetFloatVector('U_PanelScale', 1, 1)
                
    //         GL.bindVertexArray(window.Panel.VertexArrayBuffer)
    //         GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, window.Panel.FaceBuffer)
    //         GL.drawElements(GL.TRIANGLES, window.Panel.FaceCount, GL.UNSIGNED_BYTE, 0)
    //         GL.bindVertexArray(null)
    //     }
    //     this.shader.UnBind()
    // }
    
    // createShadowMaps(camera: Camera)
    // {
    //     for (let light of this._lights)
    //     {
    //         if (light instanceof PointLight)
    //         {
    //             if (!light.CastShadows)
    //             {
    //                 continue
    //             }
    //         }
    //         else if (light instanceof DirectionalLight)
    //         {
    //             if (!light.CastShadows)
    //             {
    //                 continue
    //             }
                
    //             light.BindForShadows() //camera.Owner?.GetComponent(Transform)?.GlobalPosition())
    //             // this.renderBatchShadows(this._batch, DirectionalLight.ShadowShader)
    //             // this.renderBatchShadows(this._transparentBatch, DirectionalLight.ShadowShader)
    //             light.UnbindForShadows()
    //         }
    //     }
    // }

    // renderSkybox(camera: Camera)
    // {
    //     const projection = camera.ProjectionMatrix
    //     const modelview = camera.Owner?.GetComponent(Transform)?.ModelViewMatrix().Inverse() ?? Matrix4.Identity

    //     GL.enable(GL.DEPTH_TEST)
    //     GL.enable(GL.CULL_FACE)
    //     GL.cullFace(GL.FRONT)
    //     GL.depthFunc(GL.LEQUAL)

    //     for (const light of this._lights)
    //     {
    //         if (!(light instanceof AreaLight) || !light.Skybox)
    //         {
    //             continue
    //         }            
            
    //         const view = Matrix4.Multiply(modelview, Matrix4.RotationMatrix(0, 0, 180))
    //         view[3] = 0
    //         view[7] = 0
    //         view[11] = 0

    //         light.SkyboxShader.Bind()
    //         light.SkyboxShader.SetMatrix('U_Matrix.View', view, true)
    //         light.SkyboxShader.SetMatrix('U_Matrix.Projection', projection, true)
    //         light.SkyboxShader.SetTexture('U_Skybox', light.Skybox.Texture, false, true)

    //         GL.bindVertexArray(light.SkyboxMesh.VertexArrayBuffer)
    //         GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, light.SkyboxMesh.FaceBuffer)
    //         GL.drawElements(GL.TRIANGLES, light.SkyboxMesh.FaceCount, GL.UNSIGNED_BYTE, 0)
    //         GL.bindVertexArray(null)

    //         light.SkyboxShader.UnBind()
    //     }

    //     GL.depthFunc(GL.LESS)
    //     GL.cullFace(GL.BACK)
    // }
    
    // renderBatch(batch: Map<number, Map<number, Set<number>>>, camera: Camera)
    // {
    //     const projection = camera.ProjectionMatrix
    //     const modelview = camera.Owner?.GetComponent(Transform)?.ModelViewMatrix().Inverse() ?? Matrix4.Identity

    //     for (const [materialId, renderers] of batch)
    //     {
    //         const material = getComponentById(Material, materialId)!
    //         if (!material.Shader)
    //         {
    //             continue
    //         }

    //         material.Bind()
    //         this._bindShader(material.Shader, projection, modelview, camera)

    //         for (const [rendererId, transforms] of renderers)
    //         {
    //             const renderer = getComponentById(Renderer, rendererId)!
    //             const mesh = renderer.Asset!
    //             let mode = -1
    //             let count = 0
    //             let buffer = null
                
    //             switch (renderer.RenderMode)
    //             {
    //                 case RenderMode.FACE:
    //                 {
    //                     mode = GL.TRIANGLES
    //                     count = mesh.FaceCount

    //                     if (mesh.IsIndexed)
    //                     {
    //                         buffer = mesh.FaceBuffer
    //                     }
    //                 }
    //                 break

    //                 case RenderMode.EDGE:
    //                 {
    //                     mode = GL.LINES
    //                     count = mesh.EdgeCount

    //                     if (mesh.IsIndexed)
    //                     {
    //                         buffer = mesh.EdgeBuffer
    //                         mode = GL.LINES
    //                     }
    //                 }
    //                 break

    //                 case RenderMode.POINT:
    //                 {
    //                     mode = GL.POINTS
    //                     count = mesh.PointCount

    //                     if (mesh.IsIndexed)
    //                     {
    //                         buffer = mesh.PointBuffer
    //                     }
    //                 }
    //                 break
    //             }

    //             GL.bindVertexArray(mesh.VertexArrayBuffer)
    //             for (const transformId of transforms)
    //             {
    //                 const transform = getComponentById(Transform, transformId)!
    //                 const modelView = this._modelViewMatrices.get(transformId)!
    //                 const normal = this._normalMatrices.get(transformId)!

    //                 transform.ModelViewMatrix(modelView)
    //                 Matrix3.Inverse(modelView.Matrix3.Transpose(), normal)
                    
    //                 material.Shader.SetMatrix('U_Matrix.ModelView', modelView, true)
    //                 material.Shader.SetMatrix('U_Matrix.Normal', normal, true)
                    
    //                 if (buffer)
    //                 {
    //                     GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer)
    //                     GL.drawElements(mode, count, GL.UNSIGNED_BYTE, 0)
    //                 }
    //                 else
    //                 {
    //                     GL.drawArrays(mode, 0, count)
    //                 }
    //             }
    //             GL.bindVertexArray(null)
    //         }
    //         material.UnBind()
    //     }
    // }

    // renderBatchShadows(batch: Map<number, Map<number, Set<number>>>, shader: Shader)
    // {
    //     for (const [materialId, renderers] of batch)
    //     {
    //         const material = getComponentById(Material, materialId)!
    //         if (!material.ProjectsShadows)
    //         {
    //             continue
    //         }
            
    //         for (const [rendererId, transforms] of renderers)
    //         {
    //             const renderer = getComponentById(Renderer, rendererId)!
    //             const mesh = renderer.Asset!
    //             let mode = -1
    //             let count = 0
    //             let buffer = null
                
    //             switch (renderer.RenderMode)
    //             {
    //                 case RenderMode.FACE:
    //                 {
    //                     mode = GL.TRIANGLES
    //                     count = mesh.FaceCount

    //                     if (mesh.IsIndexed)
    //                     {
    //                         buffer = mesh.FaceBuffer
    //                     }
    //                 }
    //                 break

    //                 case RenderMode.EDGE:
    //                 {
    //                     mode = GL.LINES
    //                     count = mesh.EdgeCount

    //                     if (mesh.IsIndexed)
    //                     {
    //                         buffer = mesh.EdgeBuffer
    //                         mode = GL.LINES
    //                     }
    //                 }
    //                 break

    //                 case RenderMode.POINT:
    //                 {
    //                     mode = GL.POINTS
    //                     count = mesh.PointCount

    //                     if (mesh.IsIndexed)
    //                     {
    //                         buffer = mesh.PointBuffer
    //                     }
    //                 }
    //                 break
    //             }

    //             GL.bindVertexArray(mesh.VertexArrayBuffer)
    //             for (const transformId of transforms)
    //             {
    //                 const transform = getComponentById(Transform, transformId)!
    //                 const modelView = this._modelViewMatrices.get(transformId)!
    //                 const normal = this._normalMatrices.get(transformId)!

    //                 transform.ModelViewMatrix(modelView)
    //                 Matrix3.Inverse(modelView.Matrix3.Transpose(), normal)
                    
    //                 shader.SetMatrix('U_Matrix.ModelView', modelView, true)
    //                 shader.SetMatrix('U_Matrix.Normal', normal, true)
                    
    //                 if (buffer)
    //                 {
    //                     GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer)
    //                     GL.drawElements(mode, count, GL.UNSIGNED_BYTE, 0)
    //                 }
    //                 else
    //                 {
    //                     GL.drawArrays(mode, 0, count)
    //                 }
    //             }
    //             GL.bindVertexArray(null)
    //         }
    //     }
    // }

    // private _bindShader(shader: Shader, projection: Matrix4, modelview: Matrix4, camera: Camera, useLighting: boolean = true): void
    // {
    //     shader.Bind()
    //     shader.SetMatrix('U_Matrix.View', modelview, true)
    //     shader.SetMatrix('U_Matrix.Projection', projection, true)

    //     if (!useLighting)
    //     {
    //         return
    //     }

    //     let point_count: number = 0
    //     for (let light of this._lights)
    //     {
    //         if (light instanceof PointLight)
    //         {
    //             light.Bind(shader, point_count++)
    //         }
    //         else
    //         {
    //             light.Bind(shader, camera)
    //         }
    //     }
    // }
}
