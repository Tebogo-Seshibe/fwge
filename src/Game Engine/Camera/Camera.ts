import { Transform } from "./../Transform";
import { FWGE } from "../../FWGE";

export enum CameraMode { PERSPECTIVE, ORTHOGRAPHIC }

/**
 * @name        Camera
 * @description Something...
 * @module      FWGE.Game
 */
export class Camera
{
    public Transform:   Transform;
    public Mode:        CameraMode = CameraMode.PERSPECTIVE;

    public FOV:         number = 35;
    public Aspect:      number = 16/9;
    public Near:        number = 0.1;
    public Far:         number = 900;
    public Left:        number = -10;
    public Right:       number = 10;
    public Top:         number = 10;
    public Bottom:      number = 10;
    public Theta:       number = 90;
    public Phi:         number = 90;
    
    constructor() { }
    
    public Update()
    {
        if (FWGE.GL.canvas.width != FWGE.GL.canvas.clientWidth || FWGE.GL.canvas.height != FWGE.GL.canvas.clientHeight)
        {
            FWGE.GL.canvas.width  = FWGE.GL.canvas.clientWidth;
            FWGE.GL.canvas.height = FWGE.GL.canvas.clientHeight;
        }
        
        this.Aspect = FWGE.GL.drawingBufferWidth / FWGE.GL.drawingBufferHeight;
    }
}
