import { Component } from "../ecs/Component"
import { Vector3 } from "../atoms/vector/Vector3"
import { Colour4 } from "../colour/Colour4"

interface IParticle
{
    position: Vector3
    colour: Colour4
}

export class Particle extends Component
{
    public Position: Vector3
    public Colour: Colour4

    constructor(args: IParticle)
    {
        super(Particle)
        
        const { position, colour } = args
        
        this.Position = position
        this.Colour = colour
    }
}