import { GL } from '../FWGE';
import Camera from '../Logic/Camera/Camera';
import GameObject, { GameObjects } from '../Logic/GameObject';
import AmbientLight, { AmbientLights } from '../Logic/Light/AmbientLight';
import DirectionalLight, { DirectionalLights } from '../Logic/Light/DirectionalLight';
import LightItem from '../Logic/Light/LightItem';
import PointLight, { PointLights } from '../Logic/Light/PointLight';
import Material from '../Logic/Material';
import Matrix3 from '../Logic/Maths/Matrix3';
import Matrix4 from '../Logic/Maths/Matrix4';
import Mesh from '../Logic/Mesh';
import ParticleSystem, { ParticleSystems } from '../Logic/Particle System/ParticleSystem';
import ShaderAttributes from '../Logic/Shader/Instance/ShaderAttributes';
import ShaderUniforms from '../Logic/Shader/Instance/ShaderUniforms';
import Shader, { Shaders } from '../Logic/Shader/Shader';
import List from '../Logic/Utility/List';
import ModelView from './ModelView';

export type ActiveShader =
{
    Shader: Shader
    GameObject: GameObject[]
}

export const ActiveShaders: ActiveShader[] = []

type Renderable = 
{
    mesh: Mesh
    material: Material
    shader: Shader
    modelView: Matrix4
}

export function InitRender(): void
{
    GL.enable(GL.DEPTH_TEST)
    GL.disable(GL.BLEND)
    GL.blendFunc(GL.SRC_ALPHA, GL.ONE)
}

export function UpdateRender(): void
{
    ClearBuffers()
    SetGlobalUniforms()
    
    for (let gameObject of GameObjects)
    {
        Render(gameObject)
    }
    
    for (let particleSystem of ParticleSystems)
    {
        Render(particleSystem)
    }
}

function ClearBuffers(): void
{
    for (let shader of Shaders)
    {
        GL.bindFramebuffer(GL.FRAMEBUFFER, shader.FrameBuffer)
        GL.viewport(0, 0, shader.Width, shader.Height)
        GL.clearColor(shader.Clear[0], shader.Clear[1], shader.Clear[2], shader.Clear[3])
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)
    }
    
    GL.bindFramebuffer(GL.FRAMEBUFFER, null)
    GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)
}

function Render(particleSystem: ParticleSystem): void
function Render(gameObject: GameObject): void
function Render(item: ParticleSystem | GameObject): void
{
    if (item instanceof ParticleSystem)
    {
        for (var particle of item.Particles)
        {
            ModelView.Push(particle)

            RenderObject(
            {
                material: item.Material,
                mesh: item.Mesh,
                shader: item.Material.Shader,
                modelView: ModelView.Pop()
            })
        }
    }
    else if (item instanceof GameObject)
    {
        if (item.Children.length > 0)
        {
            ModelView.Push(item.Transform)
            item.Children.forEach(child => Render(child))
        }

        if (item.Visible)
        {
            ModelView.Push(item.Transform)
            RenderObject(
            {
                material: item.Material,
                mesh: item.Mesh,
                shader: item.Material.Shader,
                modelView: ModelView.Pop()
            })
        }
    }
}

