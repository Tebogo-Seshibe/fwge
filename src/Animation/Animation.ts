import AnimationFrame, { Frame } from './AnimationFrame'
import Item from '../Item'
import Mesh from '../Render/Mesh'
import RenderMaterial from '../Render/RenderMaterial'
import Updateable from '../Interfaces/Updateable'

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
    public Frames: Array<AnimationFrame<Frame>>
    public Mesh: Mesh
    public Material: RenderMaterial
    public Length: number

    constructor({ name = 'Animation', mesh, material, frames = [], length = 0 }: IAnimation = new IAnimation())
    {
        super(name)
        
        this.Mesh = mesh
        this.Material = material
        this.Length = length

        frames.forEach(frame => this.Frames.push(frame))
    }

    public Update(): void
    {
        console.log('Do the thing.')
    }
}