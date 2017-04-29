import { GameItem } from './GameItem';
import { GameObject } from "./GameObject";
import { Vector3 } from "./Maths/Vector3";

export interface ITransform
{
    Name?:          string;
    GameObject?:    GameObject | null;
    Position?:      Vector3;
    Rotation?:      Vector3;
    Scale?:         Vector3;
    Shear?:         Vector3;
}

/**
 * @name        Transform
 * @module      FWGE.Game
 * @description This object contains all the transformations that 
 *              are to be applied to the parent gameobject.
 */
export class Transform extends GameItem
{    
    /**
     * @property    Position: {Float32Array} [read|write]
     * @description The current position of the parent of gameobject
     */
    public Position:   Vector3;

    /**
     * @property    Rotation: {Float32Array} [read|write]
     * @description The current rotation of the parent of gameobject
     */           
    public Rotation:   Vector3;
    
    /**
     * @property    Scale: {Float32Array} [read|write]
     * @description The current scaling of the parent of gameobject
     */
    public Scale:      Vector3;

    /**
     * @property    Shear: {Float32Array} [read|write]
     * @description The current shearing of the parent of gameobject
     */
    public Shear:      Vector3;

    /**
     * @property    Up: {Float32Array} [read]
     * @description The parent gameobject's up vector
     */
    public readonly UP:        Vector3 = (new Vector3).Set(0, 1, 0);
    
    /**
     * @property    Forward: {Float32Array} [read]
     * @description The parent gameobject's forward vector
     */
    public readonly FORWARD:   Vector3 = (new Vector3).Set(0, 0, 1);
    
    /**
     * @property    Right: {Float32Array} [read]
     * @description The parent gameobject's right vector
     */
    public readonly RIGHT:     Vector3 = (new Vector3).Set(1, 0, 0);

    constructor(request: ITransform)
    {
        super(request.Name || "Transform", request.GameObject || null);

        this.Position = request.Position || Vector3.Zero;
        this.Rotation = request.Rotation || Vector3.Zero;
        this.Scale = request.Scale || Vector3.One;
        this.Shear = request.Shear || Vector3.Zero;
    }
    
    /**
     * @property    TransformUpdate: {undefined}
     * @description Updates the transformations
     */
    Update()
    {
        // TODO
        // UPDATE: UP, FORWARD, AND RIGHT
    }
}
