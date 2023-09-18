import { Vector3, Vector3Array } from "@fwge/common";
import { UI } from "./UI";

export type WorldUIArgs =
{
    position?: Vector3 | Vector3Array;
    rotation?: Vector3 | Vector3Array;
    scale?: Vector3 | Vector3Array;
};

export class WorldUI extends UI
{
    public readonly Position: Vector3;
    public readonly Rotation: Vector3;
    public readonly Scale: Vector3;


    constructor()
    constructor(args: WorldUIArgs)
    constructor(args: WorldUIArgs = { })
    {
        super();
        const buffer = new Float32Array(9);
        this.Position = new Vector3(buffer, 0 * Vector3.BYTES_PER_ELEMENT);
        this.Rotation = new Vector3(buffer, 1 * Vector3.BYTES_PER_ELEMENT);
        this.Scale = new Vector3(buffer, 2 * Vector3.BYTES_PER_ELEMENT);
        
        if (args.position)
        {
            this.Position.Set(args.position as Vector3Array);
        }
        if (args.rotation)
        {
            this.Rotation.Set(args.rotation as Vector3Array);
        }
        if (args.scale)
        {
            this.Scale .Set(args.scale as Vector3Array);
        }
    }
}
