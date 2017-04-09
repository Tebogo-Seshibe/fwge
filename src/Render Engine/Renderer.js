
var __MODELVIEW__;
var __PROJECTION__;

/**
 * @name        Renderer
 * @description This module handles the actual rendering of the scene to
 *              the screen.
 * @module      FWGE.Render
 */
function Renderer()
{
    var _Shader = (function()
    {
        var vertexShader = "attribute vec3 A_Position;\nattribute vec2 A_UV;\n\nuniform mat4 P;\nuniform mat4 MV;\n\nvarying vec2 V_UV;\n\nvoid main(void)\n{\n\tV_UV = A_UV;\n\tgl_Position = P * MV * vec4(A_Position, 1.0);\n}\n";
        var fragmentShader = "precision mediump float;\n\nconst int MAX_SHADERS = 8;\nuniform int U_Sampler_Count;\nuniform sampler2D U_Samplers[8];\n\nvarying vec2 V_UV;\n\nvoid main(void)\n{\n\t/*for (int i = 0; i < MAX_SHADERS; ++i)\n\t{\n\t\tif (i == U_Sampler_Count) break;\n\t\tgl_FragColor *= texture2D(U_Samplers[i], V_UV);\n\t}*/\n\tgl_FragColor = vec4(1.0);\n}\n";

        console.log("=======================================================\n"+vertexShader+"=======================================================\n"+fragmentShader+"=======================================================\n");

        function FinalShader()
        {
            var vs = GL.createShader(GL.VERTEX_SHADER);
            GL.shaderSource(vs, vertexShader);
            GL.compileShader(vs);

            var fs = GL.createShader(GL.FRAGMENT_SHADER);
            GL.shaderSource(fs, fragmentShader);
            GL.compileShader(fs);
            
            this.Program = GL.createProgram();

            GL.attachShader(this.Program, vs);
            GL.attachShader(this.Program, fs);
            GL.linkProgram(this.Program);            
            GL.useProgram(this.Program);
            
            this.PositionPointer = GL.getAttribLocation(this.Program, "A_Position");
            GL.enableVertexAttribArray(this.PositionPointer);
            this.UVPointer = GL.getAttribLocation(this.Program, "A_UV");
            GL.enableVertexAttribArray(this.UVPointer);

            this.Samplers = [];
            for (var  i = 0; i < 8; ++i)
                this.Samplers.push(GL.getUniformLocation(this.Program, "U_Samplers[" + i + "]"));
            this.SamplerCount = GL.getUniformLocation(this.Program, "U_Sampler_Count");

            this.ModelView = GL.getUniformLocation(this.Program, "MV");
            this.Projection = GL.getUniformLocation(this.Program, "P");

            this.PositionBuffer = GL.createBuffer();
            GL.bindBuffer(GL.ARRAY_BUFFER, this.PositionBuffer);
            GL.bufferData(GL.ARRAY_BUFFER, new Float32Array([ -1.0,1.0,0.0, -1.0,-1.0,0.0, 1.0,-1.0,0.0, 1.0,1.0,0.0 ]), GL.STATIC_DRAW);

            this.UVBuffer = GL.createBuffer();
            GL.bindBuffer(GL.ARRAY_BUFFER, this.UVBuffer);
            GL.bufferData(GL.ARRAY_BUFFER, new Float32Array([ 0.0,1.0, 0.0,0.0, 1.0,0.0, 1.0,1.0 ]), GL.STATIC_DRAW);

            this.IndexBuffer = GL.createBuffer();
            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);
            GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), GL.STATIC_DRAW);
            
            GL.useProgram(null);
        }

        return new FinalShader();
    })();

    console.log(_Shader);

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

                //this.FinalDraw();
            }
        },

        ClearBuffers:
        {
            value: function ClearBuffers()
            {
                var i = __SHADER__.length;
                while (--i >= 0)
                {
                    var shader = __SHADER__[i];

                    GL.bindFramebuffer(GL.FRAMEBUFFER, shader.FrameBuffer);
                    GL.viewport(0, 0, shader.Width, shader.Height);
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
                    
                    this.BindAttributes(object.Mesh, object.RenderMaterial, shader.Attributes);
                    this.SetObjectUniforms(object.RenderMaterial, shader.Uniforms);
                    this.Draw(object.Mesh.VertexCount, shader.FrameBuffer);
                    
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
            
                if (!!material.ImageMap)
                {
                    GL.activeTexture(GL.TEXTURE0);
                    GL.bindTexture(GL.TEXTURE_2D, material.ImageMap);
                    GL.uniform1i(uniforms.Material.HasImage, 1);
                    GL.uniform1i(uniforms.Sampler.Image, 0);
                }
                else
                {
                    GL.activeTexture(GL.TEXTURE0);
                    GL.bindTexture(GL.TEXTURE_2D, null);
                    GL.uniform1i(uniforms.Material.HasImage, 0);
                }
                
                if (!!material.BumpMap)
                {
                    GL.activeTexture(GL.TEXTURE1);
                    GL.bindTexture(GL.TEXTURE_2D, material.BumpMap);
                    GL.uniform1i(uniforms.Material.HasBump, 1);
                    GL.uniform1i(uniforms.Sampler.Bump, 1);
                }
                else
                {
                    GL.activeTexture(GL.TEXTURE1);
                    GL.bindTexture(GL.TEXTURE_2D, null);
                    GL.uniform1i(uniforms.Material.HasBump, 0);
                }
                
                if (!!material.SpecularMap)
                {
                    GL.activeTexture(GL.TEXTURE2);
                    GL.bindTexture(GL.TEXTURE_2D, material.SpecularMap);
                    GL.uniform1i(uniforms.Material.HasSpecular, 1);
                    GL.uniform1i(uniforms.Sampler.Specular, 2);
                }
                else
                {
                    GL.activeTexture(GL.TEXTURE2);
                    GL.bindTexture(GL.TEXTURE_2D, null);
                    GL.uniform1i(uniforms.Material.HasBump, 0);
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
                        var light = __LIGHT__[j];
                        
                        if (!!light)
                        {
                            switch (light.Type[0])
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
                                    __MODELVIEW__.Transform(light.GameObject.Transform);
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
            value: function Draw(vertexCount, framebuffer)
            {
                GL.bindFramebuffer(GL.FRAMEBUFFER, null);
                GL.drawElements(GL.TRIANGLES, vertexCount, GL.UNSIGNED_SHORT, 0);
                GL.bindFramebuffer(GL.FRAMEBUFFER, null);
            }
        },

        FinalDraw:
        {
            value: function FinalDraw()
            {
                GL.useProgram(_Shader.Program);
                GL.bindFramebuffer(GL.FRAMEBUFFER, null);

                GL.bindBuffer(GL.ARRAY_BUFFER, _Shader.PositionBuffer);
                GL.vertexAttribPointer(_Shader.PositionPointer, 3, GL.FLOAT, false, 0, 0);

                GL.bindBuffer(GL.ARRAY_BUFFER, _Shader.UVBuffer);
                GL.vertexAttribPointer(_Shader.UVPointer, 2, GL.FLOAT, false, 0, 0);

                GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, _Shader.IndexBuffer);

                GL.uniformMatrix4fv(_Shader.ModelView, false, __MODELVIEW__.PeekMatrix());
                GL.uniformMatrix4fv(_Shader.Projection, false, __PROJECTION__.GetViewer());

                var i =__SHADER__.length;
                GL.uniform1i(_Shader.SamplerCount, 1);
                GL.activeTexture(GL.TEXTURE0);
                GL.bindTexture(GL.TEXTURE_2D, __SHADER__[0].Texture);
                GL.uniform1i(_Shader.Samplers[0], 0);

                /*while (--i >= 0)
                {
                    GL.activeTexture(GL.TEXTURE0 + i);
                    GL.bindTexture(GL.TEXTURE_2D, __SHADER__[i].Texture);
                    GL.uniform1i(_Shader.Samplers[i], i);
                }*/
                
                GL.drawElements(GL.TRIANGLES, 6, GL.UNSIGNED_SHORT, 0);
                
                GL.bindFramebuffer(GL.FRAMEBUFFER, null);
                GL.useProgram(null);
            }
        }
    });

    __PROJECTION__.ProjectionUpdate();
};

