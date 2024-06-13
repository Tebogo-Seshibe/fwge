import { GL, Matrix3 } from "@fwge/common";
import { AreaLight, BasicLitMaterial, Camera, ColourType, DefaultWindow, DepthType, DirectionalLight, InstanceMesh, Light, Material, MeshRenderer, RenderMode, RenderPipelineMode, RenderPipelineStep, RenderTarget, RenderWindow, Renderer, Shader, Tag, Transform, type Mesh } from "@fwge/core";
import { Registry, System, type EntityId } from "@fwge/ecs";
import { EditorTag } from "../components/EditorTag";
import { finalPassShaderFrag, finalPassShaderVert } from "../assets/CubeShader";

export class ProjectRenderSystem extends System
{
    cameraView!: number;
    renderableView!: number;
    areaLightView!: number;
    directionalLightView!: number;
    finalPassShader!: Shader;
    window!: RenderWindow;

    Init(): void 
    {
        this.cameraView = Registry.RegisterView(
            [Camera, Transform],
            // entity => !entity.HasComponent(EditorTag)
        );

        this.renderableView = Registry.RegisterView(
            [Material, Renderer, Transform],
            entity => !entity.HasComponent(EditorTag)
        );

        this.areaLightView = Registry.RegisterView(
            [Light],
            (_, light) => light instanceof AreaLight
        );

        this.directionalLightView = Registry.RegisterView(
            [Light],
            (_, light) => light instanceof DirectionalLight
        );

        this.finalPassShader = new Shader(
            finalPassShaderVert,
            finalPassShaderFrag
        );

        console.log(this.finalPassShader)

        this.window = new DefaultWindow()
        // new RenderWindow({
        //     renderPipelineMode: RenderPipelineMode.DEFERRED,
        //     camera: Registry.GetComponent(Registry.GetView(this.cameraView)[0], Camera)!,
        //     offset: [0,0],
        //     scale: [1,1],
        //     resolution: [1920,1080],
        //     pipeline: undefined,
        //     mainPass: new RenderPipelineStep({
        //         name: 'MAIN_PASS',
        //         shader: null!,
        //         output: new RenderTarget({
        //             colour: [ColourType.FLOAT_RGB, ColourType.FLOAT_RGB, ColourType.FLOAT_RGB],
        //             depth: DepthType.FLOAT32,
        //             height: 1920,
        //             width: 1080,
        //             clear: [0,0,0,0]
        //         })
        //     })
        // })
        
        console.log(Registry.GetComponent(Registry.GetView(this.directionalLightView)[0], DirectionalLight)!);
    }

    Start(): void 
    {
        return;
    }

    Stop(): void
    {
        return;
    }

