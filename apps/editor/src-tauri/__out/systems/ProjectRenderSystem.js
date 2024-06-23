import { GL, Matrix3, Matrix4 } from "@fwge/common";
import { AreaLight, BasicLitMaterial, Camera, DefaultWindow, DirectionalLight, InstanceMesh, Light, Material, MeshRenderer, RenderMode, Renderer, Shader, Tag, Transform } from "@fwge/core";
import { Registry, System } from "@fwge/ecs";
import { EditorTag } from "../components/EditorTag";
import { finalPassShaderFrag, finalPassShaderVert } from "../assets/CubeShader";
export class ProjectRenderSystem extends System {
    cameraView;
    renderableView;
    renderableShadowView;
    areaLightView;
    directionalLightView;
    finalPassShader;
    window;
    Init() {
        this.cameraView = Registry.RegisterView([Camera, Transform]);
        this.renderableView = Registry.RegisterView([Material, Renderer, Transform], entity => !entity.HasComponent(EditorTag));
        this.renderableShadowView = Registry.RegisterView([Material, Renderer, Transform], (_, material) => material.ProjectsShadows);
        this.areaLightView = Registry.RegisterView([Light], (_, light) => light instanceof AreaLight);
        this.directionalLightView = Registry.RegisterView([Light], (_, light) => light instanceof DirectionalLight);
        this.finalPassShader = new Shader(finalPassShaderVert, finalPassShaderFrag);
        this.window = new DefaultWindow();
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
    }
    Start() {
        return;
    }
    Stop() {
        return;
    }
    Update() {
        GL.enable(GL.DEPTH_TEST);
        GL.enable(GL.CULL_FACE);
        GL.depthMask(true);
        GL.cullFace(GL.FRONT);
        for (var entityId of Registry.GetView(this.directionalLightView)) {
            this.renderShadows(entityId, Registry.GetComponent(entityId, DirectionalLight));
        }
        GL.cullFace(GL.BACK);
        this.renderScene(this.window);
        GL.bindFramebuffer(GL.FRAMEBUFFER, null);
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
        GL.clearColor(0, 0, 0, 0);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        this.finalPassShader.Bind();
        this.finalPassShader.SetTexture('U_Position', this.window.FinalComposite.ColourAttachments[0]);
        this.finalPassShader.SetTexture('U_Normal', this.window.FinalComposite.ColourAttachments[1]);
        this.finalPassShader.SetTexture('U_Albedo_Alpha', this.window.FinalComposite.ColourAttachments[2]);
        this.finalPassShader.SetTexture('U_Depth', this.window.FinalComposite.DepthAttachment);
        this.finalPassShader.SetTexture(`U_Dir_Tex`, Registry.GetComponent(Registry.GetView(this.directionalLightView)[0], DirectionalLight).RenderTarget.DepthAttachment);
        let a = 0;
        for (var entityId of Registry.GetView(this.areaLightView)) {
            const light = Registry.GetComponent(entityId, AreaLight);
            this.finalPassShader.SetFloatVector(`U_AreaLight[${a}].Colour`, light.Colour);
            this.finalPassShader.SetFloat(`U_AreaLight[${a}].Intensity`, light.Intensity);
            a++;
        }
        let d = 0;
        for (var entityId of Registry.GetView(this.directionalLightView)) {
            const light = Registry.GetComponent(entityId, DirectionalLight);
            const transform = Registry.GetComponent(entityId, Transform);
            const rotation = transform.GlobalRotation(entityId);
            const rotationMatrix = Matrix4.RotationMatrix(rotation.X / 2, rotation.Y, rotation.Z);
            const direction = Matrix4.MultiplyVector(rotationMatrix, [...DirectionalLight.DefaultDirection, 1.0]);
            this.finalPassShader.SetFloatVector(`U_DirectionalLight[${d}].Colour`, light.Colour);
            this.finalPassShader.SetFloat(`U_DirectionalLight[${d}].Intensity`, light.Intensity);
            this.finalPassShader.SetFloatVector(`U_DirectionalLight[${d}].Direction`, direction.XYZ.Negate());
            this.finalPassShader.SetBool(`U_DirectionalLight[${d}].CastShadows`, light.CastShadows);
            this.finalPassShader.SetFloat(`U_DirectionalLight[${d}].TexelSize`, 1 / light.RenderTarget.Width);
            this.finalPassShader.SetFloat(`U_DirectionalLight[${d}].TexelCount`, ((light.PCFLevel * 2) + 1) ** 2);
            this.finalPassShader.SetFloat(`U_DirectionalLight[${d}].Bias`, light.Bias);
            this.finalPassShader.SetFloat(`U_DirectionalLight[${d}].PCFLevel`, light.PCFLevel);
            this.finalPassShader.SetMatrix(`U_DirectionalLight[${d}].ProjectionMatrix`, light.ProjectionMatrix, true);
            this.finalPassShader.SetMatrix(`U_DirectionalLight[${d}].ViewMatrix`, rotationMatrix, true);
            d++;
        }
        const cameraEntityId = Registry.GetView(this.cameraView)[0];
        const cameraTransform = Registry.GetComponent(cameraEntityId, Transform);
        const cameraCamera = Registry.GetComponent(cameraEntityId, Camera);
        const cameraMV = cameraTransform.GlobalModelViewMatrix(cameraEntityId).Inverse();
        this.finalPassShader.SetBufferDataField('Camera', 'View', cameraMV, true);
        this.finalPassShader.SetBufferDataField('Camera', 'Projection', cameraCamera.ProjectionMatrix, true);
        this.finalPassShader.PushBufferData('Camera');
        GL.bindVertexArray(this.window.Panel.VertexArrayBuffer);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.window.Panel.FaceBuffer);
        GL.drawElements(GL.TRIANGLES, this.window.Panel.FaceCount, GL.UNSIGNED_BYTE, 0);
        GL.bindVertexArray(null);
        this.finalPassShader.UnBind();
    }
    renderShadows(parentId, light) {
        light.BindForShadows(parentId);
        for (const entityId of Registry.GetView(this.renderableView)) {
            if (!Registry.IsEntityActive(entityId)) {
                continue;
            }
            const tag = Registry.GetComponent(entityId, Tag);
            if (tag instanceof EditorTag) {
                continue;
            }
            const material = Registry.GetComponent(entityId, BasicLitMaterial);
            if (!material.ProjectsShadows) {
                continue;
            }
            const transform = Registry.GetComponent(entityId, Transform);
            const renderer = Registry.GetComponent(entityId, MeshRenderer);
            const mesh = renderer.Asset;
            let renderMode;
            let renderCount;
            let buffer;
            switch (renderer.RenderMode) {
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
            DirectionalLight.ShadowShader.SetMatrix('U_Transform.ModelView', transform.GlobalModelViewMatrix(entityId), true);
            if (mesh instanceof InstanceMesh) {
                this.drawInstanceMesh(entityId, mesh, transform, null, buffer, renderMode, renderCount);
            }
            else {
                this.drawMesh(entityId, mesh, transform, null, buffer, renderMode, renderCount);
            }
        }
        light.UnbindForShadows();
    }
    renderScene(window) {
        window.MainPass.Output.Bind();
        const cameraEntityId = Registry.GetView(this.cameraView)[0];
        const cameraTransform = Registry.GetComponent(cameraEntityId, Transform);
        const cameraCamera = Registry.GetComponent(cameraEntityId, Camera);
        const cameraMV = cameraTransform.GlobalModelViewMatrix(cameraEntityId).Inverse();
        for (const entityId of Registry.GetView(this.renderableView)) {
            if (!Registry.IsEntityActive(entityId)) {
                continue;
            }
            const tag = Registry.GetComponent(entityId, Tag);
            if (tag instanceof EditorTag) {
                continue;
            }
            const transform = Registry.GetComponent(entityId, Transform);
            const material = Registry.GetComponent(entityId, BasicLitMaterial);
            const renderer = Registry.GetComponent(entityId, MeshRenderer);
            const mesh = renderer.Asset;
            const shader = material.Shader;
            shader.Bind();
            shader.SetBufferDataField('Camera', 'View', cameraMV, true);
            shader.SetBufferDataField('Camera', 'Projection', cameraCamera.ProjectionMatrix, true);
            shader.PushBufferData('Camera');
            material.BindBlock(shader);
            let renderMode;
            let renderCount;
            let buffer;
            switch (renderer.RenderMode) {
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
            if (mesh instanceof InstanceMesh) {
                this.drawInstanceMesh(entityId, mesh, transform, shader, buffer, renderMode, renderCount);
            }
            else {
                this.drawMesh(entityId, mesh, transform, shader, buffer, renderMode, renderCount);
            }
            shader.UnBind();
        }
    }
    drawInstanceMesh(entityId, mesh, transform, shader, buffer, renderMode, renderCount) {
        GL.bindVertexArray(mesh.VertexArrayBuffer);
        const modelViewMatrix = transform.GlobalModelViewMatrix(entityId);
        shader?.SetBufferDataField('Transform', 'Model', modelViewMatrix, true);
        shader?.SetBufferDataField('Transform', 'Normal', Matrix3.Inverse(modelViewMatrix.Matrix3));
        shader?.PushBufferData('Transform');
        if (buffer) {
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer);
            GL.drawElementsInstanced(renderMode, renderCount, GL.UNSIGNED_BYTE, 0, mesh.InstanceCount);
        }
        else {
            GL.drawArraysInstanced(renderMode, 0, renderCount, mesh.InstanceCount);
        }
        GL.bindVertexArray(null);
    }
    drawMesh(entityId, mesh, transform, shader, buffer, renderMode, renderCount) {
        GL.bindVertexArray(mesh.VertexArrayBuffer);
        const modelViewMatrix = transform.GlobalModelViewMatrix(entityId);
        shader?.SetBufferDataField('Transform', 'Model', modelViewMatrix, true);
        shader?.SetBufferDataField('Transform', 'Normal', Matrix3.Inverse(modelViewMatrix.Matrix3));
        shader?.PushBufferData('Transform');
        if (buffer) {
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer);
            GL.drawElements(renderMode, renderCount, GL.UNSIGNED_BYTE, 0);
        }
        else {
            GL.drawArrays(renderMode, 0, renderCount);
        }
        GL.bindVertexArray(null);
    }
}
