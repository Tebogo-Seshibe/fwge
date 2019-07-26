import AmbientLight from '../Light/AmbientLight';
import DirectionalLight from '../Light/DirectionalLight';
import FWGE from '../FWGE';
import GameObject, { GameObjects } from '../GameObject';
import { AmbientLights, DirectionalLights, PointLights } from '../Light/Light';
import ModelView from './ModelView';
import Matrix3 from '../Maths/Matrix3';
import PointLight from '../Light/PointLight';
import Projection from './Projection';
import { Shaders } from '../Shader/Shader';
import Camera from '../Camera/Camera';
import ParticleSystem, { ParticleSystems } from '../ParticleSystem';
import List from '../Utility/List';
export default class Renderer {
    static Init() {
        FWGE.GL.enable(FWGE.GL.DEPTH_TEST);
        FWGE.GL.disable(FWGE.GL.BLEND);
        FWGE.GL.blendFunc(FWGE.GL.SRC_ALPHA, FWGE.GL.ONE);
    }
    static Update() {
        Renderer.ClearBuffers();
        Renderer.SetGlobalUniforms();
        for (let gameObject of GameObjects) {
            this.Render(gameObject);
        }
        for (let particleSystem of ParticleSystems) {
            this.Render(particleSystem);
        }
    }
    static ClearBuffers() {
        for (let shader of Shaders) {
            FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, shader.FrameBuffer);
            FWGE.GL.viewport(0, 0, shader.Width, shader.Height);
            FWGE.GL.clear(FWGE.GL.COLOR_BUFFER_BIT | FWGE.GL.DEPTH_BUFFER_BIT);
        }
        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
        FWGE.GL.viewport(0, 0, FWGE.GL.drawingBufferWidth, FWGE.GL.drawingBufferHeight);
        FWGE.GL.clear(FWGE.GL.COLOR_BUFFER_BIT | FWGE.GL.DEPTH_BUFFER_BIT);
    }
    static Render(item) {
        if (item instanceof ParticleSystem) {
            for (var particle of item.Particles) {
                ModelView.Push(particle);
                this.RenderObject({
                    material: item.Material,
                    mesh: item.Mesh
                });
            }
        }
        else if (item instanceof GameObject) {
            if (item.Children.length > 0) {
                ModelView.Push(item.Transform);
                item.Children.forEach(child => this.Render(child));
            }
            ModelView.Push(item.Transform);
            this.RenderObject({
                material: item.Material,
                mesh: item.Mesh
            });
        }
    }
    static RenderObject({ mesh, material }) {
        let modelView = ModelView.Pop();
        let shader = material.Shader;
        FWGE.GL.useProgram(shader.Program);
        FWGE.GL.enableVertexAttribArray(shader.Attributes.Position);
        if (shader.Attributes.Normal !== -1) {
            FWGE.GL.enableVertexAttribArray(shader.Attributes.Normal);
        }
        if (shader.Attributes.Colour !== -1) {
            FWGE.GL.enableVertexAttribArray(shader.Attributes.Colour);
        }
        if (shader.Attributes.UV !== -1) {
            FWGE.GL.enableVertexAttribArray(shader.Attributes.UV);
        }
        if (material.Alpha !== 1.0) {
            FWGE.GL.enable(FWGE.GL.BLEND);
            FWGE.GL.disable(FWGE.GL.DEPTH_TEST);
        }
        Renderer.BindAttributes(mesh, shader.Attributes);
        Renderer.SetObjectUniforms(material, shader.Uniforms, modelView);
        Renderer.Draw(mesh.VertexCount, shader.FrameBuffer);
        if (material.Alpha !== 1.0) {
            FWGE.GL.enable(FWGE.GL.DEPTH_TEST);
            FWGE.GL.disable(FWGE.GL.BLEND);
        }
        FWGE.GL.disableVertexAttribArray(shader.Attributes.Position);
        if (shader.Attributes.Normal !== -1) {
            FWGE.GL.disableVertexAttribArray(shader.Attributes.Normal);
        }
        if (shader.Attributes.Colour !== -1) {
            FWGE.GL.disableVertexAttribArray(shader.Attributes.Colour);
        }
        if (shader.Attributes.UV !== -1) {
            FWGE.GL.disableVertexAttribArray(shader.Attributes.UV);
        }
        FWGE.GL.useProgram(null);
    }
    static BindAttributes(mesh, attributes) {
        FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.PositionBuffer);
        FWGE.GL.vertexAttribPointer(attributes.Position, 3, FWGE.GL.FLOAT, false, 0, 0);
        if (attributes.UV !== -1) {
            if (mesh.UVBuffer) {
                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.UVBuffer);
                FWGE.GL.vertexAttribPointer(attributes.UV, 2, FWGE.GL.FLOAT, false, 0, 0);
            }
            else
                FWGE.GL.disableVertexAttribArray(attributes.UV);
        }
        if (attributes.Colour !== -1) {
            if (mesh.ColourBuffer) {
                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.ColourBuffer);
                FWGE.GL.vertexAttribPointer(attributes.Colour, 3, FWGE.GL.FLOAT, false, 0, 0);
            }
            else
                FWGE.GL.disableVertexAttribArray(attributes.Colour);
        }
        if (attributes.Normal !== -1) {
            if (!!mesh.NormalBuffer) {
                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.NormalBuffer);
                FWGE.GL.vertexAttribPointer(attributes.Normal, 3, FWGE.GL.FLOAT, false, 0, 0);
            }
            else
                FWGE.GL.disableVertexAttribArray(attributes.Normal);
        }
        FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);
    }
    static SetObjectUniforms(material, uniforms, mv) {
        FWGE.GL.uniformMatrix4fv(uniforms.Matrix.ModelView, false, mv);
        FWGE.GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, new Matrix3(mv.Clone().Inverse()));
        FWGE.GL.uniform4fv(uniforms.Material.Ambient, material.Ambient);
        FWGE.GL.uniform4fv(uniforms.Material.Diffuse, material.Diffuse);
        FWGE.GL.uniform4fv(uniforms.Material.Specular, material.Specular);
        FWGE.GL.uniform1f(uniforms.Material.Shininess, material.Shininess);
        FWGE.GL.uniform1f(uniforms.Material.Alpha, material.Alpha);
        if (material.ImageMap) {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE0);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, material.ImageMap);
            FWGE.GL.uniform1i(uniforms.Material.HasImage, 1);
            FWGE.GL.uniform1i(uniforms.Sampler.Image, 0);
        }
        else {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE0);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
            FWGE.GL.uniform1i(uniforms.Material.HasImage, 0);
        }
        if (material.BumpMap) {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE1);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, material.BumpMap);
            FWGE.GL.uniform1i(uniforms.Material.HasBump, 1);
            FWGE.GL.uniform1i(uniforms.Sampler.Bump, 1);
        }
        else {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE1);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
            FWGE.GL.uniform1i(uniforms.Material.HasBump, 0);
        }
        if (material.SpecularMap) {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE2);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, material.SpecularMap);
            FWGE.GL.uniform1i(uniforms.Material.HasSpecular, 1);
            FWGE.GL.uniform1i(uniforms.Sampler.Specular, 2);
        }
        else {
            FWGE.GL.activeTexture(FWGE.GL.TEXTURE2);
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
            FWGE.GL.uniform1i(uniforms.Material.HasBump, 0);
        }
    }
    static SetGlobalUniforms() {
        var i = Shaders.length;
        let Lights = new List(...AmbientLights, ...DirectionalLights, ...PointLights);
        for (let shader of Shaders) {
            FWGE.GL.useProgram(shader.Program);
            let point_count = 0;
            let matrix = shader.Uniforms.Matrix;
            let uniforms = shader.Uniforms.Light;
            for (let light of Lights) {
                if (light instanceof AmbientLight) {
                    FWGE.GL.uniform4fv(uniforms.Ambient.Colour, light.Colour);
                    FWGE.GL.uniform1f(uniforms.Ambient.Intensity, light.Intensity);
                }
                else if (light instanceof DirectionalLight) {
                    FWGE.GL.uniform4fv(uniforms.Directional.Colour, light.Colour);
                    FWGE.GL.uniform1f(uniforms.Directional.Intensity, light.Intensity);
                    FWGE.GL.uniform3fv(uniforms.Directional.Direction, light.Direction);
                }
                else if (light instanceof PointLight) {
                    FWGE.GL.uniform4fv(uniforms.Point[point_count].Colour, light.Colour);
                    FWGE.GL.uniform1f(uniforms.Point[point_count].Intensity, light.Intensity);
                    FWGE.GL.uniform3fv(uniforms.Point[point_count].Position, light.Position);
                    FWGE.GL.uniform1f(uniforms.Point[point_count].Radius, light.Radius);
                    FWGE.GL.uniform1f(uniforms.Point[point_count].Angle, light.Angle);
                    point_count++;
                }
            }
            let main = Camera.Main;
            FWGE.GL.uniform1i(uniforms.PointCount, point_count);
            FWGE.GL.uniformMatrix4fv(matrix.Projection, false, Projection.Perspective(main.FieldOfView, main.AspectRatio, main.NearClipping, main.FarClipping));
        }
        FWGE.GL.useProgram(null);
    }
    static Draw(vertexCount, framebuffer) {
        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
        FWGE.GL.drawElements(FWGE.GL.TRIANGLES, vertexCount, FWGE.GL.UNSIGNED_BYTE, 0);
        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
    }
}
//# sourceMappingURL=Renderer.js.map