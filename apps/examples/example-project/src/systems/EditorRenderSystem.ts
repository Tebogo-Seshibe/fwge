import { GL, Matrix3 } from "@fwge/common";
import { BasicLitMaterial, Camera, InstanceMesh, Material, Mesh, MeshRenderer, RenderMode, Renderer, Shader, Tag, Transform } from "@fwge/core";
import { Registry, System, type EntityId } from "@fwge/ecs";
import { EditorTag } from "../components/EditorTag";

export class EditorRenderSystem extends System
{
    cameraView!: number;
    renderableView!: number;

    Init(): void 
    {
        this.cameraView = Registry.RegisterView(
            [Tag, Camera, Transform], 
            (_, tag) => tag instanceof EditorTag
        );

        this.renderableView = Registry.RegisterView(
            [Tag, Material, Renderer, Transform], 
            (_, tag) => tag instanceof EditorTag
        );
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
        
        GL.bindFramebuffer(GL.FRAMEBUFFER, null);
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
        GL.clearColor(0, 0, 0, 1);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        
        const cameraEntityId = Registry.GetView(this.cameraView)[0];
        const cameraTransform = Registry.GetComponent(cameraEntityId, Transform)!;
        const cameraCamera = Registry.GetComponent(cameraEntityId, Camera)!;        

        const cameraMV = cameraTransform.GlobalModelViewMatrix(cameraEntityId)
        const cameraMVInverse = cameraMV.Inverse();

        for (const entityId of Registry.GetView(this.renderableView))
        {
            if (!Registry.IsEntityActive(entityId))
            {
                continue;   
            }

            const transform = Registry.GetComponent(entityId, Transform)!
            const material = Registry.GetComponent(entityId, BasicLitMaterial)!
            const renderer = Registry.GetComponent(entityId, MeshRenderer)!

            const mesh = renderer.Asset!;
            const shader = material.Shader!;

            shader.Bind();

            shader.SetBufferDataField('Camera', 'View', cameraMVInverse, true);
            shader.SetBufferDataField('Camera', 'Projection', cameraCamera.ProjectionMatrix, true);
            shader.PushBufferData('Camera');

            shader.SetBufferDataField('BasicLitMaterial', 'Colour', material.Colour);
            shader.PushBufferData('BasicLitMaterial');

            
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

        shader.SetBufferDataField('Transform', 'Model', modelViewMatrix, true);
        shader.SetBufferDataField('Transform', 'Normal', Matrix3.Inverse(modelViewMatrix.Matrix3));
        shader.PushBufferData('Transform');

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

        shader.SetBufferDataField('Transform', 'Model', modelViewMatrix, true);
        shader.SetBufferDataField('Transform', 'Normal', Matrix3.Inverse(modelViewMatrix.Matrix3));
        shader.PushBufferData('Transform');

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
