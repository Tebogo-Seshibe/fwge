import { Item } from "../Game Engine/Item";
import { FWGE } from "../FWGE";

export interface IShader
{
    Name:           string;
    Height?:        number;
    Width?:         number;
    VertexShader:   string;
    FragmentShader: string;
}

class ShaderAttributes
{
    public readonly Position:   number = -1;
    public readonly Colour:     number = -1;
    public readonly UV:         number = -1;
    public readonly Normal:     number = -1;

    constructor(GL: WebGLRenderingContext, Program: WebGLProgram | null)
    {
        this.Position   = GL.getAttribLocation(Program, "A_Position");
        this.Colour     = GL.getAttribLocation(Program, "A_Colour");
        this.UV         = GL.getAttribLocation(Program, "A_UV");
        this.Normal     = GL.getAttribLocation(Program, "A_Normal");
    }
}

class MaterialUniforms
{
    public readonly Ambient:        WebGLUniformLocation;
    public readonly Diffuse:        WebGLUniformLocation;
    public readonly Specular:       WebGLUniformLocation;
    public readonly Shininess:      WebGLUniformLocation;
    public readonly Alpha:          WebGLUniformLocation;
    
    public readonly HasImage:       WebGLUniformLocation;
    public readonly HasBump:        WebGLUniformLocation;
    public readonly HasSpecular:    WebGLUniformLocation;

    constructor(GL: WebGLRenderingContext, Program: WebGLProgram | null)
    {
        this.Ambient        = GL.getUniformLocation(Program, "U_Material.Ambient");
        this.Diffuse        = GL.getUniformLocation(Program, "U_Material.Diffuse");
        this.Specular       = GL.getUniformLocation(Program, "U_Material.Specular");
        this.Shininess      = GL.getUniformLocation(Program, "U_Material.Shininess");
        this.Alpha          = GL.getUniformLocation(Program, "U_Material.Alpha");

        this.HasImage       = GL.getUniformLocation(Program, "U_Material.HasImage");
        this.HasBump        = GL.getUniformLocation(Program, "U_Material.HasBump");
        this.HasSpecular    = GL.getUniformLocation(Program, "U_Material.HasSpecular");
    }
}

class MatrixUniforms
{
    public readonly ModelView:  WebGLUniformLocation;
    public readonly Projection: WebGLUniformLocation;
    public readonly Normal:     WebGLUniformLocation;
 
    constructor(GL: WebGLRenderingContext, Program: WebGLProgram | null)
    {
        this.ModelView  = GL.getUniformLocation(Program, "U_Matrix.ModelView");
        this.Projection = GL.getUniformLocation(Program, "U_Matrix.Projection");
        this.Normal     = GL.getUniformLocation(Program, "U_Matrix.Normal");
    }
}

class AmbientUniforms
{
    public readonly Colour:     WebGLUniformLocation;
    public readonly Intensity:  WebGLUniformLocation;

    constructor(GL: WebGLRenderingContext, Program: WebGLProgram | null)
    {
        this.Colour     = GL.getUniformLocation(Program, "U_Ambient.Colour");
        this.Intensity  = GL.getUniformLocation(Program, "U_Ambient.Intensity");
    }
}

class DirectionalUniforms
{
    public readonly Colour:     WebGLUniformLocation;
    public readonly Intensity:  WebGLUniformLocation;
    public readonly Direction:  WebGLUniformLocation;
    
    constructor(GL: WebGLRenderingContext, Program: WebGLProgram | null)
    {
        this.Colour     = GL.getUniformLocation(Program, "U_Directional.Colour");
        this.Intensity  = GL.getUniformLocation(Program, "U_Directional.Intensity");
        this.Direction  = GL.getUniformLocation(Program, "U_Directional.Direction");
    }
}

class PointUniforms
{
    public readonly Colour:     WebGLUniformLocation;
    public readonly Intensity:  WebGLUniformLocation;
    public readonly Position:   WebGLUniformLocation;
    public readonly Radius:     WebGLUniformLocation;
    public readonly Angle:      WebGLUniformLocation;
    
    constructor(GL: WebGLRenderingContext, Program: WebGLProgram | null, index: number)
    {
        this.Colour     = GL.getUniformLocation(Program, `U_Point[${index}].Colour`);
        this.Intensity  = GL.getUniformLocation(Program, `U_Point[${index}].Intensity`);
        this.Position   = GL.getUniformLocation(Program, `U_Point[${index}].Position`);
        this.Radius     = GL.getUniformLocation(Program, `U_Point[${index}].Radius`);
        this.Angle      = GL.getUniformLocation(Program, `U_Point[${index}].Angle`);
    }
}

class LightUniforms
{
    public readonly Ambient:        AmbientUniforms;
    public readonly Directional:    DirectionalUniforms;
    public readonly Point:          Array<PointUniforms> = new Array<PointUniforms>(8);
    public readonly PointCount:     WebGLUniformLocation;

    constructor(GL: WebGLRenderingContext, Program: WebGLProgram | null)
    {
        this.Ambient        = new AmbientUniforms(GL, Program);
        this.Directional    = new DirectionalUniforms(GL, Program);
        this.PointCount     = GL.getUniformLocation(Program, `U_PointCount`);

        for (var i: number = 0; i < 8; ++i)
            this.Point[i]   = new PointUniforms(GL, Program, i);
    }
}

