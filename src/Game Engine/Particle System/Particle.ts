import { Item } from "../Item";
import { Transform } from "../Transform";
import { KeyFrame, IKeyFrame } from "../../Interfaces/KeyFrame";

export interface IParticle extends IKeyFrame<Transform>
{
}

/**
 * @name        Particle
 * @description Definition of a single particle.
 * @module      FWGE.Game.ParticleSystem
 */
export class Particle extends KeyFrame<Transform>
{
    public Elapsed: number;

    constructor(request: IParticle)
    {
        super(request);

        this.Elapsed = 0;
    }
}
