import IEngine from './IEngine';
import { Equation } from "../Maths/Equation";
import { TimeKeep } from '../Utility/Time';
import Collider, { Colliders } from "../Physics/Collision/Collider";
import { IsColission } from "../Physics/CollisionDetection";
import { SphereCollider } from '../Physics/Collision/index';
import { GameObjects } from '../Object/GameObject';
import { clean } from '../Maths/Math';

interface IVelocity
{
    x: number
    y: number
}

interface IParticle
{
    x: number
    y: number
    mass: number
    velocity: IVelocity
}

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

function rotate(velocity: IVelocity, angle: number) {
    const rotatedVelocities = {
        x: clean(velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle)),
        y: clean(velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle))
    };

    return rotatedVelocities;
}
/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle: IParticle, otherParticle: IParticle): void {
    const xVelocityDiff = clean(particle.velocity.x - otherParticle.velocity.x);
    const yVelocityDiff = clean(particle.velocity.y - otherParticle.velocity.y);

    const xDist = clean(otherParticle.x - particle.x);
    const yDist = clean(otherParticle.y - particle.y);

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: clean(u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2)), y: u1.y };
        const v2 = { x: clean(u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2)), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}

export const GRAVITY: number = 9.81

export const Force: Equation = mass => GRAVITY * mass 

enum CollisionState
{
    NONE,
    BEGIN,
    CONTINUE,
    END
}

interface CollidedItem
{
    other: Collider
    state: CollisionState
}

let collisions: Map<Collider, CollidedItem> = new Map

function MapCollisions()
{
    Colliders.forEach((curr, _, arr) =>
    {
        let others = arr.filter(c => c !== curr)
        
        others.forEach(next => 
        {
            let { other, state }: CollidedItem = { other: next, state: CollisionState.NONE }
            if (collisions.has(curr))
            {
                other = collisions.get(curr)!.other
                state = collisions.get(curr)!.state
            }
            
            if (state === undefined)
            {
                state = CollisionState.NONE
            }

            if (other === undefined)
            {
                other = next
            }

            if (IsColission(curr, next))
            {
                switch (state)
                {
                    case CollisionState.NONE:
                        state = CollisionState.BEGIN
                        break
                        
                    case CollisionState.BEGIN:
                        state = CollisionState.CONTINUE
                        break
                }
            }
            else
            {
                switch (state)
                {           
                    case CollisionState.BEGIN:
                        state = CollisionState.CONTINUE
                        break

                    case CollisionState.CONTINUE:
                        state = CollisionState.END
                        break
                        
                    case CollisionState.END:
                        state = CollisionState.NONE
                        break
                }
            }

            collisions.set(curr, { other, state })
        })
    })
}

function RunCollisions()
{
    let entries = collisions.entries()
    for (let [orig, { other, state }] of entries)
    {
        let left: IParticle =
        {
            x: (<SphereCollider>orig).Position.X,
            y: (<SphereCollider>orig).Position.Y,
            mass: (<SphereCollider>orig).Parent!.RigidBody!.Mass,
            velocity: {
                x: (<SphereCollider>orig).Parent!.RigidBody!.Velocity.X,
                y: (<SphereCollider>orig).Parent!.RigidBody!.Velocity.Y
            }
        }

        let right: IParticle =
        {
            x: (<SphereCollider>other).Position.X,
            y: (<SphereCollider>other).Position.Y,
            mass: (<SphereCollider>other).Parent!.RigidBody!.Mass,
            velocity: {
                x: (<SphereCollider>other).Parent!.RigidBody!.Velocity.X,
                y: (<SphereCollider>other).Parent!.RigidBody!.Velocity.Y
            }
        }

        switch (state)
        {
            case CollisionState.BEGIN:
                orig.Parent!.OnCollisionBegin(other)
                resolveCollision(left, right)
                break
                
            case CollisionState.CONTINUE:
                orig.Parent!.OnCollisionUpdate(other)
                resolveCollision(left, right)
                break

            case CollisionState.END:
                orig.Parent!.OnCollisionEnd(other)
                break
        }

        (<SphereCollider>orig).Parent!.RigidBody!.Velocity.Set(left.velocity.x, left.velocity.y, 0);
        (<SphereCollider>other).Parent!.RigidBody!.Velocity.Set(right.velocity.x, right.velocity.y, 0);
    }
}

function RunMaths(delta: number)
{
    GameObjects.filter(g => 
    {
        return g.RigidBody! !== undefined
    }).
    forEach(g =>
    { 
        let velocity = g.RigidBody!.Velocity.Clone();
        velocity.Scale(1/delta)

        g.Transform.Position.Sum(velocity)
    })
}

export default class PhysicsEngine implements IEngine
{
    public Init(): void 
    {
        
    }

    public Update(timekeep: TimeKeep): void
    {
        RunMaths(timekeep.Delta)
        MapCollisions()
        RunCollisions()
    }

    public Reset(): void
    {
        
    }
}