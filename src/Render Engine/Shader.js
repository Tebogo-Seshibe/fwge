var __SHADER__ = [];

/*!
 *  @constructor    Shader
 *  @description    Something
 *  @param          {Object: request}
 *                  > {String: name}
 *                  > {String: vertexShader}
 *                  > {String: fragmentShader}
 *                  > {Number: width}
 *                  > {Number: height}
 */
function Shader(request)
{
    if (!request) request = {};
    if (!request.name || typeof request.name !== 'string') return;
    if (!request.vertexShader || typeof request.vertexShader !== 'string') return;
    if (!request.fragmentShader || typeof request.fragmentShader !== 'string') return;
    if (typeof request.width !== 'number') request.width = 512;
    if (typeof request.height !== 'number') request.height = 512;
    
    Object.defineProperties(this,
    {
        Name:             { value: request.name },
        Program:          { value: GL.createProgram() },
        Texture:          { value: GL.createTexture() },
        FrameBuffer:      { value: GL.createFramebuffer() },
        RenderBuffer:     { value: GL.createRenderbuffer() }
    });

    GL.bindFramebuffer(GL.FRAMEBUFFER, this.FrameBuffer);		 	
    GL.bindRenderbuffer(GL.RENDERBUFFER, this.RenderBuffer);
    GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, 1024, 768);
    GL.bindTexture(GL.TEXTURE_2D, this.Texture);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1024, 768, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
    GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, this.Texture, 0);
    GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, this.RenderBuffer);
    GL.bindTexture(GL.TEXTURE_2D, null);
    GL.bindRenderbuffer(GL.RENDERBUFFER, null);
    GL.bindFramebuffer(GL.FRAMEBUFFER, null);
    
    var vs = GL.createShader(GL.VERTEX_SHADER);
    GL.shaderSource(vs, request.vertexShader);
    GL.compileShader(vs);
    if (!GL.getShaderParameter(vs, GL.COMPILE_STATUS))
    {
        console.error(new Error("Vertex Shader: " + GL.getShaderInfoLog(vs)));
        return;
    }
    
    var fs = GL.createShader(GL.FRAGMENT_SHADER);
    GL.shaderSource(fs, request.fragmentShader);
    GL.compileShader(fs);
    if (!GL.getShaderParameter(fs, GL.COMPILE_STATUS))
    {
        console.error(new Error("Fragment Shader: " + GL.getShaderInfoLog(fs)));
        return;
    }        
    
    GL.attachShader(this.Program, vs);
    GL.attachShader(this.Program, fs);
    GL.linkProgram(this.Program);
    if (!GL.getProgramParameter(this.Program, GL.LINK_STATUS)) return;
    
    GL.useProgram(this.Program);
    
    Object.defineProperties(this,
    {
        Attributes:
        { 
            value:
            {
                Position:               GL.getAttribLocation(this.Program, "A_Position"),
                Colour:                 GL.getAttribLocation(this.Program, "A_Colour"),
                UV:                     GL.getAttribLocation(this.Program, "A_UV"),
                Normal:                 GL.getAttribLocation(this.Program, "A_Normal")
            }
        },
        Uniforms:
        {
            value:
            {
                Material:
                {
                    Ambient:            GL.getUniformLocation(this.Program, "U_Material.Ambient"),
                    Diffuse:            GL.getUniformLocation(this.Program, "U_Material.Diffuse"),
                    Specular:           GL.getUniformLocation(this.Program, "U_Material.Specular"),
                    Shininess:          GL.getUniformLocation(this.Program, "U_Material.Shininess"),
                    Alpha:              GL.getUniformLocation(this.Program, "U_Material.Alpha")
                },
                Matrix:
                {
                    ModelView:          GL.getUniformLocation(this.Program, "U_Matrix.ModelView"),
                    Projection:         GL.getUniformLocation(this.Program, "U_Matrix.Projection"),
                    Normal:             GL.getUniformLocation(this.Program, "U_Matrix.Normal")
                },
                Light:
                {
                    Ambient:
                    {
                        Colour:         GL.getUniformLocation(this.Program, "U_Ambient.Colour"),
                        Intensity:      GL.getUniformLocation(this.Program, "U_Ambient.Intensity")
                    },
                    Directional:
                    {
                        Colour:         GL.getUniformLocation(this.Program, "U_Directional.Colour"),
                        Intensity:      GL.getUniformLocation(this.Program, "U_Directional.Intensity"),
                        Direction:      GL.getUniformLocation(this.Program, "U_Directional.Direction")
                    },
                    Point:
                    [
                        {
                            Colour:     GL.getUniformLocation(this.Program, "U_Point[0].Colour"),
                            Intensity:  GL.getUniformLocation(this.Program, "U_Point[0].Intensity"),
                            Position:   GL.getUniformLocation(this.Program, "U_Point[0].Position"),
                            Radius:     GL.getUniformLocation(this.Program, "U_Point[0].Radius"),
                            Angle:      GL.getUniformLocation(this.Program, "U_Point[0].Angle")
                        },
                        {
                            Colour:     GL.getUniformLocation(this.Program, "U_Point[1].Colour"),
                            Intensity:  GL.getUniformLocation(this.Program, "U_Point[1].Intensity"),
                            Position:   GL.getUniformLocation(this.Program, "U_Point[1].Position"),
                            Radius:     GL.getUniformLocation(this.Program, "U_Point[1].Radius"),
                            Angle:      GL.getUniformLocation(this.Program, "U_Point[1].Angle")
                        },
                        {
                            Colour:     GL.getUniformLocation(this.Program, "U_Point[2].Colour"),
                            Intensity:  GL.getUniformLocation(this.Program, "U_Point[2].Intensity"),
                            Position:   GL.getUniformLocation(this.Program, "U_Point[2].Position"),
                            Radius:     GL.getUniformLocation(this.Program, "U_Point[2].Radius"),
                            Angle:      GL.getUniformLocation(this.Program, "U_Point[2].Angle")
                        },
                        {
                            Colour:     GL.getUniformLocation(this.Program, "U_Point[3].Colour"),
                            Intensity:  GL.getUniformLocation(this.Program, "U_Point[3].Intensity"),
                            Position:   GL.getUniformLocation(this.Program, "U_Point[3].Position"),
                            Radius:     GL.getUniformLocation(this.Program, "U_Point[3].Radius"),
                            Angle:      GL.getUniformLocation(this.Program, "U_Point[3].Angle")
                        },
                        {
                            Colour:     GL.getUniformLocation(this.Program, "U_Point[4].Colour"),
                            Intensity:  GL.getUniformLocation(this.Program, "U_Point[4].Intensity"),
                            Position:   GL.getUniformLocation(this.Program, "U_Point[4].Position"),
                            Radius:     GL.getUniformLocation(this.Program, "U_Point[4].Radius"),
                            Angle:      GL.getUniformLocation(this.Program, "U_Point[4].Angle")
                        },
                        {
                            Colour:     GL.getUniformLocation(this.Program, "U_Point[5].Colour"),
                            Intensity:  GL.getUniformLocation(this.Program, "U_Point[5].Intensity"),
                            Position:   GL.getUniformLocation(this.Program, "U_Point[5].Position"),
                            Radius:     GL.getUniformLocation(this.Program, "U_Point[5].Radius"),
                            Angle:      GL.getUniformLocation(this.Program, "U_Point[5].Angle")
                        },
                        {
                            Colour:     GL.getUniformLocation(this.Program, "U_Point[6].Colour"),
                            Intensity:  GL.getUniformLocation(this.Program, "U_Point[6].Intensity"),
                            Position:   GL.getUniformLocation(this.Program, "U_Point[6].Position"),
                            Radius:     GL.getUniformLocation(this.Program, "U_Point[6].Radius"),
                            Angle:      GL.getUniformLocation(this.Program, "U_Point[6].Angle")
                        },
                        {
                            Colour:     GL.getUniformLocation(this.Program, "U_Point[7].Colour"),
                            Intensity:  GL.getUniformLocation(this.Program, "U_Point[7].Intensity"),
                            Position:   GL.getUniformLocation(this.Program, "U_Point[7].Position"),
                            Radius:     GL.getUniformLocation(this.Program, "U_Point[7].Radius"),
                            Angle:      GL.getUniformLocation(this.Program, "U_Point[7].Angle")
                        }
                    ],
                    PointCount:         GL.getUniformLocation(this.Program, "U_Point_Count"),
                },
                Sampler:
                {
                    Image:              GL.getUniformLocation(this.Program, "U_Sampler.Image"),
                    Bump:               GL.getUniformLocation(this.Program, "U_Sampler.Bump")
                }
            }
        }
    });
    
    GL.useProgram(null);
    
    __SHADER__.push(this);
}

