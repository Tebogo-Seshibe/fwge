import { GL } from "@fwge/common"
import { Scene, System, Transform } from "@fwge/core"
import { ShaderAsset } from "../base"
import { Camera, Particle, ParticleSpawner } from "../components"

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

    Update(delta: number): void
    {
        if (!Camera.Main)
        {
            return 
        }

        this._useShader(this.particleShader!)
        for (const entity of this.entities)
        {
            const transform = entity.GetComponent(Transform)!
            const particleSpawner = entity.GetComponent(ParticleSpawner)!

            if (!particleSpawner.Completed)
            {
                this._updateSystem(particleSpawner, delta)
                this._drawSystem(particleSpawner, transform)
            }
        }
    }
    private _updateSystem(particleSpawner: ParticleSpawner, delta: number)
    {
        for (let i = 0; i < particleSpawner.Particles.length; ++i)
        {
            const particle = particleSpawner.Particles[i]
            if (particle.Lifetime < 0)
            {
                particle.Lifetime += delta
                continue
            }

            if (particle.Lifetime >= particleSpawner.ParticleConfig.Lifetime)
            {
                if (!particleSpawner.ParticleConfig.Loop)
                {
                    particleSpawner.Offset = i
                    continue
                }
                else
                {
                    particle.Lifetime -= particleSpawner.ParticleConfig.Lifetime
                }
            }
            else
            {
                particle.Lifetime += delta
            }

            const offset = i * Particle.ParticleLength
            const t = particle.Lifetime / particleSpawner.ParticleConfig.Lifetime
            const newPosition = particleSpawner.ParticleConfig.UpdatePosition(particle.OriginalPosition, t)

            particle.Position.Set(newPosition)
            
            particleSpawner.BufferData[offset + 0] = particle.Position[0]
            particleSpawner.BufferData[offset + 1] = particle.Position[1]
            particleSpawner.BufferData[offset + 2] = particle.Position[2]
        }
    }

    private _drawSystem(particleSpawner: ParticleSpawner, transform: Transform)
    {
        const mesh = particleSpawner.ParticleMesh

        GL.bindVertexArray(particleSpawner.VertexArrayBuffer)
        GL.uniformMatrix4fv(this.particleShader!.Matrices!.ModelView, false, transform.ModelViewMatrix)
        GL.uniformMatrix3fv(this.particleShader!.Matrices!.Normal, false, transform.NormalMatrix)
        
        GL.bindBuffer(GL.ARRAY_BUFFER, particleSpawner.ParticleVertexBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, particleSpawner.BufferData, GL.DYNAMIC_DRAW)
        console.log(Particle.ParticleSize * particleSpawner.Offset)
        if (mesh.IndexBuffer)
        {
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer)
            GL.drawElementsInstanced(
                GL.TRIANGLES,
                mesh.IndexCount,
                GL.UNSIGNED_BYTE,
                Particle.ParticleSize * particleSpawner.Offset,
                particleSpawner.ParticleCount - particleSpawner.Offset
            )
        }
        else
        {
            GL.drawArraysInstanced(
                GL.TRIANGLES,
                Particle.ParticleSize * particleSpawner.Offset,
                mesh.VertexCount,
                particleSpawner.ParticleCount - particleSpawner.Offset
            )
        }
        GL.bindVertexArray(null)
        
        GL.bindBuffer(GL.ARRAY_BUFFER, null)
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null)
    }
    
    private _useShader(shader: ShaderAsset)
    {
        GL.useProgram(shader.Program)
        GL.uniformMatrix4fv(shader.Matrices!.View, false, Camera.Main!.View)
        GL.uniformMatrix4fv(shader.Matrices!.Projection, false, Camera.Main!.Projection)
    }
}