class SamplerUniforms
{
    public readonly Image:      WebGLUniformLocation;
    public readonly Bump:       WebGLUniformLocation;
    public readonly Specular:   WebGLUniformLocation;

    constructor(GL: WebGLRenderingContext, Program: WebGLProgram | null)
    {
        this.Image      = GL.getUniformLocation(Program, "U_Sampler.Image");
        this.Bump       = GL.getUniformLocation(Program, "U_Sampler.Bump");
        this.Specular   = GL.getUniformLocation(Program, "U_Sampler.Specular");
    }
}

class ShaderUniforms
{
    public readonly Material:   MaterialUniforms;
    public readonly Matrix:     MatrixUniforms;
    public readonly Light:      LightUniforms;
    public readonly Sampler:    SamplerUniforms;

    constructor(GL: WebGLRenderingContext, Program: WebGLProgram | null)
    {
        this.Material   = new MaterialUniforms(GL,  Program);
        this.Matrix     = new MatrixUniforms(GL,    Program);
        this.Light      = new LightUniforms(GL,     Program);
        this.Sampler    = new SamplerUniforms(GL,   Program);
    }
}

/**
 * @name        Shader
 * @module      FWGE.Render
 * @description This object links with the vertex and fragment shaders
 */
export class Shader extends Item
{
    public static Shaders: Array<Shader> = new Array<Shader>();

    /**
     * @property    Program: {WebGLProgram} [read]
     * @description Some description
     */
    public readonly Program: WebGLProgram | null;

    /**
     * @property    Texture: {WebGLTexture} [read]
     * @description Some description
     */
    public readonly Texture: WebGLTexture | null;

    /**
     * @property    FrameBuffer: {WebGLFramebuffer} [read]
     * @description Some description
     */
    public readonly FrameBuffer: WebGLFramebuffer | null;

    /**
     * @property    RenderBuffer: {WebGLRenderbuffer} [read]
     * @description Some description
     */
    public readonly RenderBuffer: WebGLRenderbuffer | null;

    /**
     * @property    Height: {Number} [read]
     * @description Some description
     */
    public readonly Height: number;

    /**
     * @property    Width: {Number} [read]
     * @description Some description
     */
    public readonly Width: number;

    /**
     * @property    Width: {Number} [read]
     * @description Some description
     */
    public readonly Attributes: ShaderAttributes;
    /**
     * @property    Width: {Number} [read]
     * @description Some description
     */
    public readonly Uniforms:   ShaderUniforms;

    constructor(request: IShader)
    {
        console.log(request);
        super(request.Name);

        this.Program = FWGE.GL.createProgram();
        this.Texture = FWGE.GL.createTexture();
        this.FrameBuffer = FWGE.GL.createFramebuffer();
        this.RenderBuffer = FWGE.GL.createRenderbuffer();
        this.Height = request.Height || 1024;
        this.Width = request.Width || 1024;

        if (this.Init(FWGE.GL, request.VertexShader, request.FragmentShader))
        {
            FWGE.GL.useProgram(this.Program);
            this.Attributes = new ShaderAttributes(FWGE.GL, this.Program);
            this.Uniforms = new ShaderUniforms(FWGE.GL, this.Program);   
            FWGE.GL.useProgram(null);
        }

        Shader.Shaders.push(this);
    };

    private Init(GL: WebGLRenderingContext, vertexShader: string, fragmentShader: string): boolean
    {
        GL.bindFramebuffer(GL.FRAMEBUFFER, this.FrameBuffer); 
        GL.bindRenderbuffer(GL.RENDERBUFFER, this.RenderBuffer);
        GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, this.Width, this.Height);
        GL.bindTexture(GL.TEXTURE_2D, this.Texture);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
        GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, this.Width, this.Height, 0, GL.RGBA, GL.UNSIGNED_BYTE, undefined);
        GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, this.Texture, 0);
        GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, this.RenderBuffer);  
                    
        GL.bindTexture(GL.TEXTURE_2D, null);
        GL.bindRenderbuffer(GL.RENDERBUFFER, null);
        GL.bindFramebuffer(GL.FRAMEBUFFER, null);        
        
        var vs = GL.createShader(GL.VERTEX_SHADER);
        GL.shaderSource(vs, vertexShader);
        GL.compileShader(vs);
        if (!GL.getShaderParameter(vs, GL.COMPILE_STATUS))
        {
            console.error(new Error("Vertex Shader: " + GL.getShaderInfoLog(vs)));
            return false;
        }
        
        var fs = GL.createShader(GL.FRAGMENT_SHADER);
        GL.shaderSource(fs, fragmentShader);
        GL.compileShader(fs);
        if (!GL.getShaderParameter(fs, GL.COMPILE_STATUS))
        {
            console.error(new Error("Fragment Shader: " + GL.getShaderInfoLog(fs)));
            return false;
        }
        
        GL.attachShader(this.Program, vs);
        GL.attachShader(this.Program, fs);
        GL.linkProgram(this.Program);
        if (!GL.getProgramParameter(this.Program, GL.LINK_STATUS))
            return false;

        return true;
    }
}
