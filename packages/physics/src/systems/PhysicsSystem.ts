import { Vector3 } from "@fwge/common"
import { Entity, EntityId, System, Transform } from "@fwge/core"
import { Collider, CubeCollider, RigidBody, SphereCollider } from "../components"
import { SAT } from "./SAT"
import { Collision, CollisionResult, CollisionState, GetCollisionMethod, _Collision, _Collision_Id } from "./types"

export class PhysicsSystem extends System
{
    private maxColliders: number = 500
    private readonly _collisions: Map<_Collision_Id, _Collision> = new Map()

    private displacements: Map<EntityId, Vector3> = new Map()

    constructor()
    {
        super({ requiredComponents: [ Transform, Collider ] })
    }
    
    Init(): void { }
    Start(): void { }
    Stop(): void { }

    Update(delta: number): void
    {
        for (const entity of this.entities)
        {
            const transform = entity.GetComponent(Transform)!
            const rigidbody = entity.GetComponent(RigidBody)
            
            if (rigidbody)
            {
                transform.Position.Sum(
                    rigidbody.Velocity
                    .Clone()
                    .Scale(delta)
                )
            }
        }
        
        for (let i = 0; i < this.entities.length; ++i)
        {
            const left = this.entities[i]!

            for (let j = i + 1; j < this.entities.length; ++j)
            {
                const right = this.entities[j]!
                this._detect(left, right)

            }
        }

        for (const [collisionId, collision] of this._collisions)
        {
            const [aId, bId] = collisionId.split('-').map(Number)

            const aEntity = this.scene.GetEntity(aId)!
            const bEntity = this.scene.GetEntity(bId)!

            const aCollider = aEntity.GetComponent(Collider)!
            const bCollider = bEntity.GetComponent(Collider)!
            
            const aTransform = aEntity.GetComponent(Transform)!
            const bTransform = bEntity.GetComponent(Transform)!

            switch (collision.state)
            {
                case CollisionState.Enter:
                    aCollider.OnCollisionEnter.call(aEntity, bEntity)
                    bCollider.OnCollisionEnter.call(bEntity, aEntity)
                    break

                case CollisionState.Update:
                    aCollider.OnCollisionUpdate.call(aEntity, bEntity)
                    bCollider.OnCollisionUpdate.call(bEntity, aEntity)
                    break

                case CollisionState.Exit:
                    aCollider.OnCollisionExit.call(aEntity, bEntity)
                    bCollider.OnCollisionExit.call(bEntity, aEntity)
                    break
            }

            if (collision.displacements)
            {
                aTransform.Position.Sum(collision.displacements[0])
                bTransform.Position.Sum(collision.displacements[1])
            }
        }
    }

    private _detect(entityA: Entity, entityB: Entity): void
    {
        const colliderA = entityA.GetComponent(Collider)!
        const colliderB = entityB.GetComponent(Collider)!
        const positionA = Vector3.Sum(
            entityA!.GetComponent(Transform)!.Position,
            colliderA.Position
        )
        const positionB = Vector3.Sum(
            entityB!.GetComponent(Transform)!.Position,
            colliderB.Position
        )        
        let displacements: CollisionResult | undefined = undefined

        const collisionTest = GetCollisionMethod(colliderA, colliderB)!
        if (!collisionTest) 
        {
            if (colliderA instanceof CubeCollider && colliderB instanceof CubeCollider)
            {
                displacements = SAT(entityA!.GetComponent(Transform)!, colliderA, entityB!.GetComponent(Transform)!, colliderB)
            }

            else return 
        }
        else
        {
            displacements = collisionTest(positionA, colliderA, positionB, colliderB)
        }

        const collision = this._collisions.get(`${entityA.Id}-${entityB.Id}`) ?? { 
            state: CollisionState.None,
            displacements: displacements
        }

        if (displacements)
        {
            switch (collision.state)
            {
                case CollisionState.None:
                case CollisionState.Exit:
                    collision.state = CollisionState.Enter
                    break
                    
                case CollisionState.Enter:
                    collision.state = CollisionState.Update
                break
            }            
        }
        else
        {
            switch (collision.state)
            {
                case CollisionState.Enter:
                case CollisionState.Update:
                    collision.state = CollisionState.Exit
                    break
                case CollisionState.Exit:
                    collision.state = CollisionState.None
                    break
            }
        }

        collision.displacements = displacements

        if (collision.state === CollisionState.None)
        {
            this._collisions.delete(`${entityA.Id}-${entityB.Id}`)
        }
        else
        {
            this._collisions.set(`${entityA.Id}-${entityB.Id}`, collision)
        }
    }
}
