import { Vector3 } from "./Maths/Vector3";

export class ITransform
{
    Position:   number[] = [0, 0, 0];
    Rotation:   number[] = [0, 0, 0];
    Scale:      number[] = [1, 1, 1];
    Shear:      number[] = [0, 0, 0];
}

/**
 * @name        Transform
 * @module      FWGE.Game
 * @description This object contains all the transformations that 
 *              are to be applied to the parent gameobject.
 */
export class Transform
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
     * @description The parent gameobject"s up vector
     */
    public readonly UP:        Vector3 = new Vector3(0, 1, 0);
    
    /**
     * @property    Forward: {Float32Array} [read]
     * @description The parent gameobject"s forward vector
     */
    public readonly FORWARD:   Vector3 = new Vector3(0, 0, 1);
    
    /**
     * @property    Right: {Float32Array} [read]
     * @description The parent gameobject"s right vector
     */
    public readonly RIGHT:     Vector3 = new Vector3(1, 0, 0);

    constructor(request: ITransform | Transform)
    {
        if (!request) request = new ITransform();
        this.Position = new Vector3(request.Position);
        this.Rotation = new Vector3(request.Rotation);
        this.Scale = new Vector3(request.Scale);
        this.Shear = new Vector3(request.Shear);
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
