import { Transform } from "./../Transform";
import { FWGE } from "../../FWGE";

enum CameraMode { PERSPECTIVE, ORTHOGRAPHIC }

/**
 * @name        Camera
 * @description Something...
 * @module      FWGE.Game
 */
export class Camera
{
    /**
     * @property    Transform:  {Transform} [read]
     * @description The transform object attached to the current gameobject
     */
    public Transform:   Transform;
    /**
     * @property    Mode: {Number} [read|write]
     * @description Represent the current rendering mode the camera is using
     */
    public Mode:        CameraMode = CameraMode.PERSPECTIVE;
    /**
     * @property    FOV: {Number} [read|write]
     * @description Represent the current field of view of the camera
     */
    public FOV:         number = 35;
    /**
     * @property    Aspect: {Number} [read|write]
     * @description Represent the aspect ratio of the camera
     */
    public Aspect:      number = 16/9;
    /**
     * @property    Near: {Number} [read|write]
     * @description Represent the near clipping plane
     */
    public Near:        number = 0.1;
    /**
     * @property    Far: {Number} [read|write]
     * @description Represent the far clipping plane
     */
    public Far:         number = 900;
    /**
     * @property    Left: {Number} [read|write]
     * @description Represent the left clipping plane
     */
    public Left:        number = -10;
    /**
     * @property    Right: {Number} [read|write]
     * @description Represent the right clipping plane
     */
    public Right:       number = 10;
    /**
     * @property    Top: {Number} [read|write]
     * @description Represent the top clipping plane
     */
    public Top:         number = 10;
    /**
     * @property    Bottom: {Number} [read|write]
     * @description Represent the bottom clipping plane
     */
    public Bottom:      number = 10;
    /**
     * @property    Theta: {Number} [read|write]
     * @description Represent camera's yaw around the scene
     */
    public Theta:       number = 90;
    /**
     * @property    Phi: {Number} [read|write]
     * @description Represent the camera's pitch around the scene
     */
    public Phi:         number = 90;
    
    constructor()
    {
        
    }
            
    /**
     * @property    CameraUpdate: void
     * @description Updates the camera
     */
    public Update()
    {
        if (FWGE.GL.canvas.width  != FWGE.GL.canvas.clientWidth || FWGE.GL.canvas.height != FWGE.GL.canvas.clientHeight)
        {
            FWGE.GL.canvas.width  = FWGE.GL.canvas.clientWidth;
            FWGE.GL.canvas.height = FWGE.GL.canvas.clientHeight;
        }
        
        this.Aspect = FWGE.GL.drawingBufferWidth / FWGE.GL.drawingBufferHeight;
    }
}
