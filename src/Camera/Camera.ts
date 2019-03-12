import Item from '../Item'
import Updateable from '../Interfaces/Updateable'

export enum ViewMode
{
    PERSPECTIVE,
    ORTHOGRAPHIC
}

export class ICamera
{
    mode: ViewMode = ViewMode.PERSPECTIVE
    fieldOfView: number = 35
    aspectRatio: number = 16/9
    nearClipping: number = 0.01
    farClipping: number = 900
    left: number = -10
    right: number = 10
    top: number = 10
    bottom: number = -10
    horizontalTilt: number = 90
    vericalTilt: number = 90
}

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
    public VericalTilt: number // Phi
    
    constructor({ mode, fieldOfView, aspectRatio, nearClipping, farClipping, left, right, top, bottom, horizontalTilt, vericalTilt }: ICamera)
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
        
    }
    
    Update(): void
    {
        /*if (FWGE.GL.canvas.width != FWGE.GL.canvas.clientWidth || FWGE.GL.canvas.height != FWGE.GL.canvas.clientHeight)
        {
            FWGE.GL.canvas.width  = FWGE.GL.canvas.clientWidth;
            FWGE.GL.canvas.height = FWGE.GL.canvas.clientHeight;
        }
        
        this.Aspect = FWGE.GL.drawingBufferWidth / FWGE.GL.drawingBufferHeight;*/
    }
}