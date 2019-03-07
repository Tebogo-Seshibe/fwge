import FWGE from '../FWGE'
import Shader, { Shaders } from '../Shader/Shader'
import GameObject from '../GameObject'
import ModelView from './ModelView'
import Mesh from './Mesh'
import ShaderAttributes from '../Shader/ShaderAttributes'
import Matrix4 from '../Maths/Matrix4'
import ShaderUniforms from '../Shader/ShaderUniforms'
import RenderMaterial from './RenderMaterial'
import AmbientLight from '../Light/AmbientLight'
import DirectionalLight from '../Light/DirectionalLight'
import PointLight from '../Light/PointLight'
import Matrix3 from '../Maths/Matrix3'
import Projection from './Projection'

export default class Renderer
{
    public static Render(): void
    {
        Renderer.ClearBuffers();

        for (var  i = 0, arr = Objects; i < arr.length; ++i)
        {
            Renderer.SetGlobalUniforms();
            Renderer.RenderObject(arr[i]);
        }

        //Renderer.FinalDraw();
    }
    
    public static Init(): void
    {
        Renderer.WireframeShader = new Shader(Renderer.WireframeShader);    Shaders.pop();
        Renderer.CombinedShader = new Shader(Renderer.CombinedShader);      Shaders.pop();

        FWGE.GL.enable(FWGE.GL.DEPTH_TEST);
        FWGE.GL.disable(FWGE.GL.BLEND);
    }
    
