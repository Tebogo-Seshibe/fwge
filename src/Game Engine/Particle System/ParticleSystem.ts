import { GameItem } from "../GameItem";
import { GameObject } from "../GameObject";
import { IParticle, Particle } from "./Particle";

export interface IParticleSystem
{
    Name:           string;
    GameObject:     GameObject | null;
    Particle?:      IParticle;
}

/**
 * @name        ParticleSystem
 * @description Definition of a particle system.
 * @module      FWGE.Game
 */
export class ParticleSystem extends GameItem
{
    public Particle: Particle;

    constructor(request: IParticleSystem =
    {
        Name:       "Particel System",
        GameObject: null
    })
    {
        super(request.Name, request.GameObject);
        this.Particle = new Particle(request.Particle);
    }

    public Update(): void { }
}
