import { Vector3 } from "@fwge/common"
import { Entity, EntityId, Scene, System, Transform } from "@fwge/core"
import { Collider, CubeCollider, RigidBody, SphereCollider } from "../components"
import { Collision, CollisionState, GetCollisionMethod, _Collision, _Collision_Id } from "./types"

export class PhysicsSystem extends System
{
    private maxColliders: number = 500
    private readonly _collisions: Map<_Collision_Id, _Collision> = new Map()

    private collisions: Collision[][] = []
    private displacements: Map<EntityId, Vector3> = new Map()

    constructor(scene: Scene)
    {
        super(scene, { requiredComponents: [ Transform, Collider ] })
    }
    
    Init(): void { }
    Start(): void { }
    Stop(): void { }
    beta(delta: number)
    {
        
    }

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
            colliderA.Owner!.GetComponent(Transform)!.Position,
            colliderA.Position
        )
        const positionB = Vector3.Sum(
            colliderB.Owner!.GetComponent(Transform)!.Position,
            colliderB.Position
        )        
        
        const collisionTest = GetCollisionMethod(colliderA, colliderB)!
        const displacements = collisionTest(positionA, colliderA, positionB, colliderB)
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

    private _calculateOverlap(leftPos: Vector3, leftCollider: CubeCollider, rightPos: Vector3, rightCollider: CubeCollider): Vector3
    {        
        const a_min_x = leftPos[0] - (leftCollider.Width  / 2)
        const a_max_x = leftPos[0] + (leftCollider.Width  / 2)
        const a_min_y = leftPos[1] - (leftCollider.Height / 2)
        const a_max_y = leftPos[1] + (leftCollider.Height / 2)
        const a_min_z = leftPos[2] - (leftCollider.Depth  / 2)
        const a_max_z = leftPos[2] + (leftCollider.Depth  / 2)
        
        const b_min_x = rightPos[0] - (rightCollider.Width  / 2)
        const b_max_x = rightPos[0] + (rightCollider.Width  / 2)
        const b_min_y = rightPos[1] - (rightCollider.Height / 2)
        const b_max_y = rightPos[1] + (rightCollider.Height / 2)
        const b_min_z = rightPos[2] - (rightCollider.Depth  / 2)
        const b_max_z = rightPos[2] + (rightCollider.Depth  / 2)

        const error = 1
        const overlap = new Vector3()

        if (a_min_x < b_max_x && a_max_x > b_max_x)
        {
            overlap[0] = b_max_x - a_min_x
            if (Math.abs(overlap[0]) <= error)
            {
                overlap[0] = 0
            }
        }
        else if (a_max_x > b_min_x && a_min_x < b_min_x)
        {
            overlap[0] = b_min_x - a_max_x
            if (Math.abs(overlap[0]) <= error)
            {
                overlap[0] = 0
            }
        }
        if (a_min_y < b_max_y && a_max_y > b_max_y)
        {
            overlap[1] = b_max_y - a_min_y
            if (Math.abs(overlap[1]) <= error)
            {
                overlap[1] = 0
            }
        }
        else if (a_max_y > b_min_y && a_min_y < b_min_y)
        {
            overlap[1] = b_min_y - a_max_y
            if (Math.abs(overlap[1]) <= error)
            {
                overlap[1] = 0
            }
        }
        if (a_min_z < b_max_z && a_max_z > b_max_z)
        {
            overlap[2] = b_max_z - a_min_z
            if (Math.abs(overlap[2]) <= error)
            {
                overlap[2] = 0
            }
        }
        else if (a_max_z > b_min_z && a_min_z < b_min_z)
        {
            overlap[2] = b_min_z - a_max_z
            if (Math.abs(overlap[2]) <= error)
            {
                overlap[2] = 0
            }
        }

        return overlap
    }

    _displace()
    {
        for (const [entityId, offset] of this.displacements)
        {
            const entity = this.scene.GetEntity(entityId)!
            const transform = entity.GetComponent(Transform)!
            transform.Position.Sum(offset)
            this.displacements.get(entityId)!.Set(0)
        }
    }

    //#region Detection Algorithms
    private _SS(aPosition: Vector3, aRadius: number, bPosition: Vector3, bRadius: number): boolean
    {
        const radiusSquared  = (aRadius + bRadius) ** 2
        const distanceSquared = (aPosition[0] - bPosition[0]) **2 + 
            (aPosition[1] - bPosition[1]) ** 2 + 
            (aPosition[2] - bPosition[2]) ** 2

        return distanceSquared <= radiusSquared
    }

    private _AABB(aPosition: Vector3, aCollider: CubeCollider, bPosition: Vector3, bCollider: CubeCollider): ((current: Entity, target: Entity) => void) | undefined
    {
        const a_min_x = aPosition[0] - (aCollider.Width  / 2)
        const a_max_x = aPosition[0] + (aCollider.Width  / 2)
        const a_min_y = aPosition[1] - (aCollider.Height / 2)
        const a_max_y = aPosition[1] + (aCollider.Height / 2)
        const a_min_z = aPosition[2] - (aCollider.Depth  / 2)
        const a_max_z = aPosition[2] + (aCollider.Depth  / 2)
        
        const b_min_x = bPosition[0] - (bCollider.Width  / 2)
        const b_max_x = bPosition[0] + (bCollider.Width  / 2)
        const b_min_y = bPosition[1] - (bCollider.Height / 2)
        const b_max_y = bPosition[1] + (bCollider.Height / 2)
        const b_min_z = bPosition[2] - (bCollider.Depth  / 2)
        const b_max_z = bPosition[2] + (bCollider.Depth  / 2)

        if (
            (a_min_x <= b_max_x && a_max_x >= b_min_x) &&
            (a_min_y <= b_max_y && a_max_y >= b_min_y) &&
            (a_min_z <= b_max_z && a_max_z >= b_min_z)
        ){
            return this._resolveAABB.bind(this)
        }
    }
    //#endregion

    //#region Displacement Logic
    _resolveSS(current: Entity, target: Entity): void
    {
        const currentCollider = current.GetComponent(Collider)! as SphereCollider
        const targetCollider = target.GetComponent(Collider)! as SphereCollider
        
        if (currentCollider.IsTrigger || targetCollider.IsTrigger)
        {
            return
        }
        
        const currentPos = current.GetComponent(Transform)!.Position
        const targetPos = target.GetComponent(Transform)!.Position
        
        const centerDistance = Vector3.Distance(currentPos, targetPos)
        const radiusDistance = currentCollider.Radius + targetCollider.Radius

        if (centerDistance <= radiusDistance)
        {
            const overlap = (centerDistance - radiusDistance)
            const direction = currentPos.Clone().Diff(targetPos).Normalize().Scale(overlap)
            
            const currentDisplacement = this.displacements.get(current.Id) ?? Vector3.ZERO
            const targetDisplacement = this.displacements.get(target.Id) ?? Vector3.ZERO

            if (currentCollider.IsStatic)
            {
                targetDisplacement.Sum(direction.Scale(overlap))
            }
            else if (targetCollider.IsStatic)
            {
                currentDisplacement.Sum(direction.Scale(overlap))
            }
            else
            {
                currentDisplacement.Sum(direction.Scale(overlap / 2))
                targetDisplacement.Sum(direction.Scale(overlap / 2))
            }

            this.displacements.set(current.Id, currentDisplacement)
            this.displacements.set(target.Id, targetDisplacement)
        }
    }

    _resolveAABB(current: Entity, target: Entity): void
    {
        const currentCollider = current.GetComponent(Collider)! as CubeCollider
        const targetCollider = target.GetComponent(Collider)! as CubeCollider
        
        if (currentCollider.IsTrigger || currentCollider.IsStatic)
        {
            return
        }
        
        const currentPos = current.GetComponent(Transform)!.Position
        const targetPos = target.GetComponent(Transform)!.Position

        const overlap = this._calculateOverlap(currentPos, currentCollider, targetPos, targetCollider)
        const currentDisplacement = this.displacements.get(current.Id) ?? Vector3.ZERO                

        if (!targetCollider.IsStatic)
        {
            currentDisplacement.Sum(overlap.Scale(0.5))
        }
        else
        {
            currentDisplacement.Sum(overlap)
        }

        this.displacements.set(current.Id, currentDisplacement)
    }
    //#endregion
}
