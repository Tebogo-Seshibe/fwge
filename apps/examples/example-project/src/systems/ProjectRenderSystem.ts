import { GL, Matrix3, Matrix4, type Vector4Array } from "@fwge/common";
import { AreaLight, BasicLitMaterial, Camera, DirectionalLight, EntityId, InstanceMesh, Light, Material, MeshRenderer, RenderMode, RenderWindow, Renderer, Shader, System, Tag, Transform, type Mesh } from "@fwge/core";
import { FinalPassShader } from "../assets/FinalPassShader";
import { EditorTag } from "../components/EditorTag";

export class ProjectRenderSystem extends System
{
    cameraView!: number;
    renderableView!: number;
    renderableShadowView!: number;
    areaLightView!: number;
    directionalLightView!: number;
    
    finalPassShader!: Shader;
    window!: RenderWindow;

    Init(): void 
    {
        this.cameraView = this.Game.RegisterView(
            [Camera, Transform],
            // entity => !entity.HasComponent(EditorTag)
        );

        this.renderableView = this.Game.RegisterView(
            [Material, Renderer, Transform],
            entity => !entity.HasComponent(EditorTag)
        );
        
        this.renderableShadowView = this.Game.RegisterView(
            [Material, Renderer, Transform],
            (_, material) => material.ProjectsShadows
        );

        this.areaLightView = this.Game.RegisterView(
            [Light],
            (_, light) => light instanceof AreaLight
        );

        this.directionalLightView = this.Game.RegisterView(
            [Light],
            (_, light) => light instanceof DirectionalLight
        );

        this.finalPassShader = new FinalPassShader();
        this.finalPassShader.Init(this.Game.GL);

        this.window = this.Game.CurrentScene!.Windows[0];
        this.window.Panel.Load(this.Game);
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
        GL.depthMask(true);
        
        GL.cullFace(GL.FRONT);
        for (var entityId of this.Game.GetView(this.directionalLightView))
        {
            this.renderShadows(entityId, this.Game.GetComponent(entityId, DirectionalLight)!); 
        }
        GL.cullFace(GL.BACK);
            
        this.renderScene(this.window);
        
        GL.bindFramebuffer(GL.FRAMEBUFFER, null);
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
        GL.clearColor(0, 0, 0, 0);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        this.finalPassShader.Bind(this.Game.GL)
        
        this.finalPassShader.SetTexture(this.Game.GL, 'U_Position', this.window.FinalComposite.ColourAttachments[0])
        this.finalPassShader.SetTexture(this.Game.GL, 'U_Normal', this.window.FinalComposite.ColourAttachments[1])
        this.finalPassShader.SetTexture(this.Game.GL, 'U_Albedo_Alpha', this.window.FinalComposite.ColourAttachments[2])
        this.finalPassShader.SetTexture(this.Game.GL, 'U_Depth', this.window.FinalComposite.DepthAttachment!)
        this.finalPassShader.SetTexture(this.Game.GL, `U_Dir_Tex`, this.Game.GetComponent(this.Game.GetView(this.directionalLightView)[0]!, DirectionalLight)!.RenderTarget.DepthAttachment!);

        let a = 0;
        for (var entityId of this.Game.GetView(this.areaLightView))
        {
            const light = this.Game.GetComponent(entityId, AreaLight)!;
            this.finalPassShader.SetFloatVector(this.Game.GL, `U_AreaLight[${a}].Colour`, light.Colour);
            this.finalPassShader.SetFloat(this.Game.GL, `U_AreaLight[${a}].Intensity`, light.Intensity);
            a++
        }

        let d = 0;
        for (var entityId of this.Game.GetView(this.directionalLightView))
        {
            const light = this.Game.GetComponent(entityId, DirectionalLight)!;
            const transform = this.Game.GetComponent(entityId, Transform)!;
            const rotation = transform.GlobalRotation(entityId);
            const rotationMatrix = Matrix4.RotationMatrix(rotation.X / 2, rotation.Y, rotation.Z);
            const direction = Matrix4.MultiplyVector(
                rotationMatrix,
                [...DirectionalLight.DefaultDirection, 1.0] as Vector4Array
            );
            
            this.finalPassShader.SetFloatVector(this.Game.GL, `U_DirectionalLight[${d}].Colour`, light.Colour);
            this.finalPassShader.SetFloat(this.Game.GL, `U_DirectionalLight[${d}].Intensity`, light.Intensity);

            this.finalPassShader.SetFloatVector(this.Game.GL, `U_DirectionalLight[${d}].Direction`, direction.XYZ.Negate());
            this.finalPassShader.SetBool(this.Game.GL, `U_DirectionalLight[${d}].CastShadows`, light.CastShadows);

            this.finalPassShader.SetFloat(this.Game.GL, `U_DirectionalLight[${d}].TexelSize`, 1 / light.RenderTarget.Width);
            this.finalPassShader.SetFloat(this.Game.GL, `U_DirectionalLight[${d}].TexelCount`, ((light.PCFLevel * 2) + 1) ** 2);
            this.finalPassShader.SetFloat(this.Game.GL, `U_DirectionalLight[${d}].Bias`, light.Bias);
            this.finalPassShader.SetFloat(this.Game.GL, `U_DirectionalLight[${d}].PCFLevel`, light.PCFLevel);

            this.finalPassShader.SetMatrix(this.Game.GL, `U_DirectionalLight[${d}].ProjectionMatrix`, light.ProjectionMatrix, true);
            this.finalPassShader.SetMatrix(this.Game.GL, `U_DirectionalLight[${d}].ViewMatrix`, rotationMatrix, true);
            d++
        }
        
        const cameraEntityId = this.Game.GetView(this.cameraView)[0];
        const cameraTransform = this.Game.GetComponent(cameraEntityId, Transform)!;
        const cameraCamera = this.Game.GetComponent(cameraEntityId, Camera)!;
        const cameraMV = cameraTransform.GlobalModelViewMatrix(cameraEntityId).Inverse();

        
        this.finalPassShader.SetBufferDataField(this.Game.GL, 'Camera', 'View', cameraMV, true);
        this.finalPassShader.SetBufferDataField(this.Game.GL, 'Camera', 'Projection', cameraCamera.ProjectionMatrix, true);
        this.finalPassShader.PushBufferData(this.Game.GL, 'Camera');
        
        GL.bindVertexArray(this.window.Panel.VertexArrayBuffer);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.window.Panel.FaceBuffer);
        GL.drawElements(GL.TRIANGLES, this.window.Panel.FaceCount, GL.UNSIGNED_BYTE, 0);
        GL.bindVertexArray(null);
        this.finalPassShader.UnBind(this.Game.GL)
    }

    private renderShadows(parentId: number, light: DirectionalLight)
    {
        light.BindForShadows(parentId);

        
        for (const entityId of this.Game.GetView(this.renderableView))
        {
            if (!this.Game.IsEntityActive(entityId))
            {
                continue;
            }

            const tag = this.Game.GetComponent(entityId, Tag);
            if (tag instanceof EditorTag)
            {
                continue;
            }
            
            const material = this.Game.GetComponent(entityId, BasicLitMaterial)!;
            if (!material.ProjectsShadows)
            {
                continue;
            }

            const transform = this.Game.GetComponent(entityId, Transform)!;
            const renderer = this.Game.GetComponent(entityId, MeshRenderer)!;

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
            
            DirectionalLight.ShadowShader.SetMatrix(this.Game.GL, 'U_Transform.ModelView', transform.GlobalModelViewMatrix(entityId), true)
            
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

    private renderScene(window: RenderWindow)
    {
        window.MainPass.Output.Bind()
        
        const cameraEntityId = this.Game.GetView(this.cameraView)[0];
        const cameraTransform = this.Game.GetComponent(cameraEntityId, Transform)!;
        const cameraCamera = this.Game.GetComponent(cameraEntityId, Camera)!;
        const cameraMV = cameraTransform.GlobalModelViewMatrix(cameraEntityId).Inverse();

        for (const entityId of this.Game.GetView(this.renderableView))
        {
            if (!this.Game.IsEntityActive(entityId))
            {
                continue;
            }

            const tag = this.Game.GetComponent(entityId, Tag);
            if (tag instanceof EditorTag)
            {
                continue;
            }

            const transform = this.Game.GetComponent(entityId, Transform)!;
            const material = this.Game.GetComponent(entityId, BasicLitMaterial)!;
            const renderer = this.Game.GetComponent(entityId, MeshRenderer)!;

            const mesh = renderer.Asset!;
            const shader = material.Shader!;

            shader.Bind(this.Game.GL, );

            shader.SetBufferDataField(this.Game.GL, 'Camera', 'View', cameraMV, true);
            shader.SetBufferDataField(this.Game.GL, 'Camera', 'Projection', cameraCamera.ProjectionMatrix, true);
            shader.PushBufferData(this.Game.GL, 'Camera');

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

            shader.UnBind(this.Game.GL);
        }
    }

    private drawInstanceMesh(entityId: EntityId, mesh: InstanceMesh, transform: Transform, shader: Shader | null, buffer: WebGLBuffer | null, renderMode: number, renderCount: number)
    {
        this.Game.GL.bindVertexArray(mesh.VertexArrayBuffer);
        const modelViewMatrix = transform.GlobalModelViewMatrix(entityId);


        shader?.SetBufferDataField(this.Game.GL, 'Transform', 'Model', modelViewMatrix, true);
        shader?.SetBufferDataField(this.Game.GL, 'Transform', 'Normal', Matrix3.Inverse(modelViewMatrix.Matrix3));
        shader?.PushBufferData(this.Game.GL, 'Transform');

        if (buffer)
        {
            this.Game.GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer);
            this.Game.GL.drawElementsInstanced(renderMode, renderCount, GL.UNSIGNED_BYTE, 0, mesh.InstanceCount);
        }
        else
        {
            this.Game.GL.drawArraysInstanced(renderMode, 0, renderCount, mesh.InstanceCount);
        }

        this.Game.GL.bindVertexArray(null);
    }
    
    private drawMesh(entityId: EntityId, mesh: Mesh, transform: Transform, shader: Shader | null, buffer: WebGLBuffer | null, renderMode: number, renderCount: number)
    {
        GL.bindVertexArray(mesh.VertexArrayBuffer);
        const modelViewMatrix = transform.GlobalModelViewMatrix(entityId);


        shader?.SetBufferDataField(this.Game.GL, 'Transform', 'Model', modelViewMatrix, true);
        shader?.SetBufferDataField(this.Game.GL, 'Transform', 'Normal', Matrix3.Inverse(modelViewMatrix.Matrix3));
        shader?.PushBufferData(this.Game.GL, 'Transform');

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
