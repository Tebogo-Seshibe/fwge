/**
 * @name        Renderer
 * @module      FWGE.Render
 * @description This module handles the actual rendering of the scene to
 *              the screen.
 */

let Renderer = (function()
{
    function Renderer()
    {
        Object.defineProperties(this,
        {
            ProjectionMatrix: { value: Matrix4.Identity, configurable: false, enumerable: true, writable: true },
            ModelViewMatrix: { value: Matrix4.Identity, configurable: false, enumerable: true, writable: true },
            NormalMatrix: { value: Matrix3.Identity, configurable: false, enumerable: true, writable: true },

            WireframeShader:
            {
                value:`
                    "Wireframe Shader",
                    512,
                    512,
                    "attribute vec3 A_Position;struct Matrix{mat4 ModelView;mat4 Projection;};uniform Matrix U_Matrix;void main(void){gl_Position=U_Matrix.Projection*U_Matrix.ModelView*vec4(A_Position,1.0);gl_PointSize=10.0;}",
                    "precision mediump float;void main(void){gl_FragColor=vec4(0.0,1.0,0.0,1.0);}"
                `,
                configurable: false, enumerable: true, writable: true
            },
            CombinedShader:
            {
                value: `                
                    "CombinedShader Shader",
                    512,
                    512,
                    "attribute vec3 A_Position;struct Matrix{mat4 ModelView;mat4 Projection;};uniform Matrix U_Matrix;void main(void){gl_Position=U_Matrix.Projection*U_Matrix.ModelView*vec4(A_Position,1.0);gl_PointSize=10.0;}",
                    "precision mediump float;void main(void){gl_FragColor=vec4(0.0,1.0,0.0,1.0);}"
                `,
                configurable: false, enumerable: true, writable: true
            },

            Render:
            {
                value: function Render()
                {
                    this.ClearBuffers();

                    for (var  i = 0, arr = GameObject.Objects; i < arr.length; ++i)
                    {
                        this.SetGlobalUniforms();
                        this.RenderObject(arr[i]);
                    }

                    //this.FinalDraw();
                }
            },
            
            ClearBuffers:
            {
                value: function ClearBuffers()
                {
                    var i = Shader.Shaders.length;
                    while (--i >= 0)
                    {
                        var shader = Shader.Shaders[i];

                        FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, shader.FrameBuffer);
                        FWGE.GL.viewport(0, 0, shader.Width, shader.Height);
                        FWGE.GL.clear(FWGE.GL.COLOR_BUFFER_BIT | FWGE.GL.DEPTH_BUFFER_BIT);
                    }
                    
                    FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
                    FWGE.GL.viewport(0, 0, FWGE.GL.drawingBufferWidth, FWGE.GL.drawingBufferHeight);
                    FWGE.GL.clear(FWGE.GL.COLOR_BUFFER_BIT | FWGE.GL.DEPTH_BUFFER_BIT);
                }
            },
            
            RenderObject:
            {
                value: function RenderObject(gameObject)
                {
                    ModelView.Push();
                    ModelView.Transform(gameObject.Transform);
                    var mv = new Float32Array(ModelView.Peek().Buffer);

                    for (var i = 0; i < gameObject.Children.length; ++i)
                        this.RenderObject(gameObject.Children[i]);
                    
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
                        
                        this.BindAttributes(gameObject.Mesh, shader.Attributes);
                        this.SetObjectUniforms(gameObject.Material, shader.Uniforms, mv);
                        this.Draw(gameObject.Mesh.VertexCount, shader.FrameBuffer);
                        //if (!!gameObject.Mesh.WireframeBuffer) this.DrawWireframe(gameObject.Mesh, mv);
                        
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
            },

            BindAttributes:
            {
                value: function BindAttributes(mesh, attributes)
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
            },

            SetObjectUniforms:
            {
                value: function SetObjectUniforms(material, uniforms, mv)
                {
                    FWGE.GL.uniformMatrix4fv(uniforms.Matrix.ModelView, false, mv);
                    FWGE.GL.uniformMatrix3fv(uniforms.Matrix.Normal, false, this.CalculateNormalMatrix().Buffer);

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
            },

            SetGlobalUniforms:
            {
                value: function SetGlobalUniforms()
                {            
                    var i = Shader.Shaders.length;
                    while (--i >= 0)
                    {
                        var point_count = 0;
                        
                        FWGE.GL.useProgram(Shader.Shaders[i].Program);
                        var uniforms = Shader.Shaders[i].Uniforms.Light;
                        
                        for (var j = 0; j < Light.Lights.length; ++j)
                        {
                            var light = Light.Lights[j];
                            
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
                                ModelView.Push();
                                ModelView.Transform(light.GameObject.Transform);
                                var pos = ModelView.Pop();

                                FWGE.GL.uniform4fv(uniforms.Point[point_count].Colour, light.Colour.Buffer);
                                FWGE.GL.uniform1f(uniforms.Point[point_count].Intensity, light.Intensity);
                                FWGE.GL.uniform3f(uniforms.Point[point_count].Position, pos.M41, pos.M42, pos.M43);
                                FWGE.GL.uniform1f(uniforms.Point[point_count].Radius, light.Radius);
                                FWGE.GL.uniform1f(uniforms.Point[point_count].Angle, light.Angle);

                                point_count++;
                            }
                        }

                        FWGE.GL.uniform1i(uniforms.PointCount, point_count);
                        
                        // SET UNIFORM FOR NUMBER OF POINT LIGHTS
                        FWGE.GL.uniformMatrix4fv(Shader.Shaders[i].Uniforms.Matrix.Projection, false, Projection.ViewerMatrix.Buffer);
                    }
                    
                    FWGE.GL.useProgram(null);
                }
            },

            CalculateNormalMatrix:
            {
                value: function CalculateNormalMatrix()
                {
                    var mat = ModelView.Peek();
                    mat.Inverse();

                    return new Matrix3().Set
                    (
                        mat.M11, mat.M21, mat.M31,
                        mat.M12, mat.M22, mat.M32,
                        mat.M13, mat.M23, mat.M33
                    );
                }
            },

            Draw:
            {
                value: function Draw(vertexCount, framebuffer)
                {
                    //FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, framebuffer);
                    FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
                    FWGE.GL.drawElements(FWGE.GL.TRIANGLES, vertexCount, FWGE.GL.UNSIGNED_SHORT, 0);
                    FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
                }
            },
                
            DrawWireframe:
            {
                value: function DrawWireframe(mesh, mv)
                {
                    FWGE.GL.useProgram(this.WireframeShader.Program);
                    
                    FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, mesh.PositionBuffer);
                    FWGE.GL.vertexAttribPointer(this.WireframeShader.Attributes.Position, 3, FWGE.GL.FLOAT, false, 0, 0);
                    FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, mesh.WireframeBuffer);
                    
                    FWGE.GL.uniformMatrix4fv(this.WireframeShader.Uniforms.Matrix.ModelView, false, mv);
                    FWGE.GL.uniformMatrix4fv(this.WireframeShader.Uniforms.Matrix.Projection, false, Projection.ViewerMatrix.Buffer);
                    //FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, framebuffer);
                    FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
                    FWGE.GL.drawElements(FWGE.GL.LINES, mesh.WireframeCount, FWGE.GL.UNSIGNED_SHORT, 0);
                    FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
                    FWGE.GL.useProgram(null);
                }
            }
            /*FinalDraw(): void
            {
                FWGE.GL.useProgram(_Shader.Program);
                FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);

                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, _Shader.PositionBuffer);
                FWGE.GL.vertexAttribPointer(_Shader.PositionPointer, 3, FWGE.GL.FLOAT, false, 0, 0);

                FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, _Shader.UVBuffer);
                FWGE.GL.vertexAttribPointer(_Shader.UVPointer, 2, FWGE.GL.FLOAT, false, 0, 0);

                FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, _Shader.IndexBuffer);

                FWGE.GL.uniformMatrix4fv(_Shader.ModelView, false, ModelView.Peek().Buffer);
                FWGE.GL.uniformMatrix4fv(_Shader.Projection, false, Projection.GetViewer());

                var i =Shader.Shaders.length;
                FWGE.GL.uniform1i(_Shader.SamplerCount, 1);
                FWGE.GL.activeTexture(FWGE.GL.TEXTURE0);
                FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, Shader.Shaders[0].Texture);
                FWGE.GL.uniform1i(_Shader.Samplers[0], 0);

                while (--i >= 0)
                {
                    FWGE.GL.activeTexture(FWGE.GL.TEXTURE0 + i);
                    FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, Shader.Shaders[i].Texture);
                    FWGE.GL.uniform1i(_Shader.Samplers[i], i);
                }
                
                FWGE.GL.drawElements(FWGE.GL.TRIANGLES, 6, FWGE.GL.UNSIGNED_SHORT, 0);
                
                FWGE.GL.bindFramebuffer(FWGE.GL.FRAMEBUFFER, null);
                FWGE.GL.useProgram(null);
            }*/
        });
    }
    Renderer.prototype = Object.create(null);

    return new Renderer();
})();
Object.seal(Renderer);