 import { LocationMatrix, LookAt, Orthographic, Perspective } from '../../Render/Projection';
import Matrix4 from '../Maths/Matrix4';
import Vector3 from '../Maths/Vector3';
import Transform from '../Transform';
import Viewer, { ViewMode } from './Viewer';

export let Cameras: Camera[] = []

export class ICamera
{
    name?: string
    transform?: Transform
    target?: Vector3 | Float32Array | number[]
    up?: Vector3 | Float32Array | number[]
}

export default class Camera extends Viewer
{
    public Transform: Transform
    public Position: Vector3
    public Target: Vector3
    public Up: Vector3

    //#region Properties
    public get ProjectionMatrix(): Matrix4
    {
        switch (this.Mode)
        {
            case ViewMode.PERSPECTIVE:
                return this.Perspective

            case ViewMode.ORTHOGRAPHIC:
                return this.Orthographic

            case ViewMode.LOOKAT:
                return this.LookAt
        }
    }

    public get LookAt(): Matrix4
    {
        return LookAt(
            this.Transform.Position,
            this.Target,
            new Vector3(0, 1, 0)
        )
    }

    public get Orthographic(): Matrix4
    {
        return Orthographic(
            this.Left, 
            this.Right,
            this.Top,
            this.Bottom,
            this.NearClipping,
            this.FarClipping,
            this.HorizontalTilt,
            this.VericalTilt
        )
    }
    
    public get Perspective(): Matrix4
    {
        return Perspective(
            this.NearClipping,
            this.FarClipping,
            this.FieldOfView,
            this.AspectRatio
        )
    }

    public get LocationMatrix(): Matrix4
    {
        return LocationMatrix(
            this.Transform.Position,
            this.Transform.Rotation
        )
    }

    public static get Main()
    {
        return Cameras[0]
    }
    //#endregion

    constructor()
    constructor(viewer: ICamera)
    constructor({ name = 'Viewer', transform = new Transform, target = [0, 0, -1], up = [0, 1, 0] }: ICamera = new ICamera)
    {
        super(name)
        this.Transform = transform
        this.Target = new Vector3(target as number[])
        this.Up = new Vector3(up as number[])


        Cameras.push(this)
    }
    //#endregion
}

new Camera()