function RenderObject({ mesh, material, shader, modelView }: Renderable): void
{
    GL.useProgram(shader.Program)
    
    GL.enableVertexAttribArray(shader.Attributes.Position)
    if (shader.Attributes.Normal !== -1) 
    {
        GL.enableVertexAttribArray(shader.Attributes.Normal)
    }
    if (shader.Attributes.Colour !== -1) 
    {
        GL.enableVertexAttribArray(shader.Attributes.Colour)
    }
    if (shader.Attributes.UV !== -1) 
    {
        GL.enableVertexAttribArray(shader.Attributes.UV)
    }

    if (material.Alpha !== 1.0)
    {
        GL.enable(GL.BLEND)
        GL.disable(GL.DEPTH_TEST)
    }
    
    BindAttributes(mesh, shader.Attributes)
    SetObjectUniforms(material, shader.Uniforms, modelView)
    Draw(mesh.VertexCount, shader.FrameBuffer)
    
    if (material.Alpha !== 1.0)
    {
        GL.enable(GL.DEPTH_TEST)
        GL.disable(GL.BLEND)
    }

    GL.disableVertexAttribArray(shader.Attributes.Position)
    if (shader.Attributes.Normal !== -1)
    {
        GL.disableVertexAttribArray(shader.Attributes.Normal)
    }
    if (shader.Attributes.Colour !== -1)
    {
        GL.disableVertexAttribArray(shader.Attributes.Colour)
    }
    if (shader.Attributes.UV !== -1)
    {
        GL.disableVertexAttribArray(shader.Attributes.UV)
    }

    GL.useProgram(null)
}

function BindEmptyAttributes(shader: Shader): void
{

}

function BindAttributes(mesh: Mesh, attributes: ShaderAttributes): void
{
    GL.bindBuffer(GL.ARRAY_BUFFER, mesh.PositionBuffer)
    GL.vertexAttribPointer(attributes.Position, 3, GL.FLOAT, false, 0, 0)
    
    if (attributes.UV !== -1)
    {
        if (mesh.UVBuffer)
        {
            GL.bindBuffer(GL.ARRAY_BUFFER, mesh.UVBuffer)
            GL.vertexAttribPointer(attributes.UV, 2, GL.FLOAT, false, 0, 0)
        }
        else
        {
            GL.disableVertexAttribArray(attributes.UV)
        }
    }
    
    if (attributes.Colour !== -1)
    {
        if (mesh.ColourBuffer)
        {
            GL.bindBuffer(GL.ARRAY_BUFFER, mesh.ColourBuffer)
            GL.vertexAttribPointer(attributes.Colour, 4, GL.FLOAT, false, 0, 0)
        }
        else
        {
            GL.disableVertexAttribArray(attributes.Colour)
        }
    }
    
    if (attributes.Normal !== -1)
    {
        if (!!mesh.NormalBuffer)
        {
            GL.bindBuffer(GL.ARRAY_BUFFER, mesh.NormalBuffer)
            GL.vertexAttribPointer(attributes.Normal, 3, GL.FLOAT, false, 0, 0)
        }
        else
        {
            GL.disableVertexAttribArray(attributes.Normal)
        }
    }
    
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer)
}

function SetObjectUniforms(material: Material, uniforms: ShaderUniforms, mv: Matrix4): void
{
    GL.uniformMatrix4fv(uniforms.Matrix.ModelView, false, mv)
    GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, new Matrix3(mv.Clone().Inverse()))

    GL.uniform4fv(uniforms.Material.Ambient, material.Ambient)
    GL.uniform4fv(uniforms.Material.Diffuse, material.Diffuse)
    GL.uniform4fv(uniforms.Material.Specular, material.Specular)
    GL.uniform1f(uniforms.Material.Shininess, material.Shininess)
    GL.uniform1f(uniforms.Material.Alpha, material.Alpha)

    if (material.ImageMap)
    {
        GL.activeTexture(GL.TEXTURE0)
        GL.bindTexture(GL.TEXTURE_2D, material.ImageMap)
        GL.uniform1i(uniforms.Material.HasImage, 1)
        GL.uniform1i(uniforms.Sampler.Image, 0)
    }
    else
    {
        GL.activeTexture(GL.TEXTURE0)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.uniform1i(uniforms.Material.HasImage, 0)
    }
    
    if (material.BumpMap)
    {
        GL.activeTexture(GL.TEXTURE1)
        GL.bindTexture(GL.TEXTURE_2D, material.BumpMap)
        GL.uniform1i(uniforms.Material.HasBump, 1)
        GL.uniform1i(uniforms.Sampler.Bump, 1)
    }
    else
    {
        GL.activeTexture(GL.TEXTURE1)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.uniform1i(uniforms.Material.HasBump, 0)
    }
    
    if (material.SpecularMap)
    {
        GL.activeTexture(GL.TEXTURE2)
        GL.bindTexture(GL.TEXTURE_2D, material.SpecularMap)
        GL.uniform1i(uniforms.Material.HasSpecular, 1)
        GL.uniform1i(uniforms.Sampler.Specular, 2)
    }
    else
    {
        GL.activeTexture(GL.TEXTURE2)
        GL.bindTexture(GL.TEXTURE_2D, null)
        GL.uniform1i(uniforms.Material.HasBump, 0)
    }
}

