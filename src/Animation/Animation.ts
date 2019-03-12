import AnimationFrame, { Frame } from './AnimationFrame'
import Item from '../Item'
import List from '../Utility/List'
import Mesh from '../Render/Mesh'
import RenderMaterial from '../Render/RenderMaterial'
import Updateable from '../Interfaces/Updateable'

export class IAnimation
{
    name: string = 'Animation'
    mesh?: Mesh
    material?: RenderMaterial
    frames?: Array<AnimationFrame<Frame>> | List<AnimationFrame<Frame>>
    length: number = 0
}

export default class Animation extends Item implements Updateable
{
    public Frames: List<AnimationFrame<Frame>>
    public Mesh: Mesh
    public Material: RenderMaterial
    public Length: number

    constructor({ name, mesh, material, frames, length }: IAnimation = new IAnimation)
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

    Add(frame: List<AnimationFrame<Frame>> | Array<AnimationFrame<Frame>> | AnimationFrame<Frame>): void
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

    Update(): void
    {
        throw new Error('Method not implemented.')
    }
}