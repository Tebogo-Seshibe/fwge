import GameObject from '../GameObject'
import Updateable from '../Interfaces/Updateable'
import Item from '../Item'
import Vector3 from "../Maths/Vector3";
import List from '../Utility/List'
import Time from '../Utility/Time'
import AnimationFrame, { IAnimationFrame, Vector3Frame, Vector4Frame } from './AnimationFrame'

export let Animations: Animation[] = new Array<Animation>()

export class IAnimation
{
    name?: string
    gameObject?: GameObject
    frames?: IAnimationFrame[] | List<IAnimationFrame>
    loop?: boolean
}

export default class Animation extends Item implements Updateable
{
    public Frames: AnimationFrame[]
    public GameObject: GameObject
    public Length: number
    public Loop: boolean

    private FrameTime: number
    private MaxFrameTime: number
    private CurrentFrame: number

    constructor()
    constructor(animation: IAnimation)
    constructor({ name = 'Animation', gameObject, frames, loop = false }: IAnimation = new IAnimation)
    {
        super(name)
        
        if (frames instanceof List)
        {
            frames = frames.ToArray()
        }

        this.Frames = new Array<AnimationFrame>()
        this.GameObject = gameObject
        this.Length = 0
        this.Loop = loop

        let start: number = 0
        frames.forEach((current: IAnimationFrame, index: number, array: IAnimationFrame[]) =>
        {
            let next: IAnimationFrame = index === array.length - 1
                ? array[0]
                : array[index + 1]

            let offset = current.time * 1000
            let colour: Vector4Frame = [
                (next.colour[0] - current.colour[0]) / offset,
                (next.colour[1] - current.colour[1]) / offset,
                (next.colour[2] - current.colour[2]) / offset,
                (next.colour[3] - current.colour[3]) / offset
            ]

            let position: Vector3Frame = [
                (next.position[0] - current.position[0]) / offset,
                (next.position[1] - current.position[1]) / offset,
                (next.position[2] - current.position[2]) / offset
            ]

            let rotation: Vector3Frame = [
                (next.rotation[0] - current.rotation[0]) / offset,
                (next.rotation[1] - current.rotation[1]) / offset,
                (next.rotation[2] - current.rotation[2]) / offset
            ]

            let scale: Vector3Frame = [
                (next.scale[0] - current.scale[0]) / offset,
                (next.scale[1] - current.scale[1]) / offset,
                (next.scale[2] - current.scale[2]) / offset
            ]

            this.Length += current.time
            this.Frames.push(new AnimationFrame(start, start + offset, colour, position, rotation, scale))

            start += offset
        })

        this.FrameTime = 0
        this.MaxFrameTime = this.Length * 1000
        this.CurrentFrame = 0

        Animations.push(this)
    }

    public Update(): void
    {
        if (this.FrameTime >= this.MaxFrameTime)
        {
            if (!this.Loop)
            {
                return
            }
            else
            {
                this.FrameTime = 0
                this.CurrentFrame = 0
            }
        }

        let currentFrame = this.Frames[this.CurrentFrame]
        let offset = Time.Render.Delta
        if (this.FrameTime + offset > currentFrame.End)
        {
            let offset = currentFrame.End - this.FrameTime
            
            this.FrameTime += offset
            this.UpdateObject(currentFrame, offset)
            
            if (this.FrameTime + offset >= this.MaxFrameTime)
            {
                if (this.Loop)
                {
                    this.FrameTime = 0
                    this.CurrentFrame = 0
                }
            }
            else
            {
                ++this.CurrentFrame
            }

            currentFrame = this.Frames[this.CurrentFrame]            
            offset = Time.Render.Delta - offset
        }
        
        this.FrameTime += offset
        this.UpdateObject(currentFrame, offset)
    }

    private UpdateObject(frame: AnimationFrame, length: number): void
    {
        this.GameObject.Transform.Position.Sum(new Vector3(frame.Position).Scale(length))
        this.GameObject.Transform.Rotation.Sum(new Vector3(frame.Rotation).Scale(length))
        this.GameObject.Transform.Scale.Sum(new Vector3(frame.Scale).Scale(length))
        
        this.GameObject.Material.Ambient.R += frame.Colour[0] * length
        this.GameObject.Material.Ambient.G += frame.Colour[1] * length
        this.GameObject.Material.Ambient.B += frame.Colour[2] * length
        this.GameObject.Material.Ambient.A += frame.Colour[3] * length
    }
}