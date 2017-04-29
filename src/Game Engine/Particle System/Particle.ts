import { Item } from "../Item";
import { IAnimationFrame } from "../Animation/AnimationFrame";

export interface IParticle extends IAnimationFrame
{
    Name: string;
}

/**
 * @name        Particle
 * @description Definition of a single particle.
 * @module      FWGE.Game.ParticleSystem
 */
export class Particle extends Item
{
    public Elapsed: number;

    constructor(request: IParticle)
    {
        super(request.Name);

        this.Elapsed = 0;
    }
}
