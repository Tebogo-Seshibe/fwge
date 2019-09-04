import Camera from '../Camera/Camera';
import GameObject, { GameObjects } from '../GameObject';
import AmbientLight, { AmbientLights } from '../Light/AmbientLight';
import DirectionalLight, { DirectionalLights } from '../Light/DirectionalLight';
import LightItem from '../Light/LightItem';
import PointLight, { PointLights } from '../Light/PointLight';
import Matrix3 from '../Maths/Matrix3';
import Matrix4 from '../Maths/Matrix4';
import ParticleSystem, { ParticleSystems } from '../Particle System/ParticleSystem';
import ShaderAttributes from '../Shader/Instance/ShaderAttributes';
import ShaderUniforms from '../Shader/Instance/ShaderUniforms';
import Shader, { Shaders } from '../Shader/Shader';
import { GL } from '../Utility/Control';
import List from '../Utility/List';
import Mesh from './Mesh';
import ModelView from './ModelView';
import RenderMaterial from './RenderMaterial';

type Renderable = 
{
    mesh: Mesh
    material: RenderMaterial
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
            GL.vertexAttribPointer(attributes.Colour, 3, GL.FLOAT, false, 0, 0)
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

function SetObjectUniforms(material: RenderMaterial, uniforms: ShaderUniforms, mv: Matrix4): void
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
    //GL.bindFramebuffer(GL.FRAMEBUFFER, framebuffer)
    GL.bindFramebuffer(GL.FRAMEBUFFER, null)
    GL.drawElements(GL.TRIANGLES, vertexCount, GL.UNSIGNED_BYTE, 0)
    GL.bindFramebuffer(GL.FRAMEBUFFER, null)
}

/*function DrawWirefra0me(mesh: Mesh, mv: Matrix4): void
{
    GL.useProgram(WireframeShader.Program)
    
    GL.bindBuffer(GL.ARRAY_BUFFER, mesh.PositionBuffer)
    GL.vertexAttribPointer(WireframeShader.Attributes.Position, 3, GL.FLOAT, false, 0, 0)
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.WireframeBuffer)
    
    GL.uniformMatrix4fv(WireframeShader.Uniforms.Matrix.ModelView, false, mv)
    GL.uniformMatrix4fv(WireframeShader.Uniforms.Matrix.Projection, false, Projection.ViewerMatrix.Buffer)
    //GL.bindFramebuffer(GL.FRAMEBUFFER, framebuffer)
    GL.bindFramebuffer(GL.FRAMEBUFFER, null)
    GL.drawElements(GL.LINES, mesh.WireframeCount, GL.UNSIGNED_SHORT, 0)
    GL.bindFramebuffer(GL.FRAMEBUFFER, null)
    GL.useProgram(null)
}*/