import { Vector3 } from "@fwge/common"
import { Entity, EntityId, Scene, System, Transform } from "@fwge/core"
import { Collider, CubeCollider, RigidBody, SphereCollider } from "../components"

enum CollisionState
{
    None = 0,
    Enter,
    Update,
    Exit
}

interface Collision
{
    other: Entity
    state: CollisionState
}

export class PhysicsSystem extends System
{
    private collisionStates: Map<Entity, Collision[]> = new Map()
    private displacements: Map<Entity, Vector3> = new Map()

    constructor(scene: Scene)
    {
        super(scene, Transform, RigidBody, Collider)
    }

    Init(): void
    {
        console.log(this)        
    }
    
    Update(_: number): void
    {
        this.displacements = new Map()
        
        for (let i = 0; i < this.entities.length; ++i)
        {
            for (let j = i + 1; j < this.entities.length; ++j)
            {
                const left = this.entities[i]
                const right = this.entities[j]

                this._detect(left, right)
            }
        }        

        for (const [ entity, collisions ] of this.collisionStates)
        {
            for (const { other, state } of collisions)
            {
                switch (state)
                {
                    case CollisionState.Enter:
                        entity.GetComponent(Collider)!.OnCollisionEnter.call(entity, other)
                        break

                    case CollisionState.Update:
                        entity.GetComponent(Collider)!.OnCollisionUpdate.call(entity, other)
                        break

                    case CollisionState.Exit:
                        entity.GetComponent(Collider)!.OnCollisionExit.call(entity, other)
                        break
                }

                if (state !== CollisionState.None)
                    this._resolve(entity, other)
            }
        }

        this._displace()
    }

    _detect(a: Entity, b: Entity): void
    {
        let isCollision = false
        const [aPosition, aCollider] = 
        [
            a.GetComponent(Transform)!.Position,
            a.GetComponent(Collider)!
        ]
        const [bPosition, bCollider] = 
        [
            b.GetComponent(Transform)!.Position,
            b.GetComponent(Collider)!
        ]

        if (aCollider instanceof CubeCollider && bCollider instanceof CubeCollider)
        {
            isCollision = this._AABB(aPosition, aCollider, bPosition, bCollider)   
        }
        else if (aCollider instanceof SphereCollider && bCollider instanceof SphereCollider)
        {
            isCollision = this._SS(aPosition, aCollider.Radius, bPosition, bCollider.Radius)
        }
        
        const leftCollisionState = this.collisionStates.get(a) ?? []
        const rightCollisionState = this.collisionStates.get(b) ?? []

        let leftCollision = leftCollisionState.find(x => x.other === b)
            ?? { other: b, state: CollisionState.None }
        let rightCollision = rightCollisionState.find(x => x.other === a)
            ?? { other: a, state: CollisionState.None }

        if (isCollision)
        {
            switch (leftCollision.state)
            {
                case CollisionState.None:
                    leftCollision.state = CollisionState.Enter
                    leftCollisionState.push(leftCollision)
                    break
                case CollisionState.Enter:
                    leftCollision.state = CollisionState.Update
                    break
            }

            switch (rightCollision.state)
            {
                case CollisionState.None:
                    rightCollision.state = CollisionState.Enter
                    rightCollisionState.push(rightCollision)
                    break
                case CollisionState.Enter:
                    rightCollision.state = CollisionState.Update
                    break
            }
        }
        else
        {            
            switch (leftCollision.state)
            {
                case CollisionState.Update:
                    leftCollision.state = CollisionState.Exit
                    break
                case CollisionState.Exit:
                    leftCollision.state = CollisionState.None
                    leftCollisionState.splice(leftCollisionState.findIndex(x => x.other === b), 1)
                    break
            }

            switch (rightCollision.state)
            {
                case CollisionState.Update:
                    rightCollision.state = CollisionState.Exit
                    break
                case CollisionState.Exit:
                    rightCollision.state = CollisionState.None
                    rightCollisionState.splice(rightCollisionState.findIndex(x => x.other === a), 1)
                    break
            }
        }
    }