    Update(): void
    {
        GL.enable(GL.DEPTH_TEST);
        GL.enable(GL.CULL_FACE);
        GL.cullFace(GL.BACK);
        GL.depthMask(true);

        for (var entityId of Registry.GetView(this.directionalLightView))
        {
            this.renderShadows(entityId, Registry.GetComponent(entityId, DirectionalLight)!); 
        }
            
        this.window.MainPass.Output.Bind()
        this.renderScene(); 
        
        GL.bindFramebuffer(GL.FRAMEBUFFER, null);
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
        GL.clearColor(0, 0, 0, 0);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        this.finalPassShader.Bind()
        
        this.finalPassShader.SetTexture('U_Position', this.window.FinalComposite.ColourAttachments[0])
        this.finalPassShader.SetTexture('U_Normal', this.window.FinalComposite.ColourAttachments[1])
        this.finalPassShader.SetTexture('U_Albedo_Alpha', this.window.FinalComposite.ColourAttachments[2])
        this.finalPassShader.SetTexture('U_Depth', this.window.FinalComposite.DepthAttachment!)
        this.finalPassShader.SetTexture(`U_Dir_Tex`, Registry.GetComponent(Registry.GetView(this.directionalLightView)[0]!, DirectionalLight)!.RenderTarget.DepthAttachment!);

        let a = 0;
        for (var entityId of Registry.GetView(this.areaLightView))
        {
            const light = Registry.GetComponent(entityId, AreaLight)!;
            this.finalPassShader.SetFloatVector(`U_AreaLight[${a}].Colour`, light.Colour);
            this.finalPassShader.SetFloat(`U_AreaLight[${a}].Intensity`, light.Intensity);
            a++
        }

        let d = 0;
        for (var entityId of Registry.GetView(this.directionalLightView))
        {
            const light = Registry.GetComponent(entityId, DirectionalLight)!;
            const transform = Registry.GetComponent(entityId, Transform)!;
            const rotx = transform?.GlobalRotation().X ?? 0;
            const roty = transform?.GlobalRotation().Y ?? 0;
            const rotz = transform?.GlobalRotation().Z ?? 0;

            const direction = Matrix3.MultiplyVector(
                Matrix3.RotationMatrix(-rotx + 90, -roty, rotz),
                0,0,1
            ).Normalize()

            // light.BindBlock(this.finalPassShader, `U_DirectionalLight[${d}]`)
            
            this.finalPassShader.SetFloatVector(`U_DirectionalLight[${d}].Colour`, light.Colour);
            this.finalPassShader.SetFloat(`U_DirectionalLight[${d}].Intensity`, light.Intensity);

            this.finalPassShader.SetFloatVector(`U_DirectionalLight[${d}].Direction`, direction);
            this.finalPassShader.SetBool(`U_DirectionalLight[${d}].CastShadows`, light.CastShadows);

            this.finalPassShader.SetFloat(`U_DirectionalLight[${d}].TexelSize`, 1 / light.RenderTarget.Width);
            this.finalPassShader.SetFloat(`U_DirectionalLight[${d}].TexelCount`, ((light.PCFLevel * 2) + 1) ** 2);
            this.finalPassShader.SetFloat(`U_DirectionalLight[${d}].Bias`, light.Bias);
            this.finalPassShader.SetFloat(`U_DirectionalLight[${d}].PCFLevel`, light.PCFLevel);

            this.finalPassShader.SetMatrix(`U_DirectionalLight[${d}].ShadowMatrix`, light.ShadowMatrix);
            d++
        }
        
        GL.bindVertexArray(this.window.Panel.VertexArrayBuffer);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.window.Panel.FaceBuffer);
        GL.drawElements(GL.TRIANGLES, this.window.Panel.FaceCount, GL.UNSIGNED_BYTE, 0);
        GL.bindVertexArray(null);
        this.finalPassShader.UnBind()
    }

    private renderShadows(parentId: number, light: DirectionalLight)
    {
        // console.log(light)
        light.BindForShadows(parentId);

        
        for (const entityId of Registry.GetView(this.renderableView))
        {
            if (!Registry.IsEntityActive(entityId))
            {
                continue;
            }

            const tag = Registry.GetComponent(entityId, Tag);
            if (tag instanceof EditorTag)
            {
                continue;
            }
            
            const material = Registry.GetComponent(entityId, BasicLitMaterial)!;
            if (!material.ProjectsShadows)
            {
                continue;
            }

            const transform = Registry.GetComponent(entityId, Transform)!;
            const renderer = Registry.GetComponent(entityId, MeshRenderer)!;

            const mesh = renderer.Asset!;
            
            let renderMode: number;
            let renderCount: number;
            let buffer: WebGLBuffer | null;

            switch (renderer.RenderMode)
            {
                case RenderMode.FACE:
                    {
                        renderMode = GL.TRIANGLES;
                        renderCount = mesh.FaceCount;
                        buffer = mesh.IsIndexed ? mesh.FaceBuffer : null;
                    }
                    break;

                case RenderMode.EDGE:
                    {
                        renderMode = GL.LINES;
                        renderCount = mesh.EdgeCount;
                        buffer = mesh.IsIndexed ? mesh.EdgeBuffer : null;
                    }
                    break;

                case RenderMode.POINT:
                    {
                        renderMode = GL.POINTS;
                        renderCount = mesh.PointCount;
                        buffer = mesh.IsIndexed ? mesh.PointBuffer : null;
                    }
                    break;
            }

            if (mesh instanceof InstanceMesh)
            {
                this.drawInstanceMesh(entityId, mesh, transform, null, buffer, renderMode, renderCount);
            }
            else
            {
                this.drawMesh(entityId, mesh, transform, null, buffer, renderMode, renderCount);
            }
        }
        
        light.UnbindForShadows();
    }

    private renderScene()
    {
        const cameraEntityId = Registry.GetView(this.cameraView)[0];
        const cameraTransform = Registry.GetComponent(cameraEntityId, Transform)!;
        const cameraCamera = Registry.GetComponent(cameraEntityId, Camera)!;

        const cameraMV = cameraTransform.GlobalModelViewMatrix(cameraEntityId);
        const cameraMVInverse = cameraMV.Inverse();

        for (const entityId of Registry.GetView(this.renderableView))
        {
            if (!Registry.IsEntityActive(entityId))
            {
                continue;
            }

            const tag = Registry.GetComponent(entityId, Tag);
            if (tag instanceof EditorTag)
            {
                continue;
            }

            const transform = Registry.GetComponent(entityId, Transform)!;
            const material = Registry.GetComponent(entityId, BasicLitMaterial)!;
            const renderer = Registry.GetComponent(entityId, MeshRenderer)!;

            const mesh = renderer.Asset!;
            const shader = material.Shader!;

            shader.Bind();

            shader.SetBufferDataField('Camera', 'ViewMatrix', cameraMVInverse, true);
            shader.SetBufferDataField('Camera', 'ProjectionMatrix', cameraCamera.ProjectionMatrix, true);
            shader.PushBufferData('Camera');

            material.BindBlock(shader)
            
            let renderMode: number;
            let renderCount: number;
            let buffer: WebGLBuffer | null;

            switch (renderer.RenderMode)
            {
                case RenderMode.FACE:
                    {
                        renderMode = GL.TRIANGLES;
                        renderCount = mesh.FaceCount;
                        buffer = mesh.IsIndexed ? mesh.FaceBuffer : null;
                    }
                    break;

                case RenderMode.EDGE:
                    {
                        renderMode = GL.LINES;
                        renderCount = mesh.EdgeCount;
                        buffer = mesh.IsIndexed ? mesh.EdgeBuffer : null;
                    }
                    break;

                case RenderMode.POINT:
                    {
                        renderMode = GL.POINTS;
                        renderCount = mesh.PointCount;
                        buffer = mesh.IsIndexed ? mesh.PointBuffer : null;
                    }
                    break;
            }

            if (mesh instanceof InstanceMesh)
            {
                this.drawInstanceMesh(entityId, mesh, transform, shader, buffer, renderMode, renderCount);
            }

            else
            {
                this.drawMesh(entityId, mesh, transform, shader, buffer, renderMode, renderCount);
            }

            shader.UnBind();
        }
    }

    private drawInstanceMesh(entityId: EntityId, mesh: InstanceMesh, transform: Transform, shader: Shader | null, buffer: WebGLBuffer | null, renderMode: number, renderCount: number)
    {
        GL.bindVertexArray(mesh.VertexArrayBuffer);
        const modelViewMatrix = transform.GlobalModelViewMatrix(entityId);


        shader?.SetBufferDataField('Object', 'ModelViewMatrix', modelViewMatrix, true);
        shader?.SetBufferDataField('Object', 'NormalMatrix', Matrix3.Inverse(modelViewMatrix.Matrix3));
        shader?.PushBufferData('Object');

        if (buffer)
        {
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer);
            GL.drawElementsInstanced(renderMode, renderCount, GL.UNSIGNED_BYTE, 0, mesh.InstanceCount);
        }
        else
        {
            GL.drawArraysInstanced(renderMode, 0, renderCount, mesh.InstanceCount);
        }

        GL.bindVertexArray(null);
    }
    
    private drawMesh(entityId: EntityId, mesh: Mesh, transform: Transform, shader: Shader | null, buffer: WebGLBuffer | null, renderMode: number, renderCount: number)
    {
        GL.bindVertexArray(mesh.VertexArrayBuffer);
        const modelViewMatrix = transform.GlobalModelViewMatrix(entityId);


        shader?.SetBufferDataField('Object', 'ModelViewMatrix', modelViewMatrix, true);
        shader?.SetBufferDataField('Object', 'NormalMatrix', Matrix3.Inverse(modelViewMatrix.Matrix3));
        shader?.PushBufferData('Object');

        if (buffer)
        {
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer);
            GL.drawElements(renderMode, renderCount, GL.UNSIGNED_BYTE, 0);
        }

        else
        {
            GL.drawArrays(renderMode, 0, renderCount);
        }

        GL.bindVertexArray(null);
    }
}
