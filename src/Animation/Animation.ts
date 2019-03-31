import AnimationFrame, { Frame, AnimationFrameGroup } from './AnimationFrame'
import Item from '../Item'
import Mesh from '../Render/Mesh'
import RenderMaterial from '../Render/RenderMaterial'
import Updateable from '../Interfaces/Updateable'
import Colour4 from '../Render/Colour4'
import Transform from '../Transform'

export class IAnimation
{
    name?: string
    mesh?: Mesh
    material?: RenderMaterial
    frames?: Array<AnimationFrame<Frame>>
    length?: number
}

export default class Animation extends Item implements Updateable
{
    public Frames: Map<number, AnimationFrameGroup> = new Map()
    public Mesh: Mesh
    public Material: RenderMaterial
    public Length: number

    constructor({ name = 'Animation', mesh, material, frames = [], length = 0 }: IAnimation = new IAnimation())
    {
        super(name)
        
        this.Mesh = mesh
        this.Material = material
        this.Length = length

        frames.forEach(frame => this.Add(frame))
    }

    public Add(frame: AnimationFrame<Frame>): void
    {
        if (!this.Frames.has(frame.Time))
        {
            this.Frames.set(frame.Time, new AnimationFrameGroup())
        }

        let time = this.Frames.get(frame.Time)

        if (frame instanceof Colour4)
        {
            time.Colour = frame
        }

        if (frame instanceof Transform)
        {
            time.Transform = frame
        }
    }

    public Update(): void
    {
        console.log('Do the thing.')
    }
}