const particleShaderArgs = {
    vertexShader: {
        source: `#version 300 es
#define PI 3.1415926538

// =========== MESH DETAILS ===========
layout(location = 0) in vec3 A_Mesh_Position;
layout(location = 1) in vec3 A_Mesh_Normal;
layout(location = 2) in vec2 A_Mesh_UV;
layout(location = 3) in vec4 A_Mesh_Colour;
// =========== MESH DETAILS ===========

// =========== PARTICLE DETAILS ===========
layout(location = 4) in vec3 A_Particle_Position;
layout(location = 5) in vec3 A_Particle_Rotation;
layout(location = 6) in vec3 A_Particle_Scale;
layout(location = 7) in vec4 A_Particle_Colour;
// =========== PARTICLE DETAILS ===========

// =========== MODELVIEW MATRIX CALCULATIONS ===========
float radian(float x)
{
    return PI / 180.0 * x;
}
void Translate(inout mat4 m, in vec3 t)
{
    m[3][0] += t.x;
    m[3][1] += t.y;
    m[3][2] += t.z;
}       

void Rotate(inout mat4 m, in vec3 r)
{
    float x = radian(r.x);
    float y = radian(r.y);
    float z = radian(r.z);

    float sin_x = sin(x);
    float sin_y = sin(y);
    float sin_z = sin(z);

    float cos_x = cos(x);
    float cos_y = cos(y);
    float cos_z = cos(z);
    
    float rot_0  = cos_y * cos_z;
    float rot_1  = sin_x * sin_y * cos_z - cos_x * sin_z;
    float rot_2  = cos_x * sin_y * cos_z + sin_x * sin_z;
    float rot_4  = cos_y * sin_z;
    float rot_5  = sin_x * sin_y * sin_z + cos_x * cos_z;
    float rot_6  = cos_x * sin_y * sin_z - sin_x * cos_z;
    float rot_8  = -sin_y;
    float rot_9  = sin_x * cos_y;
    float rot_10 = cos_x * cos_y;

    float m0  = m[0][0] * rot_0 + m[0][1] * rot_4 + m[0][2] * rot_8;
    float m1  = m[0][0] * rot_1 + m[0][1] * rot_5 + m[0][2] * rot_9;
    float m2  = m[0][0] * rot_2 + m[0][1] * rot_6 + m[0][2] * rot_10;
    float m4  = m[1][0] * rot_0 + m[1][1] * rot_4 + m[1][2] * rot_8;
    float m5  = m[1][0] * rot_1 + m[1][1] * rot_5 + m[1][2] * rot_9;
    float m6  = m[1][0] * rot_2 + m[1][1] * rot_6 + m[1][2] * rot_10;
    float m8  = m[2][0] * rot_0 + m[2][1] * rot_4 + m[2][2] * rot_8;
    float m9  = m[2][0] * rot_1 + m[2][1] * rot_5 + m[2][2] * rot_9;
    float m10 = m[2][0] * rot_2 + m[2][1] * rot_6 + m[2][2] * rot_10;
    float m12 = m[3][0] * rot_0 + m[3][1] * rot_4 + m[3][2] * rot_8;
    float m13 = m[3][0] * rot_1 + m[3][1] * rot_5 + m[3][2] * rot_9;
    float m14 = m[3][0] * rot_2 + m[3][1] * rot_6 + m[3][2] * rot_10;

    m[0][0]  = m0;
    m[0][1]  = m1;
    m[0][2]  = m2;
    m[1][0]  = m4;
    m[1][1]  = m5;
    m[1][2]  = m6;
    m[2][0]  = m8;
    m[2][1]  = m9;
    m[2][2] = m10;
    m[3][0] = m12;
    m[3][1] = m13;
    m[3][2] = m14;
}

void Scale(inout mat4 m, in vec3 s)
{
    m[0][0] *= s.x;
    m[1][1] *= s.y;
    m[2][2] *= s.z;
}

mat4 CalcuateModelView(in vec3 t, in vec3 r, in vec3 s)
{
    mat4 m = mat4(1.0);

    Scale(m, s);
    Rotate(m, r);
    Translate(m, t);

    return m;
}
// =========== MODELVIEW MATRIX CALCULATIONS ===========

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

void main(void)
{
    mat4 m = CalcuateModelView(
        A_Particle_Position,
        A_Particle_Rotation,
        A_Particle_Scale
    );

    // vec4 Particle_Position = A_Particle_ModelViewMatrix * vec4(A_Mesh_Position, 1.0);
    vec4 Particle_Position = m * vec4(A_Mesh_Position, 1.0);
    V_Normal = A_Mesh_Normal;
    V_UV = A_Mesh_UV;
    V_Colour = A_Particle_Colour;

    gl_Position = U_Matrix.Projection * U_Matrix.View * U_Matrix.ModelView * Particle_Position; 
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