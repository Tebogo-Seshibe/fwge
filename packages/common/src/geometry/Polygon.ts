import { Vector2, Vector3 } from "../vector"

export abstract class Polygon<T extends Vector2 | Vector3>
{   
    constructor(
        public readonly Vertices: T[]
    ) { }

    abstract TransformedVertices(...args: any): T[]
}