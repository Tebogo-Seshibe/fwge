import { GL, Matrix3 } from "@fwge/common";
import { BasicLitMaterial, Camera, InstanceMesh, Material, MeshRenderer, RenderMode, RenderPipelineMode, RenderWindow, Renderer, Shader, Tag, Transform, type Mesh } from "@fwge/core";
import { Registry, System, type EntityId } from "@fwge/ecs";
import { EditorTag } from "../components/EditorTag";
import { finalPassShaderFrag, finalPassShaderVert } from "../assets/CubeShader";

export class ProjectRenderSystem extends System
{
    cameraView!: number;
    renderableView!: number;
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

        this.finalPassShader = new Shader(
            finalPassShaderVert,
            finalPassShaderFrag
        );

        this.window = new RenderWindow({
            renderPipelineMode: RenderPipelineMode.DEFERRED
        })
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

        this.window.MainPass.Output.Bind()
        
        this.renderScene();        
        
        GL.bindFramebuffer(GL.FRAMEBUFFER, null);
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
        GL.clearColor(1, 0, 0, 0);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        this.finalPassShader.Bind()
        
        this.finalPassShader.SetTexture('U_Position', this.window.FinalComposite.ColourAttachments[0])
        this.finalPassShader.SetTexture('U_Normal', this.window.FinalComposite.ColourAttachments[1])
        this.finalPassShader.SetTexture('U_Albedo_Alpha', this.window.FinalComposite.ColourAttachments[2])
        this.finalPassShader.SetTexture('U_Depth', this.window.FinalComposite.DepthAttachment!)
        
        GL.bindVertexArray(this.window.Panel.VertexArrayBuffer);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.window.Panel.FaceBuffer);
        GL.drawElements(GL.TRIANGLES, this.window.Panel.FaceCount, GL.UNSIGNED_BYTE, 0);
        GL.bindVertexArray(null);
        this.finalPassShader.UnBind()
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

    private drawInstanceMesh(entityId: EntityId, mesh: InstanceMesh, transform: Transform, shader: Shader, buffer: WebGLBuffer | null, renderMode: number, renderCount: number)
    {
        GL.bindVertexArray(mesh.VertexArrayBuffer);
        const modelViewMatrix = transform.GlobalModelViewMatrix(entityId);


        shader.SetBufferDataField('Object', 'ModelViewMatrix', modelViewMatrix, true);
        shader.SetBufferDataField('Object', 'NormalMatrix', Matrix3.Inverse(modelViewMatrix.Matrix3));
        shader.PushBufferData('Object');

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
    
    private drawMesh(entityId: EntityId, mesh: Mesh, transform: Transform, shader: Shader, buffer: WebGLBuffer | null, renderMode: number, renderCount: number)
    {
        GL.bindVertexArray(mesh.VertexArrayBuffer);
        const modelViewMatrix = transform.GlobalModelViewMatrix(entityId);


        shader.SetBufferDataField('Object', 'ModelViewMatrix', modelViewMatrix, true);
        shader.SetBufferDataField('Object', 'NormalMatrix', Matrix3.Inverse(modelViewMatrix.Matrix3));
        shader.PushBufferData('Object');

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
