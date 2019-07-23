import AmbientLight, { AmbientLights } from '../Light/AmbientLight'
import DirectionalLight, { DirectionalLights } from '../Light/DirectionalLight'
import FWGE from '../FWGE'
import GameObject, { GameObjects } from '../GameObject'
import ModelView from './ModelView'
import Matrix3 from '../Maths/Matrix3'
import Mesh from './Mesh'
import Matrix4 from '../Maths/Matrix4'
import PointLight, { PointLights } from '../Light/PointLight'
import Projection from './Projection'
import RenderMaterial from './RenderMaterial'
import Shader, { Shaders } from '../Shader/Shader'
import ShaderUniforms from '../Shader/ShaderUniforms'
import ShaderAttributes from '../Shader/ShaderAttributes'
import Camera from '../Camera/Camera';
import ParticleSystem, { ParticleSystems } from '../ParticleSystem';
import Transform from '../Transform';
import LightItem from '../Light/LightItem';
import List from '../Utility/List';

type Renderable = 
{
    mesh: Mesh
    material: RenderMaterial
}

export default class Renderer
{
    public static Init(): void
    {
        /*Renderer.WireframeShader = new Shader(Renderer.WireframeShader);    Shaders.pop();
        Renderer.CombinedShader = new Shader(Renderer.CombinedShader);      Shaders.pop();*/

        FWGE.GL.enable(FWGE.GL.DEPTH_TEST);
        FWGE.GL.disable(FWGE.GL.BLEND);
        FWGE.GL.blendFunc(FWGE.GL.SRC_ALPHA, FWGE.GL.ONE);
    }
    
    public static Update():void
    {
        Renderer.ClearBuffers()
        Renderer.SetGlobalUniforms()
        
        for (let gameObject of GameObjects)
        {
            this.Render(gameObject)
        }
        
        for (let particleSystem of ParticleSystems)
        {
            this.Render(particleSystem)
        }
    }