    public static ClearBuffers(): void
    {
        var i = Shaders.length;
        while (--i >= 0)
        {
            var shader = Shaders[i];

            FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, shader.FrameBuffer);
            FWGE.GL.viewport(0, 0, shader.Width, shader.Height);
            FWGE.GL.clear(FWGE.GL.COLOR_BUFFER_BIT | FWGE.GL.DEPTH_BUFFER_BIT);
        }
        
        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
        FWGE.GL.viewport(0, 0, FWGE.GL.drawingBufferWidth, FWGE.GL.drawingBufferHeight);
        FWGE.GL.clear(FWGE.GL.COLOR_BUFFER_BIT | FWGE.GL.DEPTH_BUFFER_BIT);
    }
    
    public static RenderObject(gameObject: GameObject): void
    {
        ModelView.Push();
        ModelView.Transform(gameObject.Transform);
        var mv = new Float32Array(ModelView.Peek().Buffer);

        for (var i = 0; i < gameObject.Children.length; ++i)
            Renderer.RenderObject(gameObject.Children[i]);
        
        if (!!gameObject.Mesh && !!gameObject.Material && !!gameObject.Material.Shader)
        {
            var shader = gameObject.Material.Shader;

            FWGE.GL.useProgram(shader.Program);
            
            FWGE.GL.enableVertexAttribArray(shader.Attributes.Position);
            if (shader.Attributes.Normal !== -1) FWGE.GL.enableVertexAttribArray(shader.Attributes.Normal);
            if (shader.Attributes.Colour !== -1) FWGE.GL.enableVertexAttribArray(shader.Attributes.Colour);
            if (shader.Attributes.UV !== -1) FWGE.GL.enableVertexAttribArray(shader.Attributes.UV);

            if (gameObject.Material.Alpha !== 1.0)
            {
                FWGE.GL.enable(FWGE.GL.BLEND);
                FWGE.GL.disable(FWGE.GL.DEPTH_TEST);
                FWGE.GL.blendFunc(FWGE.GL.SRC_ALPHA, FWGE.GL.ONE);
            }
            
            Renderer.BindAttributes(gameObject.Mesh, shader.Attributes);
            Renderer.SetObjectUniforms(gameObject.Material, shader.Uniforms, mv);
            Renderer.Draw(gameObject.Mesh.VertexCount, shader.FrameBuffer);
            if (!!gameObject.Mesh.WireframeBuffer && gameObject.Mesh.DrawWireframe) Renderer.DrawWireframe(gameObject.Mesh, mv);
            
            if (gameObject.Material.Alpha !== 1.0)
            {
                FWGE.GL.enable(FWGE.GL.DEPTH_TEST);
                FWGE.GL.disable(FWGE.GL.BLEND);
            }
    
            FWGE.GL.disableVertexAttribArray(shader.Attributes.Position);
            if (shader.Attributes.Normal !== -1) FWGE.GL.disableVertexAttribArray(shader.Attributes.Normal);
            if (shader.Attributes.Colour !== -1) FWGE.GL.disableVertexAttribArray(shader.Attributes.Colour);
            if (shader.Attributes.UV !== -1) FWGE.GL.disableVertexAttribArray(shader.Attributes.UV);

            FWGE.GL.useProgram(null);
        }
            
        ModelView.Pop();
    }
    
    private static BindAttributes(mesh: Mesh, attributes: ShaderAttributes): void
    {
        FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.PositionBuffer);
        FWGE.GL.vertexAttribPointer(attributes.Position, 3, FWGE.GL.FLOAT, false, 0, 0);
        
        if (attributes.UV !== -1)
        {
            if (!!mesh.UVBuffer)
            {
                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.UVBuffer);
                FWGE.GL.vertexAttribPointer(attributes.UV, 2, FWGE.GL.FLOAT, false, 0, 0);
            }
            else
                FWGE.GL.disableVertexAttribArray(attributes.UV);
        }
        
        if (attributes.Colour !== -1)
        {
            if (!!mesh.ColourBuffer)
            {
                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.ColourBuffer);
                FWGE.GL.vertexAttribPointer(attributes.Colour, 3, FWGE.GL.FLOAT, false, 0, 0);                            
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
        FWGE.GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, Renderer.CalculateNormalMatrix().Buffer);

        FWGE.GL.uniform4fv(uniforms.Material.Ambient, material.Ambient.Buffer);
        FWGE.GL.uniform4fv(uniforms.Material.Diffuse, material.Diffuse.Buffer);
        FWGE.GL.uniform4fv(uniforms.Material.Specular, material.Specular.Buffer);
        FWGE.GL.uniform1f(uniforms.Material.Shininess, material.Shininess);
        FWGE.GL.uniform1f(uniforms.Material.Alpha, material.Alpha);
    
        if (!!material.ImageMap)
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
            FWGE.GL.uniform1i(uniforms.Material.HasImage, 0);
        }
        
        if (!!material.BumpMap)
        {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE1);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, material.BumpMap);
            FWGE.GL.uniform1i(uniforms.Material.HasBump, 1);
            FWGE.GL.uniform1i(uniforms.Sampler.Bump, 1);
        }
        else
        {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE1);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
            FWGE.GL.uniform1i(uniforms.Material.HasBump, 0);
        }
        
        if (!!material.SpecularMap)
        {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE2);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, material.SpecularMap);
            FWGE.GL.uniform1i(uniforms.Material.HasSpecular, 1);
            FWGE.GL.uniform1i(uniforms.Sampler.Specular, 2);
        }
        else
        {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE2);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
            FWGE.GL.uniform1i(uniforms.Material.HasBump, 0);
        }
    }
    
    private static SetGlobalUniforms(): void
    {
        var i = Shaders.length;
        while (--i >= 0)
        {
            var point_count = 0;
            
            FWGE.GL.useProgram(Shaders[i].Program);
            var uniforms = Shaders[i].Uniforms.Light;
            
            for (var j = 0; j < Lights.length; ++j)
            {
                var light = Lights[j];
                
                if (light instanceof AmbientLight)
                {
                    FWGE.GL.uniform4fv(uniforms.Ambient.Colour, light.Colour.Buffer);
                    FWGE.GL.uniform1f(uniforms.Ambient.Intensity, light.Intensity);
                }
                else if (light instanceof DirectionalLight)
                {
                    FWGE.GL.uniform4fv(uniforms.Directional.Colour, light.Colour.Buffer);
                    FWGE.GL.uniform1f(uniforms.Directional.Intensity, light.Intensity);
                    FWGE.GL.uniform3fv(uniforms.Directional.Direction, light.Direction.Buffer);
                }
                else if (light instanceof PointLight)
                {
                    FWGE.GL.uniform4fv(uniforms.Point[point_count].Colour, light.Colour.Buffer);
                    FWGE.GL.uniform1f(uniforms.Point[point_count].Intensity, light.Intensity);
                    FWGE.GL.uniform3fv(uniforms.Point[point_count].Position, light.Position.Buffer);
                    FWGE.GL.uniform1f(uniforms.Point[point_count].Radius, light.Radius);
                    FWGE.GL.uniform1f(uniforms.Point[point_count].Angle, light.Angle);

                    point_count++;
                }
            }

            FWGE.GL.uniform1i(uniforms.PointCount, point_count);
            
            // SET UNIFORM FOR NUMBER OF POINT LIGHTS
            FWGE.GL.uniformMatrix4fv(Shaders[i].Uniforms.Matrix.Projection, false, Projection.ViewerMatrix.Buffer);
        }
        
        FWGE.GL.useProgram(null);
    }
    
    CalculateNormalMatrix(): Matrix3
    {
        let mat = new Matrix4(ModelView.Peek());

        return new Matrix3(mat.Inverse())
        /*(
            mat.M11, mat.M21, mat.M31,
            mat.M12, mat.M22, mat.M32,
            mat.M13, mat.M23, mat.M33
        );*/
    }
    
    private static Draw(vertexCount: number, framebuffer: WebGLRenderbuffer): void
    {
        //FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, framebuffer);
        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
        FWGE.GL.drawElements(FWGE.GL.TRIANGLES, vertexCount, FWGE.GL.UNSIGNED_SHORT, 0);
        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
    }
    
    /*private static DrawWireframe(mesh: Mesh, mv: Matrix4): void
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