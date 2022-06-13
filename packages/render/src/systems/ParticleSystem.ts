import { GL, Matrix3 } from "@fwge/common"
import { Scene, System, Transform } from "@fwge/core"
import { ShaderAsset } from "../base"
import { Camera, Material, Particle, ParticleSpawner } from "../components"

export class ParticleSystem extends System
{
    private particleShader!: ShaderAsset
    private _time: number = 0
    private _timeLoc!: WebGLUniformLocation

    constructor()
    {
        super({ requiredComponents: [ Transform, ParticleSpawner ] })
    }

    Init(): void
    {
        this.particleShader = new ShaderAsset(particleShaderArgs)
        this._timeLoc = GL.getUniformLocation(this.particleShader.Program!, 'Time')!
    }

    Start(): void { }
    Stop(): void { }

    Update(delta: number): void
    {
        this._time += delta

        GL.enable(GL.DEPTH_TEST)
        GL.enable(GL.CULL_FACE)
        GL.depthMask(false)
        GL.enable(GL.BLEND)
        GL.blendFunc(GL.ONE, GL.ONE)

        // GL.disable(GL.CULL_FACE)
        // GL.disable(GL.DEPTH_TEST)
        if (!Camera.Main)
        {
            return 
        }

        this._useShader(this.particleShader!)
        GL.uniform1f(this._timeLoc, this._time)
        for (const entity of this.entities)
        {
            const transform = entity.GetComponent(Transform)!
            const particleSpawner = entity.GetComponent(ParticleSpawner)!

            if (!particleSpawner.Completed)
            {
                this._bindMaterialUniforms(particleSpawner.ParticleMaterial, this.particleShader)
                this._updateSystem(particleSpawner, delta)
                this._drawSystem(particleSpawner, transform)
            }
        }
        // GL.enable(GL.DEPTH_TEST)
        // GL.enable(GL.CULL_FACE)
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

            if (!particleSpawner.ParticleConfig.Loop && particle.Lifetime === particleSpawner.ParticleConfig.Lifetime)
            {
                continue
            }

            if (particleSpawner.ParticleConfig.Loop)
            {
                particle.Lifetime += particle.Lifetime >= particleSpawner.ParticleConfig.Lifetime
                    ? -particleSpawner.ParticleConfig.Lifetime
                    : delta
            }
            else
            {
                if (particle.Lifetime > particleSpawner.ParticleConfig.Lifetime)
                {
                    particle.Lifetime = particleSpawner.ParticleConfig.Lifetime
                }
                else if (particle.Lifetime < particleSpawner.ParticleConfig.Lifetime)
                {
                    particle.Lifetime += delta
                }
                else
                {
                    continue
                }
            }
            
            if (particle.Lifetime > particleSpawner.ParticleConfig.Lifetime)
            {
                particle.Lifetime -= particleSpawner.ParticleConfig.Lifetime
            }

            const config = particleSpawner.ParticleConfig
            const offset = i * Particle.ParticleLength
            const t = particle.Lifetime / config.Lifetime
            
            config.UpdatePosition(config.Position, particle.Position, i, t)
            config.UpdateRotation(config.Rotation, particle.Rotation, i, t)
            config.UpdateScale(config.Scale, particle.Scale, i, t)
            config.UpdateColour(config.Colour, particle.Colour, i, t)

            particleSpawner.BufferData[offset +  0] = particle.Position[0]
            particleSpawner.BufferData[offset +  1] = particle.Position[1]
            particleSpawner.BufferData[offset +  2] = particle.Position[2]

            particleSpawner.BufferData[offset +  3] = particle.Rotation[0]
            particleSpawner.BufferData[offset +  4] = particle.Rotation[1]
            particleSpawner.BufferData[offset +  5] = particle.Rotation[2]

            particleSpawner.BufferData[offset +  6] = particle.Scale[0]
            particleSpawner.BufferData[offset +  7] = particle.Scale[1]
            particleSpawner.BufferData[offset +  8] = particle.Scale[2]

            particleSpawner.BufferData[offset +  9] = particle.Colour[0]
            particleSpawner.BufferData[offset + 10] = particle.Colour[1]
            particleSpawner.BufferData[offset + 11] = particle.Colour[2]
            particleSpawner.BufferData[offset + 12] = particle.Colour[3]
        }
    }

    private _drawSystem(particleSpawner: ParticleSpawner, transform: Transform)
    {
        const mesh = particleSpawner.ParticleMesh
        const material = particleSpawner.ParticleMaterial
        const mv = transform.ModelViewMatrix
        const norm = new Matrix3(            
            mv[0], mv[1], mv[2],
            mv[4], mv[5], mv[6],
            mv[8], mv[9], mv[10]
        ).Inverse()

        GL.uniformMatrix4fv(this.particleShader!.Matrices!.ModelView, false, mv)
        GL.uniformMatrix3fv(this.particleShader!.Matrices!.Normal, false, norm)
        
        GL.bindVertexArray(particleSpawner.VertexArrayBuffer)
        
        if (mesh.IndexBuffer)
        {
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer)
        }

        GL.bindBuffer(GL.ARRAY_BUFFER, particleSpawner.ParticleVertexBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, particleSpawner.BufferData, GL.DYNAMIC_DRAW)
        
        if (mesh.IndexBuffer)
        {
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer)
            GL.drawElementsInstanced(
                GL.TRIANGLES,
                mesh.IndexCount,
                GL.UNSIGNED_BYTE,
                0,
                particleSpawner.ParticleCount
            )
        }
        else
        {
            GL.drawArraysInstanced(
                GL.TRIANGLES,
                0,
                mesh.VertexCount,
                particleSpawner.ParticleCount
            )
        }
        GL.bindVertexArray(null)
        
        GL.bindBuffer(GL.ARRAY_BUFFER, null)
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null)
    }
    
    private _useShader(shader: ShaderAsset)
    {
        GL.useProgram(shader.Program)
        GL.uniformMatrix4fv(shader.Matrices!.View, false, Camera.Main!.ViewMatrix)
        GL.uniformMatrix4fv(shader.Matrices!.Projection, false, Camera.Main!.ProjectionMatrix)
    }

    private _bindMaterialUniforms(material: Material, shader: ShaderAsset)
    {
        GL.uniform4f(
            shader.Material!.AmbientColour,
            material.Ambient[0],
            material.Ambient[1],
            material.Ambient[2],
            material.Ambient[3],
        )
        GL.uniform4f(
            shader.Material!.DiffuseColour,
            material.Diffuse[0],
            material.Diffuse[1],
            material.Diffuse[2],
            material.Diffuse[3],
        )
        GL.uniform4f(
            shader.Material!.SpecularColour,
            material.Specular[0],
            material.Specular[1],
            material.Specular[2],
            material.Specular[3],
        )
        GL.uniform1f(shader.Material!.Shininess, material.Shininess)
        GL.uniform1f(shader.Material!.Alpha, material.Alpha)
        
        if (material.ImageTexture)
        {
            GL.activeTexture(GL.TEXTURE0)
            GL.bindTexture(GL.TEXTURE_2D, material.ImageTexture)
            GL.uniform1i(shader.Material!.HasImageMap, 1)
            GL.uniform1i(shader.Material!.ImageSampler, 0)
        }
        else
        {
            GL.uniform1i(shader.Material!.HasImageMap, 0)
            GL.activeTexture(GL.TEXTURE0)
            GL.bindTexture(GL.TEXTURE_2D, null)
        }

        if (material.NormalTexture)
        {
            GL.activeTexture(GL.TEXTURE1)
            GL.bindTexture(GL.TEXTURE_2D, material.NormalTexture)
            GL.uniform1i(shader.Material!.BumpSampler, 0)
        }
        else
        {
            GL.activeTexture(GL.TEXTURE1)
            GL.bindTexture(GL.TEXTURE_2D, null)
        }

        if (material.SpecularTexture)
        {
            GL.activeTexture(GL.TEXTURE2)
            GL.bindTexture(GL.TEXTURE_2D, material.SpecularTexture)
            GL.uniform1i(shader.Material!.SpecularSampler, 0)
        }
        else
        {
            GL.activeTexture(GL.TEXTURE2)
            GL.bindTexture(GL.TEXTURE_2D, null)
        }
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

out vec3 V_Normal;
out vec2 V_UV;
out vec4 V_Colour;

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

struct Matrix
{
    mat4 ModelView;
    mat4 View;
    mat4 Projection;
};
uniform Matrix U_Matrix;

void main(void)
{
    mat4 Particle_ModelView = CalcuateModelView(
        A_Particle_Position,
        A_Particle_Rotation,
        A_Particle_Scale
    );

    V_Normal = A_Mesh_Normal;
    V_UV = A_Mesh_UV;
    V_Colour = A_Mesh_Colour * A_Particle_Colour;

    gl_PointSize = 100.0;
    gl_Position = U_Matrix.Projection * 
        U_Matrix.View *
        U_Matrix.ModelView * 
        Particle_ModelView *
        vec4(A_Mesh_Position, 1.0);
}

`,
        input: [],
    },
    fragmentShader: {
        source: `#version 300 es
precision highp float;

in vec2 V_UV;
in vec4 V_Colour;
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

uniform float Time; 
struct Sampler
{
    sampler2D Image;
};
uniform Sampler U_Sampler;

vec4 Colour()
{
    if (U_Material.HasImageMap)
    {
        return texture(U_Sampler.Image, V_UV);
    }
    else
    {
        return vec4(1.0);
    }
}

void main(void)
{
    // OutColour = vec4(1.0);
    // OutColour = V_Colour;
    OutColour = Colour() * V_Colour * vec4(vec3(1.0), U_Material.Alpha);
}`,
        input: []
    }
}