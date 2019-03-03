import AnimationFrame, { Frame } from './AnimationFrame'
import Item from '../Item'
import List from '../Utility/List'
import Updateable from '../Interfaces/Updateable'
import FWGEEvent from '../Utility/FWGEEvent'

export class IAnimation
{
    name: string = 'Animation'
    mesh: any = undefined
    material: any = undefined
    frames: Array<AnimationFrame<Frame>> | List<AnimationFrame<Frame>> = []
    length = 0
}

export default class Animation extends Item implements Updateable
{
    public Frames: List<AnimationFrame<Frame>>
    public Mesh: any
    public Material: any
    public Length: any

    constructor({name, mesh, material, frames, length}: IAnimation = new IAnimation)
    {
        super(name)
        
        this.Mesh = mesh
        this.Material = material
        this.Length = length

        if (frames)
        {
            this.Add(frames)
        }
    }

    Add(frame: List<AnimationFrame<Frame>> | Array<AnimationFrame<Frame>> | AnimationFrame<Frame>)
    {
        if (frame instanceof AnimationFrame)
        {
            this.Frames.Add
        }
        else
        {
            this.Frames.AddAll(frame)            
        }
    }

    Update(event: FWGEEvent): void
    {
        throw new Error('Method not implemented.')
    }
}