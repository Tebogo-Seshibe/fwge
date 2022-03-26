import { Vector3 } from "@fwge/common"
import { Entity, EntityId, Scene, System, Transform } from "@fwge/core"
import { Collider, CubeCollider, RigidBody } from "../components"

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

                // this._resolve(entity, other)
            }
        }

        // this._displace()
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
        
        const leftCollisionState = this.collisionStates.get(a) ?? []
        const rightCollisionState = this.collisionStates.get(b) ?? []

        let leftCollision = leftCollisionState.find(x => x.other === b)
        if (!leftCollision)
        {
            leftCollision = { other: b, state: CollisionState.None }
            leftCollisionState.push(leftCollision)
        }
        let rightCollision = rightCollisionState.find(x => x.other === a)
        if (!rightCollision)
        {
            rightCollision = { other: a, state: CollisionState.None }
            rightCollisionState.push(rightCollision)
        }

        if (isCollision)
        {
            switch (leftCollision.state)
            {
                case CollisionState.None:
                    leftCollision.state = CollisionState.Enter
                    break
                case CollisionState.Enter:
                    leftCollision.state = CollisionState.Update
                    break
            }

            switch (rightCollision.state)
            {
                case CollisionState.None:
                    rightCollision.state = CollisionState.Enter
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
                    break
            }

            switch (rightCollision.state)
            {
                case CollisionState.Update:
                    rightCollision.state = CollisionState.Exit
                    break
                case CollisionState.Exit:
                    rightCollision.state = CollisionState.None
                    break
            }
        }
    }

    _resolve(left: Entity, right: Entity): void
    {
        const leftPos = left.GetComponent(Transform)!.Position
        const rightPos = right.GetComponent(Transform)!.Position
        const leftCollider = left.GetComponent(Collider)! as CubeCollider
        const rightCollider = right.GetComponent(Collider)! as CubeCollider
        
        const direction = rightPos.Clone().Diff(leftPos).Normalize()
        const overlap = this._calculateOverlap(leftPos, leftCollider, rightPos, rightCollider)

        const displacementL = this.displacements.get(left) ?? Vector3.ZERO
        this.displacements.set(left, direction.Clone().Scale(-1).Sum(displacementL))

        const displacementR = this.displacements.get(left) ?? Vector3.ZERO
        this.displacements.set(right, direction.Clone().Scale(1).Sum(displacementR))
    }

    private _calculateOverlap(leftPos: Vector3, leftCollider: CubeCollider, rightPos: Vector3, rightCollider: CubeCollider): Vector3
    {
        const overlap = new Vector3()

        if (leftPos.X < rightPos.X)
        {
            const r = rightPos.X - rightCollider.Width / 2
            const l = leftPos.X + leftCollider.Width / 2
            overlap.X = r - l
        }

        if (leftPos.X > rightPos.X)
        {
            const r = rightPos.X + rightCollider.Width / 2
            const l = leftPos.X - leftCollider.Width / 2
            overlap.X = r - l
        }

        if (leftPos.Y < rightPos.Y)
        {
            const r = rightPos.Y - rightCollider.Height / 2
            const l = leftPos.Y + leftCollider.Height / 2
            overlap.Y = r - l
        }

        if (leftPos.Y > rightPos.Y)
        {
            const r = rightPos.Y + rightCollider.Height / 2
            const l = leftPos.Y - leftCollider.Height / 2
            overlap.Y = r - l
        }

        if (leftPos.Z < rightPos.Z)
        {
            const r = rightPos.Z - rightCollider.Depth / 2
            const l = leftPos.Z + leftCollider.Depth / 2
            overlap.Z = r - l
        }

        if (leftPos.Z > rightPos.Z)
        {
            const r = rightPos.Z + rightCollider.Depth / 2
            const l = leftPos.Z - leftCollider.Depth / 2
            overlap.Z = r - l
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

    _AABB(aPosition: Vector3, aCollider: CubeCollider, bPosition: Vector3, bCollider: CubeCollider): boolean
    {
        const a_min_x = aPosition.X - (aCollider.Width / 2)
        const a_max_x = aPosition.X + (aCollider.Width / 2)
        const a_min_y = aPosition.Y - (aCollider.Height / 2)
        const a_max_y = aPosition.Y + (aCollider.Height / 2)
        const a_min_z = aPosition.Z - (aCollider.Depth / 2)
        const a_max_z = aPosition.Z + (aCollider.Depth / 2)
        
        const b_min_x = bPosition.X - (bCollider.Width / 2)
        const b_max_x = bPosition.X + (bCollider.Width / 2)
        const b_min_y = bPosition.Y - (bCollider.Height / 2)
        const b_max_y = bPosition.Y + (bCollider.Height / 2)
        const b_min_z = bPosition.Z - (bCollider.Depth / 2)
        const b_max_z = bPosition.Z + (bCollider.Depth / 2)

        return (
            (a_min_x <= b_max_x && a_max_x >= b_min_x) &&
            (a_min_y <= b_max_y && a_max_y >= b_min_y) &&
            (a_min_z <= b_max_z && a_max_z >= b_min_z)
        )
    }

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

interface BB
{
    transform: Transform
    collider: CubeCollider
    rigidBody: RigidBody
}