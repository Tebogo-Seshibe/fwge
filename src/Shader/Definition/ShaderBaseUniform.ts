import { GL } from "../../FWGE";

export class MatrixUniform
{
    public readonly Model: WebGLUniformLocation
    public readonly Projection: WebGLUniformLocation
    public readonly Normal: WebGLUniformLocation
    public readonly View: WebGLUniformLocation

    constructor(mv: WebGLUniformLocation, p: WebGLUniformLocation, n: WebGLUniformLocation, c: WebGLUniformLocation)
    {
        this.Model = mv
        this.Projection = p
        this.Normal = n
        this.View = c
    }
}

export class DirectionalLightUniform
{
    public readonly Colour: WebGLUniformLocation
    public readonly Intensity: WebGLUniformLocation
    public readonly Direction: WebGLUniformLocation
    
    constructor(c: WebGLUniformLocation, i: WebGLUniformLocation, d: WebGLUniformLocation)
    {
        this.Colour = c
        this.Intensity = i
        this.Direction = d
    }
}

export class PointLightUniform
{
    public readonly Colour: WebGLUniformLocation
    public readonly Intensity: WebGLUniformLocation
    public readonly Position: WebGLUniformLocation
    public readonly Radius: WebGLUniformLocation
    public readonly Angle: WebGLUniformLocation

    constructor(c: WebGLUniformLocation, i: WebGLUniformLocation, p: WebGLUniformLocation, r: WebGLUniformLocation, a: WebGLUniformLocation)
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
    public readonly AmbientColour: WebGLUniformLocation
    public readonly DiffuseColour: WebGLUniformLocation
    public readonly SpecularColour: WebGLUniformLocation
    public readonly Shininess: WebGLUniformLocation
    public readonly Alpha: WebGLUniformLocation

    public readonly ImageSampler: WebGLUniformLocation
    public readonly BumpSampler: WebGLUniformLocation
    public readonly SpecularSampler: WebGLUniformLocation
    
    constructor(ac: WebGLUniformLocation, dc: WebGLUniformLocation, sc: WebGLUniformLocation, s: WebGLUniformLocation, a: WebGLUniformLocation, is: WebGLUniformLocation, bs: WebGLUniformLocation, ss: WebGLUniformLocation)
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
    public readonly Time: WebGLUniformLocation
    public readonly Resolution: WebGLUniformLocation

    public readonly NearClip: WebGLUniformLocation
    public readonly FarClip: WebGLUniformLocation

    public readonly ObjectID: WebGLUniformLocation
    public readonly ObjectCount: WebGLUniformLocation
    
    constructor(t: WebGLUniformLocation, r: WebGLUniformLocation, n: WebGLUniformLocation, f: WebGLUniformLocation, oid: WebGLUniformLocation, oc: WebGLUniformLocation)
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
    public readonly DirectionalLightCount: WebGLUniformLocation
    public readonly PointLights: PointLightUniform[]
    public readonly PointLightCount: WebGLUniformLocation
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