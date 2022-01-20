import { Component } from "../ecs/Component"
import { Colour3, Colour4, Vector3 } from "../atoms"

interface IParticle
{
    position?: Vector3 | [number, number, number]
    colour?: Colour4 | Colour3 | [number, number, number, number] | [number, number, number]
}

export class Particle extends Component
{
    #position!: Vector3
    #colour!: Colour4
    
    public get Position(): Vector3
    {
        return this.#position
    }

    public set Position(position: [number, number, number] | Vector3)
    {
        this.#position = new Vector3([...position])
    }

    public get Colour(): Colour4
    {
        return this.#colour
    }

    public set Colour(colour: [number, number, number] | Colour3 | [number, number, number, number] | Colour4)
    {
        this.Colour = new Colour4([...colour])
    }

    constructor()
    constructor(args: IParticle)
    constructor(args: IParticle = { })
    {
        super()
        
        this.Position = args.position ?? Vector3.ZERO
        this.Colour = args.colour ?? new Colour4()
    }
}