import { GL } from "@fwge/common"
import { Scene, System, Transform } from "@fwge/core"
import { ShaderAsset } from "../base"
import { Camera, Material, Particle, ParticleSpawner } from "../components"

export class ParticleSystem extends System
{
    private particleShader!: ShaderAsset
    private _time: number = 0
    private _timeLoc!: WebGLUniformLocation
    constructor(scene: Scene)
    {
        super(scene, { requiredComponents: [ Transform, ParticleSpawner ] })
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

            const config = particleSpawner.ParticleConfig
            const offset = i * Particle.ParticleLength
            const t = particle.Lifetime / config.Lifetime

            particle.Position.Set(
                config.UpdatePosition(
                    t,
                    config.Position.Clone(),
                    i
                )
            )
            particle.Rotation.Set(
                config.UpdateRotation(
                    t,
                    config.Rotation.Clone(),
                    i
                )
            )
            particle.Scale.Set(
                config.UpdateScale(
                    t,
                    config.Scale.Clone(),
                    i
                )
            )
            particle.Colour.Set(
                config.UpdateColour(
                    t,
                    config.Colour.Clone(),
                    i
                )
            )
           
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

        GL.bindVertexArray(particleSpawner.VertexArrayBuffer)
        GL.uniformMatrix4fv(this.particleShader!.Matrices!.ModelView, false, transform.ModelViewMatrix)
        GL.uniformMatrix3fv(this.particleShader!.Matrices!.Normal, false, transform.NormalMatrix)
        
        GL.bindBuffer(GL.ARRAY_BUFFER, particleSpawner.ParticleVertexBuffer)
        GL.bufferData(GL.ARRAY_BUFFER, particleSpawner.BufferData, GL.DYNAMIC_DRAW)
        
        if (mesh.IndexBuffer)
        {
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
        GL.uniformMatrix4fv(shader.Matrices!.View, false, Camera.Main!.View)
        GL.uniformMatrix4fv(shader.Matrices!.Projection, false, Camera.Main!.Projection)
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
    V_Colour = A_Particle_Colour;

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

float interpolate(float a0, float a1, float w)
{
    /* // You may want clamping by inserting:
     * if (0.0 > w) return a0;
     * if (1.0 < w) return a1;
     */
    return (a1 - a0) * w + a0;
    /* // Use this cubic interpolation [[Smoothstep]] instead, for a smooth appearance:
     * return (a1 - a0) * (3.0 - w * 2.0) * w * w + a0;
     *
     * // Use [[Smootherstep]] for an even smoother result with a second derivative equal to zero on boundaries:
     * return (a1 - a0) * ((w * (w * 6.0 - 15.0) + 10.0) * w * w * w) + a0;
     */
}

/* Create pseudorandom direction vector
 */
vec2 randomGradient(int ix, int iy)
{
    // No precomputed gradients mean this works for any number of grid coordinates
    const uint w = 8u;
    const uint s = w / 2u; // rotation width
    uint a = uint(ix), b = uint(iy);
    a *= 3284157443u;
    b ^= a << s | a >> w-s;

    b *= 1911520717u;
    a ^= b << s | b >> w-s;

    a *= 2048419325u;
    float random = float(a) * (3.14159265 / float(~(~0u >> 1))); // in [0, 2*Pi]
    
    return vec2(cos(random), sin(random));
}

// Computes the dot product of the distance and gradient vectors.
float dotGridGradient(int ix, int iy, float x, float y)
{
    // Get gradient from integer coordinates
    vec2 gradient = randomGradient(ix, iy);

    // Compute the distance vector
    float dx = x - float(ix);
    float dy = y - float(iy);

    // Compute the dot-product
    return (dx*gradient.x + dy*gradient.y);
}

// Compute Perlin noise at coordinates x, y
float perlin(float x, float y) {
    // Determine grid cell coordinates
    int x0 = int(floor(x));
    int x1 = x0 + 1;
    int y0 = int(floor(y));
    int y1 = y0 + 1;

    // Determine interpolation weights
    // Could also use higher order polynomial/s-curve here
    float sx = x - float(x0);
    float sy = y - float(y0);

    // Interpolate between grid point gradients
    float n0, n1, ix0, ix1, value;

    n0 = dotGridGradient(x0, y0, x, y);
    n1 = dotGridGradient(x1, y0, x, y);
    ix0 = interpolate(n0, n1, sx);

    n0 = dotGridGradient(x0, y1, x, y);
    n1 = dotGridGradient(x1, y1, x, y);
    ix1 = interpolate(n0, n1, sx);

    value = interpolate(ix0, ix1, sy);
    return value;
}

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
        return vec4(vec3(1.0 - perlin(V_UV.x + Time, V_UV.y + Time)), 1.0);
    }
}

void main(void)
{
    OutColour = Colour() * V_Colour * vec4(vec3(1.0), U_Material.Alpha);
}`,
        input: []
    }
}