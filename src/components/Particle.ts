import { Component } from "../ecs/Component"
import { Colour3, Colour4, Vector3 } from "../atoms"

interface IParticle
{
    position?: Float32Array | [number, number, number] | Vector3
    colour?: Float32Array | [number, number, number] | Colour3 | [number, number, number, number] | Colour4
}

export class Particle extends Component
{
    private _position!: Vector3
    private _colour!: Colour4
    
    public get Position(): Vector3
    {
        return this._position
    }

    public set Position(position: Float32Array | [number, number, number] | Vector3)
    {
        this._position = new Vector3([...position])
    }

    public get Colour(): Colour4
    {
        return this._colour
    }

    public set Colour(colour: Float32Array | [number, number, number] | Colour3 | [number, number, number, number] | Colour4)
    {
        this.Colour = new Colour4([...colour])
    }

    constructor()
    constructor(args: IParticle)
    constructor(args: IParticle =
    {
        colour: new Colour4(),
        position: Vector3.ZERO
    })
    {
        super(Particle)
        
        this.Position = args.position!
        this.Colour = args.colour!
    }
}