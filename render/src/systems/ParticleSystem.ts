import { GL, Matrix3, Matrix4 } from "@fwge/common"
import { Scene, System, Transform } from "@fwge/core"
import { Colour4, ShaderAsset } from "../base"
import { Camera, ParticleSpawner } from "../components"

export class ParticleSystem extends System
{
    private particleShader!: ShaderAsset
    constructor(scene: Scene)
    {
        super(scene, { requiredComponents: [ Transform, ParticleSpawner ] })
    }

    Init(): void
    {
        this.particleShader = new ShaderAsset(particleShaderArgs)
    }

    Start(): void { }
    Stop(): void { }

    Update(_: number): void
    {
        if (!Camera.Main)
        {
            return 
        }

        GL.useProgram(this.particleShader!.Program)
        GL.uniformMatrix4fv(this.particleShader.Matrices!.View, false, Camera.Main!.View)
        GL.uniformMatrix4fv(this.particleShader.Matrices!.Projection, false, Camera.Main!.Projection)

        for (const entity of this.entities)
        {
            const particleSpawner = entity.GetComponent(ParticleSpawner)!
            const modelViewMatrix = entity.GetComponent(Transform)!.ModelViewMatrix
            const normalMatrix = entity.GetComponent(Transform)!.NormalMatrix

            for (let i = 0; i < particleSpawner.Particles.length; ++i)
            {
                const offset = i * (Matrix4.SIZE + Colour4.SIZE)
                const mv = particleSpawner.Particles[i].ModelViewMatrix
    
                particleSpawner.BufferData[offset +  4] = mv[ 0]
                particleSpawner.BufferData[offset +  5] = mv[ 1]
                particleSpawner.BufferData[offset +  6] = mv[ 2]
                particleSpawner.BufferData[offset +  7] = mv[ 3]
                particleSpawner.BufferData[offset +  8] = mv[ 4]
                particleSpawner.BufferData[offset +  9] = mv[ 5]
                particleSpawner.BufferData[offset + 10] = mv[ 6]
                particleSpawner.BufferData[offset + 11] = mv[ 7]
                particleSpawner.BufferData[offset + 12] = mv[ 8]
                particleSpawner.BufferData[offset + 13] = mv[ 9]
                particleSpawner.BufferData[offset + 14] = mv[10]
                particleSpawner.BufferData[offset + 15] = mv[11]
                particleSpawner.BufferData[offset + 16] = mv[12]
                particleSpawner.BufferData[offset + 17] = mv[13]
                particleSpawner.BufferData[offset + 18] = mv[14]
                particleSpawner.BufferData[offset + 19] = mv[15]
            }
            
            this._drawSystem(particleSpawner, modelViewMatrix, normalMatrix)
        }
    }

    private _drawSystem(particleSpawner: ParticleSpawner, modelViewMatrix: Matrix4, normalMatrix: Matrix3)
    {
        GL.bindVertexArray(particleSpawner.VertexArrayBuffer)

        GL.bufferData(GL.ARRAY_BUFFER, particleSpawner.BufferData, GL.DYNAMIC_DRAW)
        GL.uniformMatrix4fv(this.particleShader!.Matrices!.ModelView, false, modelViewMatrix)
        GL.uniformMatrix3fv(this.particleShader!.Matrices!.Normal, false, normalMatrix)

        GL.drawArraysInstanced(GL.TRIANGLES, 0, particleSpawner.MeshIndexCount, particleSpawner.ParticleCount)
        GL.bindVertexArray(null)
    }
}

const particleShaderArgs = {
    vertexShader: {
        source: `#version 300 es

layout(location = 0) in vec3 A_Position;
layout(location = 1) in vec3 A_Normal;
layout(location = 2) in vec2 A_UV;
layout(location = 3) in vec4 A_Colour;
layout(location = 4) in mat4 A_ModelViewMatrix;
layout(location = 8) in mat3 A_NormalMatrix;

out vec4 V_Colour;

struct Matrix
{
    mat4 ModelView;
    mat4 View;
    mat4 Projection;
};
uniform Matrix U_Matrix;

void main(void)
{
    V_Colour = A_Colour;
    gl_Position = U_Matrix.Projection * U_Matrix.View * U_Matrix.ModelView * A_ModelViewMatrix * vec4(A_Position, 1.0); 
    gl_PointSize = 10.0f;
}

`,
        input: [],
    },
    fragmentShader: {
        source: `#version 300 es
precision highp float;

in vec4 V_Colour;
out vec4 OutColour;

void main(void)
{
    OutColour = V_Colour;// U_Material.Diffuse * V_Colour;
}`,
        input: []
    }
}