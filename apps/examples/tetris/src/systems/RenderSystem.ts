import { GL, Matrix3 } from "@fwge/common";
import { Camera, InstanceMesh, Material, Mesh, RenderMode, Renderer, Shader, Transform } from "@fwge/core";
import { Registry, System } from "@fwge/ecs";

export class RenderSystem extends System
{
    renderables!: number;
    cameras!: number;
    shader!: Shader;

    Init(): void
    {
        this.renderables = Registry.RegisterView([Transform, Material, Renderer]);
        this.cameras = Registry.RegisterView([Transform, Camera]);
        this.shader = new Shader(vert, frag);
    }
    
    Start(): void { }

    log = 0;
    Update(delta: number): void
    {
        this.log += delta;

        GL.bindFramebuffer(GL.FRAMEBUFFER, null);
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
        GL.clearColor(0, 0, 0, 1);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        // GL.enable(GL.CULL_FACE);
        // GL.cullFace(GL.BACK);
        GL.disable(GL.CULL_FACE);
        
        const cameraEntityId = Registry.GetView(this.cameras)[0];
        const cameraTransform = Registry.GetComponent(cameraEntityId, Transform)!;
        const cameraCamera = Registry.GetComponent(cameraEntityId, Camera)!;        

        for (const entityId of Registry.GetView(this.renderables))
        {
            const material = Registry.GetComponent(entityId, Material)!;
            const transform = Registry.GetComponent(entityId, Transform)!;
            const renderer = Registry.GetComponent(entityId, Renderer)!;
            const mesh = renderer.Asset!;
            const shader = material.Shader!;

            shader.Bind();
            
            shader.SetBufferDataField('Camera', 'ViewMatrix', cameraTransform.GlobalModelViewMatrix().Inverse(), true);
            shader.SetBufferDataField('Camera', 'ProjectionMatrix', cameraCamera.ProjectionMatrix, true);
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
                this.drawInstanceMesh(mesh, transform, shader, buffer, renderMode, renderCount);
            }
            else
            {
                this.drawMesh(mesh, transform, shader, buffer, renderMode, renderCount);
            }

            shader.UnBind()
        }

        GL.bindFramebuffer(GL.FRAMEBUFFER, null);
    }
    
    private drawInstanceMesh(mesh: InstanceMesh, transform: Transform, shader: Shader, buffer: WebGLBuffer | null, renderMode: number, renderCount: number)
    {
        GL.bindVertexArray(mesh.VertexArrayBuffer);
        const modelViewMatrix = transform.GlobalModelViewMatrix();


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
    
    private drawMesh(mesh: Mesh, transform: Transform, shader: Shader, buffer: WebGLBuffer | null, renderMode: number, renderCount: number)
    {
        GL.bindVertexArray(mesh.VertexArrayBuffer);
        const modelViewMatrix = transform.GlobalModelViewMatrix();


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

    Stop(): void { }
}

const vert: string = `#version 300 es

precision mediump float;

layout(location = 0) in vec3 A_Position;
layout(location = 1) in vec3 A_Normal;
layout(location = 2) in vec3 A_UV;
layout(location = 3) in vec3 A_Colour;

out vec3 V_Position;
out vec3 V_Normal;
out vec3 V_UV;
out vec3 V_Colour;

uniform mat4 U_ModelViewMatrix;
uniform mat3 U_NormalMatrix;
uniform mat4 U_ViewMatrix;
uniform mat4 U_ProjectionMatrix;

void main(void)
{
    vec4 position = U_ModelViewMatrix * vec4(A_Position, 1.0);

    V_Position = position.xyz;
    V_Normal = normalize(U_NormalMatrix * A_Normal);
    V_UV = A_UV;
    V_Colour = A_Colour;

    gl_Position = U_ProjectionMatrix * U_ViewMatrix * position;
}
`
const frag: string = `#version 300 es

precision mediump float;

in vec3 V_Position;
in vec3 V_Normal;
in vec3 V_UV;
in vec3 V_Colour;

layout(location = 0) out vec4 O_FragColour;

uniform vec3 U_Colour;

void main(void)
{
    O_FragColour = vec4(U_Colour, 1.0);
}
`