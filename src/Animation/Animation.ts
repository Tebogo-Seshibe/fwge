import AnimationFrame, { Frame } from './AnimationFrame'
import Item from '../Item'
import Updateable from '../Interfaces/Updateable'
import Colour4 from '../Render/Colour4'
import Transform from '../Transform'
import GameObject from '../GameObject'
import Vector3 from '../Maths/Vector3'
import Time from '../Utility/Time'

export class IAnimation
{
    name?: string
    gameObject?: GameObject
    frames?: Array<AnimationFrame<Frame>>
    length?: number
}

export default class Animation extends Item implements Updateable
{
    public ColourFrames: Array<AnimationFrame<Colour4>> = []
    public TransformFrames: Array<AnimationFrame<Transform>> = []
    public GameObject: GameObject
    public Length: number

    public FrameTime: number
    public MaxFrameTime: number
    public CurrentFrame: AnimationFrame<Transform>

    constructor()
    constructor(animation: IAnimation)
    constructor({ name = 'Animation', gameObject, frames = [], length = 0 }: IAnimation = new IAnimation)
    {
        super(name)
        
        this.GameObject = gameObject
        this.Length = length
        frames.forEach(frame => 
        {
            if (frame.Value instanceof Transform)
            {
                this.TransformFrames.push(<AnimationFrame<Transform>>frame)
            }
            if (frame.Value instanceof Colour4)
            {
                this.ColourFrames.push(<AnimationFrame<Colour4>>frame)
            }
        })

        this.FrameTime = 0
        this.MaxFrameTime = this.Length * Time.Render.Period / 1000
        this.CurrentFrame = null
        this.Init()
    }

    public Init(): void
    {         
        let start = 0
        let curr: AnimationFrame<Transform>
        let next: AnimationFrame<Transform>

        for (let i = 0; i < this.TransformFrames.length; ++i)
        {
            curr = this.TransformFrames[i]
            next = (i != this.TransformFrames.length - 1) ? this.TransformFrames[i + 1] : this.TransformFrames[0]
            
            let scale = 1 / (next.Time - curr.Time) * Time.Render.Period / 1000

            start += curr.Time * Time.Render.Period / 1000
            
            curr.Start = start
            curr.Offset = new Transform(
            {
                position: Vector3.Diff(next.Value.Position, curr.Value.Position).Scale(scale),
                rotation: Vector3.Diff(next.Value.Rotation, curr.Value.Rotation).Scale(scale),
                scale: Vector3.Diff(next.Value.Scale, curr.Value.Scale).Scale(scale),
                shear: Vector3.Diff(next.Value.Shear, curr.Value.Shear).Scale(scale)
            })
        }
    }

    public Update(): void
    {
        this.FrameTime += Time.Render.Delta
        let offset: number = Math.max(this.FrameTime, this.MaxFrameTime, 0)
        
        if (offset > 0)
        {
            this.FrameTime = offset
            this.CurrentFrame = this.TransformFrames[0]

            this.GameObject.Transform.Position.Set(this.CurrentFrame.Offset.Position)
            this.GameObject.Transform.Rotation.Set(this.CurrentFrame.Offset.Rotation)
            this.GameObject.Transform.Scale.Set(this.CurrentFrame.Offset.Scale)
            this.GameObject.Transform.Shear.Set(this.CurrentFrame.Offset.Shear)
        }
        else
        {
            let index = this.TransformFrames.find(frame => offset >= frame.Start && offset <= frame.End).Time
            this.CurrentFrame = this.TransformFrames[index]
        }
        
        this.GameObject.Transform.Position.Sum(this.CurrentFrame.Offset.Position)
        this.GameObject.Transform.Rotation.Sum(this.CurrentFrame.Offset.Rotation)
        this.GameObject.Transform.Scale.Sum(this.CurrentFrame.Offset.Scale)
        this.GameObject.Transform.Shear.Sum(this.CurrentFrame.Offset.Shear)
    }
}