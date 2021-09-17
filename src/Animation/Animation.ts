import Updateable from '../Interfaces/Updateable'
import GameObject from '../Object/GameObject'
import Item from '../Object/Item'
import List from '../Utility/List'
import AnimationFrame from './AnimationFrame'

export let Animations: Animation[] = []

export class IAnimation
{
    name?: string
    loop?: boolean
    frames?: AnimationFrame[] | List<AnimationFrame>
}

export default class Animation extends Item implements Updateable
{
    public StartFrame?: AnimationFrame
    public EndFrame?: AnimationFrame
    public Frames?: AnimationFrame[]
    public Loop: boolean = false
    public Length?: number
    
    public Parent?: GameObject

    private FrameTime?: number
    private MaxFrameTime?: number
    private CurrentFrame?: AnimationFrame

    constructor()
    constructor(animation: IAnimation)
    constructor({ name = 'Animation', frames, loop }: IAnimation = new IAnimation)
    {
        super(name)
        
        // if (frames instanceof List)
        // {
        //     frames = frames.ToArray()
        // }

        // this.Loop = loop
        // this.Frames = frames
        // this.Length = frames.map(frame => frame.Length).reduce((p: number, c: number) => p + c, 0)
        
        // this.Frames.reduce((previous: AnimationFrame, current: AnimationFrame) => previous.Next = current)

        // this.CurrentFrame = undefined

        Animations.push(this)
    }

    public Start(): void
    {

    }
    
    public Update(delta: number): void
    {
        // this.EndFrame.Next = this.Loop ? this.StartFrame : undefined

        // if (this.CurrentFrame.Length <= 0 && !this.Loop)
        // {
        //     return
        // }

        // const timePassed = delta * 1000
        
        // if (this.CurrentFrame.Length < timePassed)
        // {
        //     let remainingTime = this.CurrentFrame.Length - timePassed
        //     if (!this.CurrentFrame.Next)
        //     {
        //         this.Set()

        //     }
        //     this.CurrentFrame = this.StartFrame.Clone()
        //     remainingTime = -remainingTime
        // }
        // else
        // {
        //     this.Set()
        //     this.CurrentFrame.Timestamp += timePassed
        // }
    }

    private Set(reset: boolean = false)
    {
        // const offset = this.CurrentFrame.Timestamp / this.CurrentFrame.Length
    
        // if (reset)
        // {
        //     this.Parent.Material.Diffuse.Set(this.CurrentFrame.Colour)
        //     this.Parent.Transform.Position.Set(this.CurrentFrame.Transform.Position)
        //     this.Parent.Transform.Rotation.Set(this.CurrentFrame.Transform.Rotation)
        //     this.Parent.Transform.Scale.Set(this.CurrentFrame.Transform.Scale)
        //     this.Parent.Transform.Shear.Set(this.CurrentFrame.Transform.Shear)
        // }
        // else
        // {
        //     this.Parent.Material.Diffuse.Set(
        //         this.CurrentFrame.Colour[0] * offset,
        //         this.CurrentFrame.Colour[1] * offset,
        //         this.CurrentFrame.Colour[2] * offset,
        //         this.CurrentFrame.Colour[3] * offset
        //     )
            
        //     this.Parent.Transform.Position.Set(
        //         Vector3.Lerp(
        //             offset,
        //             this.CurrentFrame.Transform.Position,
        //             this.CurrentFrame.Next.Transform.Position
        //         )
        //     )

        //     this.Parent.Transform.Rotation.Set(
        //         Vector3.Lerp(
        //             offset,
        //             this.CurrentFrame.Transform.Rotation,
        //             this.CurrentFrame.Next.Transform.Rotation
        //         )
        //     )

        //     this.Parent.Transform.Scale.Set(
        //         Vector3.Lerp(
        //             offset,
        //             this.CurrentFrame.Transform.Scale,
        //             this.CurrentFrame.Next.Transform.Scale
        //         )
        //     )

        //     this.Parent.Transform.Shear.Set(
        //         Vector3.Lerp(
        //             offset,
        //             this.CurrentFrame.Transform.Shear,
        //             this.CurrentFrame.Next.Transform.Shear
        //         )
        //     )
        // }
    }
}
