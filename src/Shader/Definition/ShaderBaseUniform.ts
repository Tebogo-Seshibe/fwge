import { GL } from "../../FWGE";

export class MatrixUniform
{
    public readonly Model: WebGLUniformLocation | null
    public readonly Projection: WebGLUniformLocation | null
    public readonly Normal: WebGLUniformLocation | null
    public readonly View: WebGLUniformLocation | null

    constructor(mv: WebGLUniformLocation | null, p: WebGLUniformLocation | null, n: WebGLUniformLocation | null, c: WebGLUniformLocation | null)
    {
        this.Model = mv
        this.Projection = p
        this.Normal = n
        this.View = c
    }
}

export class DirectionalLightUniform
{
    public readonly Colour: WebGLUniformLocation | null
    public readonly Intensity: WebGLUniformLocation | null
    public readonly Direction: WebGLUniformLocation | null
    
    constructor(c: WebGLUniformLocation | null, i: WebGLUniformLocation | null, d: WebGLUniformLocation | null)
    {
        this.Colour = c
        this.Intensity = i
        this.Direction = d
    }
}

export class PointLightUniform
{
    public readonly Colour: WebGLUniformLocation | null
    public readonly Intensity: WebGLUniformLocation | null
    public readonly Position: WebGLUniformLocation | null
    public readonly Radius: WebGLUniformLocation | null
    public readonly Angle: WebGLUniformLocation | null

    constructor(c: WebGLUniformLocation | null, i: WebGLUniformLocation | null, p: WebGLUniformLocation | null, r: WebGLUniformLocation | null, a: WebGLUniformLocation | null)
    {
        this.Colour = c
        this.Intensity = i
        this.Position = p
        this.Radius = r
        this.Angle = a
    }
}

export class MaterialUniform
{
    public readonly AmbientColour: WebGLUniformLocation | null
    public readonly DiffuseColour: WebGLUniformLocation | null
    public readonly SpecularColour: WebGLUniformLocation | null
    public readonly Shininess: WebGLUniformLocation | null
    public readonly Alpha: WebGLUniformLocation | null

    public readonly ImageSampler: WebGLUniformLocation | null
    public readonly BumpSampler: WebGLUniformLocation | null
    public readonly SpecularSampler: WebGLUniformLocation | null
    
    constructor(ac: WebGLUniformLocation | null, dc: WebGLUniformLocation | null, sc: WebGLUniformLocation | null, s: WebGLUniformLocation | null, a: WebGLUniformLocation | null, is: WebGLUniformLocation | null, bs: WebGLUniformLocation | null, ss: WebGLUniformLocation | null)
    {
        this.AmbientColour = ac
        this.DiffuseColour = dc
        this.SpecularColour = sc
        this.Shininess = s
        this.Alpha = a
        this.ImageSampler = is
        this.BumpSampler = bs
        this.SpecularSampler = ss
    }
}

export class GlobalUniform
{
    public readonly Time: WebGLUniformLocation | null
    public readonly Resolution: WebGLUniformLocation | null

    public readonly NearClip: WebGLUniformLocation | null
    public readonly FarClip: WebGLUniformLocation | null

    public readonly ObjectID: WebGLUniformLocation | null
    public readonly ObjectCount: WebGLUniformLocation | null
    
    constructor(t: WebGLUniformLocation | null, r: WebGLUniformLocation | null, n: WebGLUniformLocation | null, f: WebGLUniformLocation | null, oid: WebGLUniformLocation | null, oc: WebGLUniformLocation | null)
    {
        this.Time = t
        this.Resolution = r
        this.NearClip = n
        this.FarClip = f
        this.ObjectID = oid
        this.ObjectCount = oc
    }
}

export default class ShaderBaseUniform
{
    private readonly DIRECTIONAL_COUNT: number = 3
    private readonly POINT_COUNT: number = 8

    public readonly Matrix: MatrixUniform
    public readonly Material: MaterialUniform
    public readonly DirectionalLights: DirectionalLightUniform[]
    public readonly DirectionalLightCount: WebGLUniformLocation | null
    public readonly PointLights: PointLightUniform[]
    public readonly PointLightCount: WebGLUniformLocation | null
    public readonly Global: GlobalUniform    

    constructor(program: WebGLProgram)
    {
        this.Matrix = new MatrixUniform
        (
            GL.getUniformLocation(program, 'U_Matrix.Model'),
            GL.getUniformLocation(program, 'U_Matrix.Projection'),
            GL.getUniformLocation(program, 'U_Matrix.Normal'),
            GL.getUniformLocation(program, 'U_Matrix.View')
        )

        this.DirectionalLights = []
        for (let i: number = 0; i < this.DIRECTIONAL_COUNT; ++i)
        {
            this.DirectionalLights.push(new DirectionalLightUniform
            (
                GL.getUniformLocation(program, `U_Directional[${i}].Colour`),
                GL.getUniformLocation(program, `U_Directional[${i}].Intensity`),
                GL.getUniformLocation(program, `U_Directional[${i}].Direction`)
            ))
        }
        this.DirectionalLightCount = GL.getUniformLocation(program, `U_Directional_Count`)

        this.PointLights = []
        for (let i: number = 0; i < this.POINT_COUNT; ++i)
        {
            this.PointLights.push(new PointLightUniform
            (
                GL.getUniformLocation(program, `U_Point[${i}].Colour`),
                GL.getUniformLocation(program, `U_Point[${i}].Intensity`),
                GL.getUniformLocation(program, `U_Point[${i}].Position`),
                GL.getUniformLocation(program, `U_Point[${i}].Radius`),
                GL.getUniformLocation(program, `U_Point[${i}].Angle`)
            ))
        }
        this.PointLightCount = GL.getUniformLocation(program, `U_Point_Count`)

        this.Material = new MaterialUniform
        (
            GL.getUniformLocation(program, 'U_Material.Ambient'),
            GL.getUniformLocation(program, 'U_Material.Diffuse'),
            GL.getUniformLocation(program, 'U_Material.Specular'),
            GL.getUniformLocation(program, 'U_Material.Shininess'),
            GL.getUniformLocation(program, 'U_Material.Alpha'),            
            GL.getUniformLocation(program, 'U_Material.ImageMap'),
            GL.getUniformLocation(program, 'U_Material.BumpMap'),
            GL.getUniformLocation(program, 'U_Material.SpecularMap')
        )

        this.Global = new GlobalUniform
        (
            GL.getUniformLocation(program, 'U_Global.Time'),
            GL.getUniformLocation(program, 'U_Global.Resolution'),
            GL.getUniformLocation(program, 'U_Global.NearClip'),
            GL.getUniformLocation(program, 'U_Global.FarClip'),
            GL.getUniformLocation(program, 'U_Global.ObjectID'),
            GL.getUniformLocation(program, 'U_Global.ObjectCount')
        )
    }
}