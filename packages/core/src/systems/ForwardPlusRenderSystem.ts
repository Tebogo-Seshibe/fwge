import { GL, Matrix3, Matrix4 } from "@fwge/common";
import { RenderWindow, Scene, Shader } from "../base";
import { AreaLight, DirectionalLight, Light, Material, PointLight, Renderer, RenderMode, Transform } from "../components";
import { getComponent, getComponentById, System, view } from "../ecs";

export class ForwardPlusRenderSystem extends System
{
    private _modelViewMatrices = new Map<number, Matrix4>();
    private _normalMatrices = new Map<number, Matrix3>();
    private _screenShader = new Shader(
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
    );

    constructor(scene: Scene)
    {
        super(scene, { requiredComponents: [Transform, Material, Renderer] });
    }

    public Init(): void
    {
        view([Light], { name: PointLight.name, exec: light => light instanceof PointLight});
        view([Light], { name: DirectionalLight.name, exec: light => light instanceof DirectionalLight});
        view([Light], { name: AreaLight.name, exec: light => light instanceof AreaLight});
        view([Transform, Material, Renderer]);
    }

    public Start(): void { }
    public Stop(): void { }
    
    public Update(_: number): void
    {
        for (const window of this.Scene.Windows)
        {
            this.drawSceneWindow(window);
        }
        
        GL.bindFramebuffer(GL.FRAMEBUFFER, null);
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
        GL.scissor(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
        GL.clearColor(0, 0, 0, 1);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        this._screenShader.Bind();
        for (const window of this.Scene.Windows)
        {
            this.drawWindowToScreen(window)
        }
        this._screenShader.UnBind();
    }

    private drawSceneWindow(window: RenderWindow): void
    {
        window.MainPass.Output.Bind();
        for (const entityId of view([Transform, Material, Renderer]))
        {
            const transform = getComponent(entityId, Transform)!;
            const material = getComponent(entityId, Material)!;
            const renderer = getComponent(entityId, Renderer)!;
            const mesh = renderer.Asset!;
            
            if (!this._modelViewMatrices.has(entityId))
            {
                this._modelViewMatrices.set(entityId, Matrix4.Identity);
            }

            if (!this._normalMatrices.has(entityId))
            {
                this._normalMatrices.set(entityId, Matrix3.Identity);
            }

            const modelView = this._modelViewMatrices.get(entityId)!;
            const normal = this._normalMatrices.get(entityId)!;
            transform.ModelViewMatrix(modelView);
            Matrix3.Inverse(modelView.Matrix3.Transpose(), normal);

            let renderMode = -1;
            let renderCount = 0;
            let buffer = null;

            switch (renderer.RenderMode)
            {
                case RenderMode.FACE:
                    {
                        renderMode = GL.TRIANGLES;
                        renderCount = mesh.FaceCount;

                        if (mesh.IsIndexed)
                        {
                            buffer = mesh.FaceBuffer;
                        }
                    }
                    break;

                case RenderMode.EDGE:
                    {
                        renderMode = GL.LINES;
                        renderCount = mesh.EdgeCount;

                        if (mesh.IsIndexed)
                        {
                            buffer = mesh.EdgeBuffer;
                        }
                    }
                    break;

                case RenderMode.POINT:
                    {
                        renderMode = GL.POINTS;
                        renderCount = mesh.PointCount;

                        if (mesh.IsIndexed)
                        {
                            buffer = mesh.PointBuffer;
                        }
                    }
                    break;
            }

            GL.bindVertexArray(mesh.VertexArrayBuffer);
            material.Shader.SetMatrix('U_Matrix.ModelView', modelView, true);
            material.Shader.SetMatrix('U_Matrix.Normal', normal, true)
    
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

    private drawWindowToScreen(window: RenderWindow): void
    {
        this._screenShader.Reset();
        this._screenShader.SetFloatVector('U_PanelOffset', window.Offset);
        this._screenShader.SetFloatVector('U_PanelScale', window.Scale);

        GL.bindVertexArray(window.Panel.VertexArrayBuffer);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, window.Panel.FaceBuffer);
        GL.drawElements(GL.TRIANGLES, window.Panel.FaceCount, GL.UNSIGNED_BYTE, 0);
        GL.bindVertexArray(null);
    }
}