    _resolve(current: Entity, target: Entity): void
    {
        const currentPos = current.GetComponent(Transform)!.Position
        const targetPos = target.GetComponent(Transform)!.Position
        const currentCollider = current.GetComponent(Collider)! as SphereCollider
        const targetCollider = target.GetComponent(Collider)! as SphereCollider
        
        if (currentCollider.IsTrigger || targetCollider.IsTrigger)
        {
            return
        }

        const overlap = (Vector3.Distance(currentPos, targetPos) - currentCollider.Radius - targetCollider.Radius) * 0.5
        const direction = currentPos.Clone().Diff(targetPos).Normalize()

        const currentDisplacement = this.displacements.get(current) ?? Vector3.ZERO
        this.displacements.set(current, currentDisplacement.Sum(direction.Clone().Scale(-overlap)))
    }

    private _calculateOverlap(leftPos: Vector3, leftCollider: CubeCollider, rightPos: Vector3, rightCollider: CubeCollider): Vector3
    {
        const overlap = new Vector3()

        if (leftPos[0] < rightPos[0])
        {
            const r = rightPos[0] - rightCollider.Width / 2
            const l = leftPos[0] + leftCollider.Width / 2
            overlap[0] = r - l
        }

        if (leftPos[0] > rightPos[0])
        {
            const r = rightPos[0] + rightCollider.Width / 2
            const l = leftPos[0] - leftCollider.Width / 2
            overlap[0] = r - l
        }

        if (leftPos[1] < rightPos[1])
        {
            const r = rightPos[1] - rightCollider.Height / 2
            const l = leftPos[1] + leftCollider.Height / 2
            overlap[1] = r - l
        }

        if (leftPos[1] > rightPos[1])
        {
            const r = rightPos[1] + rightCollider.Height / 2
            const l = leftPos[1] - leftCollider.Height / 2
            overlap[1] = r - l
        }

        if (leftPos[2] < rightPos[2])
        {
            const r = rightPos[2] - rightCollider.Depth / 2
            const l = leftPos[2] + leftCollider.Depth / 2
            overlap[2] = r - l
        }

        if (leftPos[2] > rightPos[2])
        {
            const r = rightPos[2] + rightCollider.Depth / 2
            const l = leftPos[2] - leftCollider.Depth / 2
            overlap[2] = r - l
        }

        return overlap
    }

    _displace()
    {
        for (const [entity, offset] of this.displacements)
        {
            entity.GetComponent(Transform)!.Position.Sum(offset)
        }
    }

    //#region Algorithms
    private _SS(aPosition: Vector3, aRadius: number, bPosition: Vector3, bRadius: number): boolean
    {
        const distanceSquared = (aPosition[0] - bPosition[0]) **2 + 
            (aPosition[1] - bPosition[1]) ** 2 + 
            (aPosition[2] - bPosition[2]) ** 2

        return distanceSquared <= (aRadius + bRadius) ** 2
    }

    private _AABB(aPosition: Vector3, aCollider: CubeCollider, bPosition: Vector3, bCollider: CubeCollider): boolean
    {
        const a_min_x = aPosition[0] - (aCollider.Width / 2)
        const a_max_x = aPosition[0] + (aCollider.Width / 2)
        const a_min_y = aPosition[1] - (aCollider.Height / 2)
        const a_max_y = aPosition[1] + (aCollider.Height / 2)
        const a_min_z = aPosition[2] - (aCollider.Depth / 2)
        const a_max_z = aPosition[2] + (aCollider.Depth / 2)
        
        const b_min_x = bPosition[0] - (bCollider.Width / 2)
        const b_max_x = bPosition[0] + (bCollider.Width / 2)
        const b_min_y = bPosition[1] - (bCollider.Height / 2)
        const b_max_y = bPosition[1] + (bCollider.Height / 2)
        const b_min_z = bPosition[2] - (bCollider.Depth / 2)
        const b_max_z = bPosition[2] + (bCollider.Depth / 2)

        return (
            (a_min_x <= b_max_x && a_max_x >= b_min_x) &&
            (a_min_y <= b_max_y && a_max_y >= b_min_y) &&
            (a_min_z <= b_max_z && a_max_z >= b_min_z)
        )
    }
    //#endregion

    OnUpdateEntity(entity: Entity): void
    {
        super.OnUpdateEntity(entity)

        if (this.entities.includes(entity))
        {
            this.collisionStates.set(entity, [])
        }
        else
        {
            this.collisionStates.delete(entity)
        }
    }
}
