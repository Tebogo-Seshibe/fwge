import { Vector2, Vector2Array } from "@fwge/common";
import { UI } from "./UI";

export type ScreenUIArgs =
{
    position?: Vector2 | Vector2Array;
    rotation?: Vector2 | Vector2Array;
    scale?: Vector2 | Vector2Array;
};

export class ScreenUI extends UI
{
    public readonly Position: Vector2;
    public readonly Rotation: Vector2;
    public readonly Scale: Vector2;

    constructor()
    constructor(args: ScreenUIArgs)
    constructor(args: ScreenUIArgs = { })
    {
        super();
        
        const buffer = new Float32Array(6);
        this.Position = new Vector2(buffer, 0 * Vector2.BYTES_PER_ELEMENT);
        this.Rotation = new Vector2(buffer, 1 * Vector2.BYTES_PER_ELEMENT);
        this.Scale = new Vector2(buffer, 2 * Vector2.BYTES_PER_ELEMENT);
        
        if (args.position)
        {
            this.Position.Set(args.position as Vector2Array);
        }
        if (args.rotation)
        {
            this.Rotation.Set(args.rotation as Vector2Array);
        }
        if (args.scale)
        {
            this.Scale .Set(args.scale as Vector2Array);
        }
    }
}
