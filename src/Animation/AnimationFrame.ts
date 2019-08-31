export class IAnimationFrame
{
    colour?: number[]
    position?: number[]
    rotation?: number[]
    scale?: number[]
    time: number
}

export default class AnimationFrame
{
    //#region Public Properties
    public Start: number
    public End: number
    public Colour: number[]
    public Position: number[]
    public Rotation: number[]
    public Scale: number[]
    //#endregion

    //#region Public Properties
    constructor(start: number, end: number, colour: number[], position: number[], rotation: number[], scale: number[])
    {
        this.Start = start
        this.End = end
        this.Colour = colour
        this.Position = position
        this.Rotation = rotation
        this.Scale = scale
    }
    //#endregion
}