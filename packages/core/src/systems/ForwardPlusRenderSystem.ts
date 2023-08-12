import { GL, Matrix3, Matrix4 } from "@fwge/common";
import { RenderWindow, Shader } from "../base";
import { Transform } from "../components";
import { System } from "../ecs";

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

    private _defaultShader = new Shader(
        `#version 300 es
        
        layout(location = 0) in vec3 A_Position;
        layout(location = 1) in vec3 A_Normal;
        layout(location = 2) in vec2 A_UV;
        layout(location = 3) in vec3 A_Colour;
        
        out vec3 V_Position;
        out vec3 V_Normal;
        out vec2 V_UV;
        out vec3 V_Colour;
        
        struct Matrix
        {
            mat4 ModelView;
            mat3 Normal;
            mat4 View;
            mat4 Projection;
        };
        uniform Matrix U_Matrix;
        
        void main(void)
        {
            vec4 position = U_Matrix.ModelView * vec4(A_Position, 1.0);
            V_Position = position.xyz;
            V_Normal = normalize(U_Matrix.Normal * A_Normal);
            V_UV = A_UV;
            V_Colour = A_Colour;
        
            gl_Position = position; //vec4(vec3(0.0),1.0);
            gl_PointSize = 50.0;
        }`,
        `#version 300 es

        precision mediump float;
        
        in vec3 V_Position;
        in vec3 V_Normal;
        in vec2 V_UV;
        in vec3 V_Colour;
        
        layout (location = 0) out vec4 O_FragColour;
        
        void main(void)
        {        
            O_FragColour = vec4(1.0,1.0,1.0,1.0);
        }
        `
    );

    public Init(): void
    {   
        console.log(this);
        // view([Light], { name: PointLight.name, exec: light => light instanceof PointLight });
        // view([Light], { name: DirectionalLight.name, exec: light => light instanceof DirectionalLight });
        // view([Light], { name: AreaLight.name, exec: light => light instanceof AreaLight });
        // view([Transform, Material, Renderer]);
    }

    public Start(): void { }
    public Stop(): void { }
    
    public Update(_: number): void
    {
        GL.bindFramebuffer(GL.FRAMEBUFFER, null);
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
        // GL.scissor(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
        GL.clearColor(1, 0, 0, 0);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);

        this._defaultShader.Bind();
        for (const window of this.Scene.Windows)
        {
            this.drawSceneWindow(window);
        }
        this._defaultShader.UnBind();        

        // this._screenShader.Bind();
        // for (const window of this.Scene.Windows)
        // {
        //     this.drawWindowToScreen(window)
        // }
        // this._screenShader.UnBind();
    }

    debug = false;
    private drawSceneWindow(window: RenderWindow): void
    {
        // const modelview = window.Camera.ProjectionMatrix;
        // const projection = window.Camera.ViewMatrix;
        
        const projection = window.Camera.ProjectionMatrix
        const modelview = window.Camera.Owner?.GetComponent(Transform)?.ModelViewMatrix().Inverse() ?? Matrix4.Identity

        modelview.Identity();
        // window.MainPass.Output.Bind();
        this._defaultShader.SetMatrix('U_Matrix.Projection', projection, true)
        this._defaultShader.SetMatrix('U_Matrix.View', modelview, true)

        // for (const entityId of view([Transform, Material, Renderer]))
        // {
        //     const transform = getComponent(entityId, Transform)!;
        //     // const material = getComponent(entityId, Material)!;
        //     const renderer = getComponent(entityId, Renderer)!;
        //     const mesh = renderer.Asset!;
            
        //     if (!this._modelViewMatrices.has(entityId))
        //     {
        //         this._modelViewMatrices.set(entityId, Matrix4.Identity);
        //     }

        //     if (!this._normalMatrices.has(entityId))
        //     {
        //         this._normalMatrices.set(entityId, Matrix3.Identity);
        //     }

        //     const modelView = this._modelViewMatrices.get(entityId)!;
        //     const normal = this._normalMatrices.get(entityId)!;
        //     transform.ModelViewMatrix(modelView);
        //     Matrix3.Inverse(modelView.Matrix3.Transpose(), normal);

        //     let renderMode = -1;
        //     let renderCount = 0;
        //     let buffer = null;
        //     const renderType = this.debug ? RenderMode.POINT : renderer.RenderMode;

        //     switch (renderType)
        //     {
        //         case RenderMode.FACE:
        //             {
        //                 renderMode = GL.TRIANGLES;
        //                 renderCount = mesh.FaceCount;

        //                 if (mesh.IsIndexed)
        //                 {
        //                     buffer = mesh.FaceBuffer;
        //                 }
        //             }
        //             break;

        //         case RenderMode.EDGE:
        //             {
        //                 renderMode = GL.LINES;
        //                 renderCount = mesh.EdgeCount;

        //                 if (mesh.IsIndexed)
        //                 {
        //                     buffer = mesh.EdgeBuffer;
        //                 }
        //             }
        //             break;

        //         case RenderMode.POINT:
        //             {
        //                 renderMode = GL.POINTS;
        //                 renderCount = mesh.PointCount;

        //                 if (mesh.IsIndexed)
        //                 {
        //                     buffer = mesh.PointBuffer;
        //                 }
        //             }
        //             break;
        //     }

        //     GL.bindVertexArray(mesh.VertexArrayBuffer);
        //     this._defaultShader.SetMatrix('U_Matrix.ModelView', modelView, true);
        //     this._defaultShader.SetMatrix('U_Matrix.Normal', normal, true);
    
        //     if (buffer)
        //     {
        //         GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer);
        //         GL.drawElements(renderMode, renderCount, GL.UNSIGNED_BYTE, 0);
        //     }
        //     else
        //     {
        //         GL.drawArrays(renderMode, 0, renderCount);
        //     }
        //     GL.bindVertexArray(null);
        // }
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