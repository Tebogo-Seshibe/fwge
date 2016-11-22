function Shader(request)
{
    var $ = this;
    
    if (!request) request = {};
    if (!request.name || typeof request.name !== 'string') return;
    if (!request.vertexShader || typeof request.vertexShader !== 'string') return;
    if (!request.fragmentShader || typeof request.fragmentShader !== 'string') return;
    if (typeof request.width !== 'number') request.width = 512;
    if (typeof request.height !== 'number') request.height = 512;
    
    Object.defineProperties($,
    {
        Name:             { value: request.name },
        Program:          { value: GL.createProgram() },
        Texture:          { value: GL.createTexture() },
        FrameBuffer:      { value: GL.createFramebuffer() },
        RenderBuffer:     { value: GL.createRenderbuffer() }
    });

    GL.bindFramebuffer(GL.FRAMEBUFFER, $.FrameBuffer);		 	
    GL.bindRenderbuffer(GL.RENDERBUFFER, $.RenderBuffer);
    GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, 1024, 768);
    GL.bindTexture(GL.TEXTURE_2D, $.Texture);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1024, 768, 0, GL.RGBA, GL.UNSIGNED_BYTE, null);
    GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, $.Texture, 0);
    GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, $.RenderBuffer);
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
    
    GL.attachShader($.Program, vs);
    GL.attachShader($.Program, fs);
    GL.linkProgram($.Program);
    if (!GL.getProgramParameter($.Program, GL.LINK_STATUS)) return;
    
    GL.useProgram($.Program);
    
    Object.defineProperties($,
    {
        Attributes:
        { 
            value:
            {
                Position:   GL.getAttribLocation($.Program, "A_Position"),
                Colour:     GL.getAttribLocation($.Program, "A_Colour"),
                UV:         GL.getAttribLocation($.Program, "A_UV"),
                Normal:     GL.getAttribLocation($.Program, "A_Normal")
            }
        },
        Uniforms:
        {
            value:
            {
                Material:
                {
                    Ambient:    GL.getUniformLocation($.Program, "U_Material.Ambient"),
                    Diffuse:    GL.getUniformLocation($.Program, "U_Material.Diffuse"),
                    Specular:   GL.getUniformLocation($.Program, "U_Material.Specular"),
                    Shininess:  GL.getUniformLocation($.Program, "U_Material.Shininess"),
                    Alpha:      GL.getUniformLocation($.Program, "U_Material.Alpha")
                },
                Matrix:
                {
                    ModelView:  GL.getUniformLocation($.Program, "U_Matrix.ModelView"),
                    Projection: GL.getUniformLocation($.Program, "U_Matrix.Projection"),
                    Normal:     GL.getUniformLocation($.Program, "U_Matrix.Normal")
                },
                Light:
                {
                    Ambient:
                    {
                        Colour:     GL.getUniformLocation($.Program, "U_Ambient.Colour"),
                        Intensity:  GL.getUniformLocation($.Program, "U_Ambient.Intensity")
                    },
                    Directional:
                    {
                        Colour:     GL.getUniformLocation($.Program, "U_Directional.Colour"),
                        Intensity:  GL.getUniformLocation($.Program, "U_Directional.Intensity"),
                        Direction:  GL.getUniformLocation($.Program, "U_Directional.Direction")
                    },
                    Point:
                    [
                        {
                            Colour:     GL.getUniformLocation($.Program, "U_Point[0].Colour"),
                            Intensity:  GL.getUniformLocation($.Program, "U_Point[0].Intensity"),
                            Position:   GL.getUniformLocation($.Program, "U_Point[0].Position"),
                            Radius:     GL.getUniformLocation($.Program, "U_Point[0].Radius"),
                            Angle:      GL.getUniformLocation($.Program, "U_Point[0].Angle")
                        }
                    ],
                    PointCount: GL.getUniformLocation($.Program, "U_Point_Count"),
                },
                Sampler:
                {
                    Image:      GL.getUniformLocation($.Program, "U_Sampler.Image"),
                    Bump:       GL.getUniformLocation($.Program, "U_Sampler.Bump")
                }
            }
        }
    });
    
    GL.useProgram(null);
    
    __SHADER__.push($);
}

