/**
 * @constructor Renderer
 * @description This module handles the actual rendering of the scene to
 *              the screen.
 * @module      FWGE.Render
 */
function Renderer()
{
    var __MODELVIEW__ = new ModelView();
    var __PROJECTION__ = new Projection();

    Object.defineProperties(this,
    {
        Render:
        {
            value: function Render()
            {
                this.ClearBuffers();

                var i = __OBJECT__.length;
                while (--i >= 0)
                {
                    this.SetGlobalUniforms();
                    this.RenderObject(__OBJECT__[i]);

                }
            }
        },

        ClearBuffers:
        {
            value: function ClearBuffers()
            {
                var i = __SHADER__.length;
                while (--i >= 0)
                {
                    GL.bindFramebuffer(GL.FRAMEBUFFER, __SHADER__[i].FrameBuffer);
                    GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
                    GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
                }
                
                GL.bindFramebuffer(GL.FRAMEBUFFER, null);
                GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight);
                GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
            }
        },

        RenderObject:
        {
            value: function RenderObject(object)
            {
                
                __MODELVIEW__.PushMatrix();
                __MODELVIEW__.Transform(object.Transform);
                
                var i = object.Children.length;
                while (--i >= 0)
                    this.RenderObject(object.Children[i]);
                
                if (!!object.Mesh && !!object.RenderMaterial)
                {
                    var shader = object.RenderMaterial.Shader

                    GL.useProgram(shader.Program);
                    
                    GL.enableVertexAttribArray(shader.Attributes.Position);
                    if (shader.Attributes.Normal !== -1) GL.enableVertexAttribArray(shader.Attributes.Normal);
                    if (shader.Attributes.Colour !== -1) GL.enableVertexAttribArray(shader.Attributes.Colour);
                    if (shader.Attributes.UV !== -1) GL.enableVertexAttribArray(shader.Attributes.UV);

                    if (object.RenderMaterial.Alpha !== 1.0)
                    {
                        GL.enable(GL.BLEND);
                        GL.disable(GL.DEPTH_TEST);
                        GL.blendFunc(GL.SRC_ALPHA, GL.ONE);
                    }
                    
                    this.BindAttributes(object.Mesh, object.RenderMaterial, object.RenderMaterial.Shader.Attributes);
                    this.SetObjectUniforms(object.RenderMaterial, object.RenderMaterial.Shader.Uniforms);
                    this.Draw(object.Mesh.VertexCount);
                    
                    if (object.RenderMaterial.Alpha !== 1.0)
                    {
                        GL.enable(GL.DEPTH_TEST);
                        GL.disable(GL.BLEND);
                    }
            
                    GL.disableVertexAttribArray(shader.Attributes.Position);
                    if (shader.Attributes.Normal !== -1) GL.disableVertexAttribArray(shader.Attributes.Normal);
                    if (shader.Attributes.Colour !== -1) GL.disableVertexAttribArray(shader.Attributes.Colour);
                    if (shader.Attributes.UV !== -1) GL.disableVertexAttribArray(shader.Attributes.UV);

                    GL.useProgram(null);
                }
                   
                __MODELVIEW__.PopMatrix();
            }
        },

        BindAttributes:
        {
            value: function BindAttributes(mesh, material, attributes)
            {
                GL.bindBuffer(GL.ARRAY_BUFFER, mesh.PositionBuffer);
                GL.vertexAttribPointer(attributes.Position, 3, GL.FLOAT, false, 0, 0);
                
                if (attributes.UV !== -1)
                {
                    if (!!mesh.UVBuffer)
                    {
                        GL.bindBuffer(GL.ARRAY_BUFFER, mesh.UVBuffer);
                        GL.vertexAttribPointer(attributes.UV, 2, GL.FLOAT, false, 0, 0);
                    }
                    else
                        GL.disableVertexAttribArray(attributes.UV);
                }
                
                if (attributes.Colour !== -1)
                {
                    if (!!mesh.ColourBuffer)
                    {
                        GL.bindBuffer(GL.ARRAY_BUFFER, mesh.ColourBuffer);
                        GL.vertexAttribPointer(attributes.Colour, 3, GL.FLOAT, false, 0, 0);                            
                    }
                    else
                        GL.disableVertexAttribArray(attributes.Colour);
                }
                
                if (attributes.Normal !== -1)
                {
                    if (!!mesh.NormalBuffer)
                    {
                        GL.bindBuffer(GL.ARRAY_BUFFER, mesh.NormalBuffer);
                        GL.vertexAttribPointer(attributes.Normal, 3, GL.FLOAT, false, 0, 0);
                    }
                    else
                        GL.disableVertexAttribArray(attributes.Normal);
                }
                
                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.IndexBuffer);
            }
        },

        SetObjectUniforms:
        {
            value: function SetObjectUniforms(material, uniforms)
            {
                GL.uniformMatrix4fv(uniforms.Matrix.ModelView, false, __MODELVIEW__.PeekMatrix());
                GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, this.CalculateNormalMatrix());
                
                GL.uniform3fv(uniforms.Material.Ambient, material.Ambient);
                GL.uniform3fv(uniforms.Material.Diffuse, material.Diffuse);
                GL.uniform3fv(uniforms.Material.Specular, material.Specular);
                GL.uniform1f(uniforms.Material.Shininess, material.Shininess);
                GL.uniform1f(uniforms.Material.Alpha, material.Alpha);
            
                if (!!material.Image)
                {
                    GL.activeTexture(GL.TEXTURE0);
                    GL.bindTexture(GL.TEXTURE_2D, material.Image);
                    GL.uniform1i(uniforms.Material.HasImageMap, true);
                    GL.uniform1i(uniforms.Sampler.Image, 0);
                }
                else
                {
                    GL.bindTexture(GL.TEXTURE_2D, null);
                    GL.uniform1i(uniforms.Material.HasImageMap, false);
                }
                
                if (!!material.Bump)
                {
                    GL.activeTexture(GL.TEXTURE1);
                    GL.bindTexture(GL.TEXTURE_2D, material.Bump);
                    GL.uniform1i(uniforms.Material.HasBumpMap, true);
                    GL.uniform1i(uniforms.Sampler.Bump, 1);
                }
                else
                {
                    GL.bindTexture(GL.TEXTURE_2D, null);
                    GL.uniform1i(uniforms.Material.HasBumpMap, false);
                }
            }
        },

        SetGlobalUniforms:
        {
            value: function SetGlobalUniform()
            {            
                var i = __SHADER__.length;
                while (--i >= 0)
                {
                    var point_count = 0;
                    
                    GL.useProgram(__SHADER__[i].Program);                
                    var uniforms = __SHADER__[i].Uniforms.Light;
                    
                    var j = __LIGHT__.length;
                    while (--j >= 0)
                    {
                        var light = __LIGHT__[i];
                        
                        if (!!light)
                        {
                            switch (light.Type)
                            {
                                case "AMBIENTLIGHT":
                                    GL.uniform3fv(uniforms.Ambient.Colour, light.Colour);
                                    GL.uniform1f(uniforms.Ambient.Intensity, light.Intensity);
                                break;
                                    
                                case "DIRECTIONALLIGHT":
                                    GL.uniform3fv(uniforms.Directional.Colour, light.Colour);
                                    GL.uniform1f(uniforms.Directional.Intensity, light.Intensity);
                                    GL.uniform3fv(uniforms.Directional.Direction, light.Direction);
                                break;
                                    
                                case "POINTLIGHT":
                                    __MODELVIEW__.PushMatrix();
                                    __MODELVIEW__.Transform(light.Transform);
                                    var pos = __MODELVIEW__.PopMatrix();

                                    GL.uniform3fv(uniforms.Point[point_count].Colour, light.Colour);
                                    GL.uniform1f(uniforms.Point[point_count].Intensity, light.Intensity);
                                    GL.uniform3f(uniforms.Point[point_count].Position, pos.M41, pos.M42, pos.M43);
                                    GL.uniform1f(uniforms.Point[point_count].Radius, light.Radius);
                                    GL.uniform1f(uniforms.Point[point_count].Angle, light.Angle);

                                    point_count++;
                                break;
                            }
                        }
                    }

                    GL.uniform1i(uniforms.PointCount, point_count);
                    
                    // SET UNIFORM FOR NUMBER OF POINT LIGHTS
                    GL.uniformMatrix4fv(__SHADER__[i].Uniforms.Matrix.Projection, false, __PROJECTION__.GetViewer());
                }
                
                GL.useProgram(null);
            }
        },

        CalculateNormalMatrix:
        {
            value: function CalculateNormalMatrix()
            {
                var mat = __MODELVIEW__.PeekMatrix();
                FWGE.Game.Maths.Matrix4.Inverse(mat);
                return FWGE.Game.Maths.Matrix3.Create
                (
                    mat.M11, mat.M21, mat.M31,
                    mat.M12, mat.M22, mat.M32,
                    mat.M13, mat.M23, mat.M33
                );
            }
        },

        Draw:
        {
            value: function Draw(vertexCount)
            {
                console.log(vertexCount);
                GL.drawElements(GL.TRIANGLES, vertexCount, GL.UNSIGNED_SHORT, 0);
            }
        },

        FinalDraw:
        {
            value: function FinalDraw()
            {

            }
        }
    });

    __PROJECTION__.ProjectionUpdate();
};

