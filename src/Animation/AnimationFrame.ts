export type Vector3Frame = [ number, number, number ]
export type Vector4Frame = [ number, number, number, number ]

export class IAnimationFrame
{
    colour?: Vector4Frame
    position?: Vector3Frame
    rotation?: Vector3Frame
    scale?: Vector3Frame
    time: number
}

export default class AnimationFrame
{
    //#region Public Properties
    public Start: number
    public End: number
    public Colour: Vector4Frame
    public Position: Vector3Frame
    public Rotation: Vector3Frame
    public Scale: Vector3Frame
    //#endregion

    //#region Public Properties
    constructor(start: number, end: number, colour: Vector4Frame, position: Vector3Frame, rotation: Vector3Frame, scale: Vector3Frame)
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