function SetGlobalUniforms(): void
{
    var i = Shaders.length
    let Lights = new List<LightItem>([].concat(AmbientLights.ToArray(), DirectionalLights.ToArray(), PointLights.ToArray()))

    for (let shader of Shaders)
    {
        GL.useProgram(shader.Program)
        
        let point_count = 0
        let matrix = shader.Uniforms.Matrix
        let uniforms = shader.Uniforms.Light
        
        for (let light of Lights)
        {                
            if (light instanceof AmbientLight)
            {
                GL.uniform4fv(uniforms.Ambient.Colour, light.Colour)
                GL.uniform1f(uniforms.Ambient.Intensity, light.Intensity)
            }
            else if (light instanceof DirectionalLight)
            {
                GL.uniform4fv(uniforms.Directional.Colour, light.Colour)
                GL.uniform1f(uniforms.Directional.Intensity, light.Intensity)
                GL.uniform3fv(uniforms.Directional.Direction, light.Direction)
            }
            else if (light instanceof PointLight)
            {
                GL.uniform4fv(uniforms.Point[point_count].Colour, light.Colour)
                GL.uniform1f(uniforms.Point[point_count].Intensity, light.Intensity)
                GL.uniform3fv(uniforms.Point[point_count].Position, light.Position)
                GL.uniform1f(uniforms.Point[point_count].Radius, light.Radius)
                GL.uniform1f(uniforms.Point[point_count].Angle, light.Angle)

                ++point_count
            }
        }

        let main = Camera.Main

        GL.uniform1i(uniforms.PointCount, point_count)
        GL.uniformMatrix4fv(matrix.Projection, false, main.ProjectionMatrix)
    }
    
    GL.useProgram(null)
}

function Draw(vertexCount: number, framebuffer: WebGLRenderbuffer): void
{
    GL.bindFramebuffer(GL.FRAMEBUFFER, null)
    GL.drawElements(GL.TRIANGLES, vertexCount, GL.UNSIGNED_BYTE, 0)
    GL.bindFramebuffer(GL.FRAMEBUFFER, null)
}

function SetUniforms(shader: Shader, fields: Map<string, any>): void
{
    for (const [name, field] of fields)
    {
        let { type, index } = shader.UserUniforms.get(name)

        switch (type)
        {
            case 'bool':
            case 'int':
            case 'uint':
                GL.uniform1i(index, field)

            case 'float':
                GL.uniform1f(index, field)

            case 'bvec2':
            case 'ivec2':
            case 'uvec2':
                GL.uniform2iv(index, field)
                
            case 'bvec3':
            case 'ivec3':
            case 'uvec3':
                GL.uniform3iv(index, field)
                
            case 'bvec4':
            case 'ivec4':
            case 'uvec4':
                GL.uniform4iv(index, field)

            case 'vec2':
                GL.uniform2fv(index, field)

            case 'vec3':
                GL.uniform3fv(index, field)
                
            case 'vec4':
                GL.uniform4fv(index, field)
            
            case 'mat2':
                GL.uniformMatrix2fv(index, false, field)
                
            case 'mat3':
                GL.uniformMatrix3fv(index, false, field)
                    
            case 'mat4':
                GL.uniformMatrix4fv(index, false, field)
        }
    }
}
