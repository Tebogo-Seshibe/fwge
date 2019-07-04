import FWGE from '../FWGE'
import Item from '../Item'
import Updateable from '../Interfaces/Updateable'

export enum ViewMode
{
    PERSPECTIVE,
    ORTHOGRAPHIC
}

export class ICamera
{
    name?: string
    mode?: ViewMode
    fieldOfView?: number
    aspectRatio?: number
    nearClipping?: number
    farClipping?: number
    left?: number
    right?: number
    top?: number
    bottom?: number
    horizontalTilt?: number
    vericalTilt?: number
}

export let Cameras: Array<Camera> = []

export default class Camera extends Item implements Updateable
{
    public Mode: ViewMode
    public FieldOfView: ViewMode
    public AspectRatio: number

    public NearClipping: number
    public FarClipping: number

    public Left: number
    public Right: number
    public Top: number
    public Bottom: number

    public HorizontalTilt: number // Theta
    public VericalTilt: number // Ph
    
    static get Main(): Camera
    {
        return Cameras[0]
    }

    static set Main(camera: Camera)
    {
        Cameras[0] = camera
    }
    
    constructor(name: string, mode: ViewMode = ViewMode.PERSPECTIVE, fieldOfView: number = 35, aspectRatio: number = 16/9, nearClipping: number = 0.001, farClipping: number = 10000, left: number = -10, right: number = 10, top: number = 10, bottom: number = -10, horizontalTilt: number = 90, vericalTilt: number = 90)
    {
        super(name)

        this.Mode = mode
        this.FieldOfView = fieldOfView
        this.AspectRatio = aspectRatio
        this.NearClipping = nearClipping
        this.FarClipping = farClipping
        this.Left = left
        this.Right = right
        this.Top = top
        this.Bottom = bottom
        this.HorizontalTilt = horizontalTilt
        this.VericalTilt = vericalTilt

        Cameras.push(this)
    }
    
    public Update(): void
    {
        this.AspectRatio = FWGE.GL.canvas.clientWidth / FWGE.GL.canvas.clientHeight
    }
}

new Camera('Main Camera')