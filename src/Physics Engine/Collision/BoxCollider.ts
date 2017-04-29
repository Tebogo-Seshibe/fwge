import { Collider } from "./Collider";

export interface IBoxCollider extends ICollider
{
	Height?: 	number;
	Width?: 	number;
	Breadth?: 	number;
}

/**
 * @name        BoxCollider
 * @description This is a cube-shaped collision object
 * @module      FWGE.Physics
 */
export class BoxCollider extends Collider
{
    public Height:  number;
    public Width:   number;
    public Breadth: number;

    constructor(request: IBoxCollider)
    {
        super(request);

        this.Height = request.Height || 2;
        this.Width = request.Width || 2;
        this.Breadth = request.Breadth || 2;
    }
}
