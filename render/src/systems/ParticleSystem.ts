import { Matrix4, Matrix3, GL, Vector3 } from "@fwge/common"
import { Scene, System, Transform } from "@fwge/core"
import { Colour4 } from "../base"
import { Camera, ParticleSpawner, Shader } from "../components"
import { COLOUR_INDEX, NORMAL_INDEX, POSITION_INDEX, POSITION_SIZE, UV_INDEX } from "../constants"

export class ParticleSystem extends System
{
    private particleShader?: Shader
    constructor(scene: Scene)
    {
        super(scene, { requiredComponents: [ Transform, ParticleSpawner ] })
    }

    Init(): void
    {
        this.particleShader = new Shader(particleShaderArgs)
    }

    Start(): void
    {
        GL.enable(GL.DEPTH_TEST)
        GL.disable(GL.BLEND)
        GL.enable(GL.CULL_FACE)
        
        GL.canvas.width = Camera.Main!.ScreenWidth
        GL.canvas.height = Camera.Main!.ScreenHeight
        GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
        GL.clearColor(0.3, 0.6, 0.9, 1.0)
        
    }

    Update(delta: number): void
    {
        GL.useProgram(this.particleShader!.Program)
        GL.uniformMatrix4fv(this.particleShader!.BaseUniforms!.Matrix.View, false, Camera.Main!.View)
        GL.uniformMatrix4fv(this.particleShader!.BaseUniforms!.Matrix.Projection, false, Camera.Main!.Projection)

        for (const entityId of this.entities)
        {
            const entity = this.scene.GetEntity(entityId)!
            const particleSpawner = entity.GetComponent(ParticleSpawner)!
            const modelViewMatrix = entity.GetComponent(Transform)!.ModelViewMatrix
            const normalMatrix = entity.GetComponent(Transform)!.NormalMatrix

            // for (let i = 0; i < particleSpawner.Size; i++)
            // {
            //     particleSpawner.Vertices[(i * 7) + 0] = Math.random() - 0.5
            //     particleSpawner.Vertices[(i * 7) + 1] = Math.random() - 0.5
            //     particleSpawner.Vertices[(i * 7) + 2] = 0
    
            //     particleSpawner.Vertices[(i * 7) + 3] = 1.0
            //     particleSpawner.Vertices[(i * 7) + 4] = 1.0
            //     particleSpawner.Vertices[(i * 7) + 5] = 1.0
            //     particleSpawner.Vertices[(i * 7) + 6] = 1.0
            // }
            
            this._drawSystem(particleSpawner, modelViewMatrix, normalMatrix)
        }
        GL.useProgram(null)
    }

    Stop(): void
    {
        GL.enable(GL.BLEND)
        GL.disable(GL.DEPTH_TEST)
        GL.disable(GL.CULL_FACE)
    }

    private _drawSystem(particleSpawner: ParticleSpawner, modelViewMatrix: Matrix4, normalMatrix: Matrix3)
    {
        GL.bindFramebuffer(GL.FRAMEBUFFER, null)
        
        GL.enableVertexAttribArray(POSITION_INDEX)
        GL.disableVertexAttribArray(NORMAL_INDEX)
        GL.disableVertexAttribArray(UV_INDEX)
        GL.enableVertexAttribArray(COLOUR_INDEX)
        
        GL.vertexAttribDivisor(POSITION_INDEX, 1)
        GL.vertexAttribDivisor(COLOUR_INDEX, 1)

        GL.uniform4f(
            this.particleShader!.BaseUniforms!.Material.DiffuseColour,
            particleSpawner.Colour[0],
            particleSpawner.Colour[1],
            particleSpawner.Colour[2],
            particleSpawner.Colour[3],
        )
        GL.uniformMatrix4fv(this.particleShader!.BaseUniforms!.Matrix.ModelView, false, modelViewMatrix)
        GL.uniformMatrix3fv(this.particleShader!.BaseUniforms!.Matrix.Normal, false, normalMatrix)
        
        GL.bufferSubData(GL.ARRAY_BUFFER, 0, particleSpawner.Vertices)
        GL.vertexAttribPointer(POSITION_INDEX, Vector3.SIZE, GL.FLOAT, false, particleSpawner.VertexSize, 0)
        GL.vertexAttribPointer(COLOUR_INDEX, Colour4.SIZE, GL.FLOAT, false, particleSpawner.VertexSize, POSITION_SIZE)

        GL.drawArraysInstanced(GL.POINTS, 0, 1, particleSpawner.Size)
    }
}

const particleShaderArgs = {
    vertexSrc: `#version 300 es

layout(location = 0) in vec3 A_Position;
layout(location = 1) in vec3 A_Normal;
layout(location = 2) in vec2 A_UV;
layout(location = 3) in vec4 A_Colour;
layout(location = 4) in mat4 A_ModelViewMatrix;
layout(location = 8) in mat3 A_NormalMatrix;

out vec4 V_Position;
out vec3 V_Normal;
out vec2 V_UV;
out vec4 V_Colour;

struct Matrix
{
    mat4 ModelView;
    mat4 View;
    mat4 Projection;
};
uniform Matrix U_Matrix;

void passVertexData()
{
    V_Position = U_Matrix.ModelView * vec4(A_Position, 1.0);
    V_Normal = A_Normal;
    V_UV = A_UV;
    V_Colour = A_Colour;
}

void main(void)
{
    passVertexData();

    gl_Position = U_Matrix.Projection * U_Matrix.View * V_Position; 
    gl_PointSize = 10.0f;
}

`,
    fragmentSrc: `#version 300 es
precision highp float;

in vec4 V_Colour;
in vec2 V_UV;
in vec3 V_Normal;
in vec4 V_Position;
in vec4 V_Shadow;
out vec4 OutColour;

struct Material 
{
    vec4 Ambient;
    vec4 Diffuse;
    vec4 Specular;
    float Shininess;
    float Alpha;

    bool HasImageMap;
    bool HasBumpMap;
};

uniform Material U_Material;
void main(void)
{
    OutColour = U_Material.Diffuse * V_Colour;
}`
}