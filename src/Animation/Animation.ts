import AnimationFrame, { IAnimationFrame } from './AnimationFrame'
import Item from '../Item'
import Updateable from '../Interfaces/Updateable'
import GameObject from '../GameObject'
import Time from '../Utility/Time'
import List from '../Utility/List'
import Colour4 from "../Render/Colour4"
import Vector3 from "../Maths/Vector3"

export class IAnimation
{
    name?: string
    gameObject?: GameObject
    frames?: IAnimationFrame[] | List<IAnimationFrame>
}

export default class Animation extends Item implements Updateable
{
    public Frames: AnimationFrame[]
    public GameObject: GameObject
    public Length: number

    public FrameTime: number
    public MaxFrameTime: number
    public CurrentFrame: AnimationFrame

    constructor()
    constructor(animation: IAnimation)
    constructor({ name = 'Animation', gameObject, frames }: IAnimation = new IAnimation)
    {
        super(name)
        
        if (frames instanceof List)
        {
            frames = frames.ToArray()
        }

        this.Frames = new Array<AnimationFrame>()
        this.GameObject = gameObject
        this.Length = 0

        frames.forEach((current: IAnimationFrame, index: number, array: IAnimationFrame[]) =>
        {
            let next: IAnimationFrame = index === array.length - 1
                ? array[0]
                : array[index + 1]

            let colour = new Colour4(
                next.colour[0] - current.colour[0],
                next.colour[1] - current.colour[1],
                next.colour[2] - current.colour[2],
                next.colour[3] - current.colour[3]
            )

            let position = new Vector3(
                next.position[0] - current.position[0],
                next.position[1] - current.position[1],
                next.position[2] - current.position[2]
            )

            let rotation = new Vector3(
                next.rotation[0] - current.rotation[0],
                next.rotation[1] - current.rotation[1],
                next.rotation[2] - current.rotation[2]
            )

            let scale = new Vector3(
                next.scale[0] - current.scale[0],
                next.scale[1] - current.scale[1],
                next.scale[2] - current.scale[2]
            )

            this.Length += current.time
            this.Frames.push(new AnimationFrame(current.time, next.time,
            {
                Colour: new Colour4(colour),
                Position: new Vector3(position),
                Rotation: new Vector3(rotation),
                Scale: new Vector3(scale)
            }))
        })

        this.FrameTime = 0
        this.MaxFrameTime = this.Length * Time.Render.Period / 1000
        this.CurrentFrame = undefined
    }

    public Update(): void
    {
        this.FrameTime += Time.Render.Delta
        let offset: number = Math.max(this.FrameTime, this.MaxFrameTime, 0)
        
        /*if (offset > 0)
        {
            this.FrameTime = offset
            this.CurrentFrame = this.Frames[0]

            this.GameObject.Transform.Position.Set(this.CurrentFrame.Offset.Position)
            this.GameObject.Transform.Rotation.Set(this.CurrentFrame.Offset.Rotation)
            this.GameObject.Transform.Scale.Set(this.CurrentFrame.Offset.Scale)
        }
        else
        {
            let index = this.TransformFrames.find(frame => offset >= frame.Start && offset <= frame.End).Time
            this.CurrentFrame = this.TransformFrames[index]
        }
        
        this.GameObject.Transform.Position.Sum(this.CurrentFrame.Offset.Position)
        this.GameObject.Transform.Rotation.Sum(this.CurrentFrame.Offset.Rotation)
        this.GameObject.Transform.Scale.Sum(this.CurrentFrame.Offset.Scale)*/
    }
}