    public static ClearBuffers(): void
    {
        for (let shader of Shaders)
        {

            FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, shader.FrameBuffer);
            FWGE.GL.viewport(0, 0, shader.Width, shader.Height);
            FWGE.GL.clear(FWGE.GL.COLOR_BUFFER_BIT | FWGE.GL.DEPTH_BUFFER_BIT);
        }
        
        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
        FWGE.GL.viewport(0, 0, FWGE.GL.drawingBufferWidth, FWGE.GL.drawingBufferHeight);
        FWGE.GL.clear(FWGE.GL.COLOR_BUFFER_BIT | FWGE.GL.DEPTH_BUFFER_BIT);
    }
    
    private static Render(particleSystem: ParticleSystem):void
    private static Render(gameObject: GameObject):void
    private static Render(item: ParticleSystem | GameObject):void
    {
        if (item instanceof ParticleSystem)
        {
            for (var particle of item.Particles)
            {
                ModelView.Push(particle)

                this.RenderObject(
                {
                    material: item.Material,
                    mesh: item.Mesh
                })
            }

        }
        else if (item instanceof GameObject)
        {
            if (item.Children.length > 0)
            {
                ModelView.Push(item.Transform)
                item.Children.forEach(child => this.Render(child))
            }

            ModelView.Push(item.Transform)
            this.RenderObject(
            {
                material: item.Material,
                mesh: item.Mesh
            })
        }
    }
    
    private static RenderObject({ mesh, material }: Renderable): void
    {
        let modelView: Matrix4 = ModelView.Pop()
        let shader: Shader = material.Shader;

        FWGE.GL.useProgram(shader.Program);
        
        FWGE.GL.enableVertexAttribArray(shader.Attributes.Position);
        if (shader.Attributes.Normal !== -1) 
        {
            FWGE.GL.enableVertexAttribArray(shader.Attributes.Normal)
        }
        if (shader.Attributes.Colour !== -1) 
        {
            FWGE.GL.enableVertexAttribArray(shader.Attributes.Colour)
        }
        if (shader.Attributes.UV !== -1) 
        {
            FWGE.GL.enableVertexAttribArray(shader.Attributes.UV)
        }

        if (material.Alpha !== 1.0)
        {
            FWGE.GL.enable(FWGE.GL.BLEND);
            FWGE.GL.disable(FWGE.GL.DEPTH_TEST);
        }
        
        Renderer.BindAttributes(mesh, shader.Attributes)
        Renderer.SetObjectUniforms(material, shader.Uniforms, modelView)
        Renderer.Draw(mesh.VertexCount, shader.FrameBuffer)
        
        if (material.Alpha !== 1.0)
        {
            FWGE.GL.enable(FWGE.GL.DEPTH_TEST);
            FWGE.GL.disable(FWGE.GL.BLEND);
        }

        FWGE.GL.disableVertexAttribArray(shader.Attributes.Position);
        if (shader.Attributes.Normal !== -1)
        {
            FWGE.GL.disableVertexAttribArray(shader.Attributes.Normal)
        }
        if (shader.Attributes.Colour !== -1)
        {
            FWGE.GL.disableVertexAttribArray(shader.Attributes.Colour)
        }
        if (shader.Attributes.UV !== -1)
        {
            FWGE.GL.disableVertexAttribArray(shader.Attributes.UV)
        }

        FWGE.GL.useProgram(null);
    }
    
    private static BindAttributes(mesh: Mesh, attributes: ShaderAttributes): void
    {
        FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.PositionBuffer)
        FWGE.GL.vertexAttribPointer(attributes.Position, 3, FWGE.GL.FLOAT, false, 0, 0)
        
        if (attributes.UV !== -1)
        {
            if (mesh.UVBuffer)
            {
                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.UVBuffer)
                FWGE.GL.vertexAttribPointer(attributes.UV, 2, FWGE.GL.FLOAT, false, 0, 0)
            }
            else
                FWGE.GL.disableVertexAttribArray(attributes.UV);
        }
        
        if (attributes.Colour !== -1)
        {
            if (mesh.ColourBuffer)
            {
                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.ColourBuffer)
                FWGE.GL.vertexAttribPointer(attributes.Colour, 3, FWGE.GL.FLOAT, false, 0, 0)
            }
            else
                FWGE.GL.disableVertexAttribArray(attributes.Colour);
        }
        
        if (attributes.Normal !== -1)
        {
            if (!!mesh.NormalBuffer)
            {
                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.NormalBuffer);
                FWGE.GL.vertexAttribPointer(attributes.Normal, 3, FWGE.GL.FLOAT, false, 0, 0);
            }
            else
                FWGE.GL.disableVertexAttribArray(attributes.Normal);
        }
        
        FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);
    }
    
    private static SetObjectUniforms(material: RenderMaterial, uniforms: ShaderUniforms, mv: Matrix4): void
    {
        FWGE.GL.uniformMatrix4fv(uniforms.Matrix.ModelView, false, mv);
        FWGE.GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, new Matrix3(mv.Clone().Inverse()));

        FWGE.GL.uniform4fv(uniforms.Material.Ambient, material.Ambient)
        FWGE.GL.uniform4fv(uniforms.Material.Diffuse, material.Diffuse)
        FWGE.GL.uniform4fv(uniforms.Material.Specular, material.Specular)
        FWGE.GL.uniform1f(uniforms.Material.Shininess, material.Shininess);
        FWGE.GL.uniform1f(uniforms.Material.Alpha, material.Alpha);
    
        if (material.ImageMap)
        {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE0);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, material.ImageMap);
            FWGE.GL.uniform1i(uniforms.Material.HasImage, 1);
            FWGE.GL.uniform1i(uniforms.Sampler.Image, 0);
        }
        else
        {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE0);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
            FWGE.GL.uniform1i(uniforms.Material.HasImage, 0)
        }
        
        if (material.BumpMap)
        {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE1)
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, material.BumpMap)
            FWGE.GL.uniform1i(uniforms.Material.HasBump, 1)
            FWGE.GL.uniform1i(uniforms.Sampler.Bump, 1)
        }
        else
        {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE1)
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null)
            FWGE.GL.uniform1i(uniforms.Material.HasBump, 0)
        }
        
        if (material.SpecularMap)
        {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE2)
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, material.SpecularMap)
            FWGE.GL.uniform1i(uniforms.Material.HasSpecular, 1)
            FWGE.GL.uniform1i(uniforms.Sampler.Specular, 2)
        }
        else
        {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE2)
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null)
            FWGE.GL.uniform1i(uniforms.Material.HasBump, 0)
        }
    }
    
    private static SetGlobalUniforms(): void
    {
        var i = Shaders.length
        let Lights = new List<LightItem>([].concat(AmbientLights.ToArray(), DirectionalLights.ToArray(), PointLights.ToArray()))
        for (let shader of Shaders)
        {
            FWGE.GL.useProgram(shader.Program)
            
            let point_count = 0
            let matrix = shader.Uniforms.Matrix
            let uniforms = shader.Uniforms.Light
            
            for (let light of Lights)
            {                
                if (light instanceof AmbientLight)
                {
                    FWGE.GL.uniform4fv(uniforms.Ambient.Colour, light.Colour)
                    FWGE.GL.uniform1f(uniforms.Ambient.Intensity, light.Intensity)
                }
                else if (light instanceof DirectionalLight)
                {
                    FWGE.GL.uniform4fv(uniforms.Directional.Colour, light.Colour)
                    FWGE.GL.uniform1f(uniforms.Directional.Intensity, light.Intensity)
                    FWGE.GL.uniform3fv(uniforms.Directional.Direction, light.Direction)
                }
                else if (light instanceof PointLight)
                {
                    FWGE.GL.uniform4fv(uniforms.Point[point_count].Colour, light.Colour)
                    FWGE.GL.uniform1f(uniforms.Point[point_count].Intensity, light.Intensity)
                    FWGE.GL.uniform3fv(uniforms.Point[point_count].Position, light.Position)
                    FWGE.GL.uniform1f(uniforms.Point[point_count].Radius, light.Radius)
                    FWGE.GL.uniform1f(uniforms.Point[point_count].Angle, light.Angle)

                    point_count++;
                }
            }

            let main = Camera.Main;

            FWGE.GL.uniform1i(uniforms.PointCount, point_count)
            FWGE.GL.uniformMatrix4fv(matrix.Projection, false, Projection.Perspective(main.FieldOfView, main.AspectRatio, main.NearClipping, main.FarClipping))
        }
        
        FWGE.GL.useProgram(null)
    }
    
    private static Draw(vertexCount: number, framebuffer: WebGLRenderbuffer): void
    {
        //FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, framebuffer);
        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null)
        FWGE.GL.drawElements(FWGE.GL.TRIANGLES, vertexCount, FWGE.GL.UNSIGNED_BYTE, 0)
        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null)
    }
    
    /*private static DrawWirefra0me(mesh: Mesh, mv: Matrix4): void
    {
        FWGE.GL.useProgram(Renderer.WireframeShader.Program);
        
        FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.PositionBuffer);
        FWGE.GL.vertexAttribPointer(Renderer.WireframeShader.Attributes.Position, 3, FWGE.GL.FLOAT, false, 0, 0);
        FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, mesh.WireframeBuffer);
        
        FWGE.GL.uniformMatrix4fv(Renderer.WireframeShader.Uniforms.Matrix.ModelView, false, mv);
        FWGE.GL.uniformMatrix4fv(Renderer.WireframeShader.Uniforms.Matrix.Projection, false, Projection.ViewerMatrix.Buffer);
        //FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, framebuffer);
        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
        FWGE.GL.drawElements(FWGE.GL.LINES, mesh.WireframeCount, FWGE.GL.UNSIGNED_SHORT, 0);
        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
        FWGE.GL.useProgram(null);
    }*/
}