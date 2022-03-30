import { Scale, Vector3 } from "@fwge/common"
import { Entity, Scene, System, Transform } from "@fwge/core"
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
    current: Entity
    other: Entity
    state: CollisionState
    resolve?: (current: Entity, target: Entity) => void
}

export class PhysicsSystem extends System
{
    private collisions: Collision[][] = []
    private displacements: Map<Entity, Vector3> = new Map()

    constructor(scene: Scene)
    {
        super(scene, Transform, Collider)
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
            for (let j = i + 1; j < this.entities.length; ++j)
            {
                const left = this.entities[i]
                const right = this.entities[j]

                this._detect(left, right)
            }
        }        

        for (const collisionList of this.collisions)
        {
            if (!collisionList)
            {
                continue
            }

            for (const collision of collisionList)
            {
                const collider = collision.current.GetComponent(Collider)!

                switch (collision.state)
                {
                    case CollisionState.Enter:
                        collider.OnCollisionEnter.call(collision.current, collision.other)
                        break

                    case CollisionState.Update:
                        collider.OnCollisionUpdate.call(collision.current, collision.other)
                        break

                    case CollisionState.Exit:
                        collider.OnCollisionExit.call(collision.current, collision.other)
                        break
                }

                if (collision.state !== CollisionState.None)
                {
                    collision.resolve!(collision.current, collision.other)
                }
            }
        }

        this._displace()
    }

    _detect(a: Entity, b: Entity): void
    {
        let resolve: ((current: Entity, target: Entity) => void) | undefined
        const aPosition = a.GetComponent(Transform)!.Position
        const aCollider = a.GetComponent(Collider)!
        const bPosition = b.GetComponent(Transform)!.Position
        const bCollider = b.GetComponent(Collider)!

        if (aCollider instanceof CubeCollider && bCollider instanceof CubeCollider)
        {
            resolve = this._AABB(aPosition, aCollider, bPosition, bCollider)   
        }
        else if (aCollider instanceof SphereCollider && bCollider instanceof SphereCollider)
        {
            resolve = this._SS(aPosition, aCollider.Radius, bPosition, bCollider.Radius)
        }
        
        const aCollisionList = this.collisions[a.Id]
        const bCollisionList = this.collisions[b.Id]

        let leftCollision = aCollisionList.find(x => x.other === b)
            ?? { current: a, other: b, state: CollisionState.None, resolve: resolve }
        let rightCollision = bCollisionList.find(x => x.other === a)
            ?? { current: b, other: a, state: CollisionState.None, resolve: resolve }

        if (resolve !== undefined)
        {
            switch (leftCollision.state)
            {
                case CollisionState.None:
                    leftCollision.state = CollisionState.Enter
                    aCollisionList.push(leftCollision)
                    break
                case CollisionState.Enter:
                    leftCollision.state = CollisionState.Update
                    break
            }

            switch (rightCollision.state)
            {
                case CollisionState.None:
                    rightCollision.state = CollisionState.Enter
                    bCollisionList.push(rightCollision)
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
                    this.displacements.delete(leftCollision.current)
                    const index = aCollisionList.findIndex(x => x.other === b)
                    aCollisionList.swap(index, aCollisionList.length - 1)
                    aCollisionList.pop()
                    break
            }

            switch (rightCollision.state)
            {
                case CollisionState.Update:
                    rightCollision.state = CollisionState.Exit
                    break

                case CollisionState.Exit:
                    rightCollision.state = CollisionState.None
                    this.displacements.delete(rightCollision.current)
                    const index = bCollisionList.findIndex(x => x.other === a)
                    bCollisionList.swap(index, bCollisionList.length - 1)
                    bCollisionList.pop()
                    break
            }
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
        
        // console.log(`
        //     id ${leftCollider.Id}
        //     leftPos_y ${leftPos[1]}
        //     a_min_y ${a_min_y}
        //     a_max_y ${a_max_y}
        //     rightPos_y ${rightPos[1]}
        //     b_min_y ${b_min_y}
        //     b_max_y ${b_max_y}
        //     min ${Math.min(b_max_y, a_max_y)}
        //     max ${Math.max(b_min_y, a_min_y)}
        //     rect ${
        //         [Math.max(Math.min(b_max_y, a_max_y) - Math.max(b_min_y, a_min_y), 0),
        //         Math.abs(Math.min(b_max_y, a_max_y)) - Math.abs(Math.max(b_min_y, a_min_y))]
        //         // Math.max(Math.min(b_max_y, a_max_y) - Math.max(b_min_y, a_min_y), 0)
        //         // Math.max(Math.min(b_max_z, a_max_z) - Math.max(b_min_z, a_min_z), 0)
        //     } 
        // `)

        // if (a_min_x !== b_min_x && a_max_x !== b_max_x)
        // {
        //     overlap[0] = Math.max(Math.min(b_max_x, a_max_x) - Math.max(b_min_x, a_min_x), 0) * (
        //         leftPos[0] < rightPos[0] ? -1 : 1
        //     )
        // }
        // if (a_min_y !== b_min_y && a_max_y !== b_max_y)
        // {
        //     overlap[1] = Math.max(Math.min(b_max_y, a_max_y) - Math.max(b_min_y, a_min_y), 0) * (
        //         leftPos[1] < rightPos[1] ? 1 : -1
        //     )
        // }
        // if (a_min_z !== b_min_z && a_max_z !== b_max_z)
        // {
        //     overlap[2] = Math.max(Math.min(b_max_z, a_max_z) - Math.max(b_min_z, a_min_z), 0) * (
        //         leftPos[2] < rightPos[2] ? 1 : -1
        //     )
        // }
        // console.log(overlap.toString())    

        return overlap
    }

    _displace()
    {
        for (const [entity, offset] of this.displacements)
        {
            const transform = entity.GetComponent(Transform)!
            console.log(`${entity.Id}: ${offset}`)
            transform.Position.Sum(offset)
            this.displacements.get(entity)!.Set(0)
        }
    }

    //#region Detection Algorithms
    private _SS(aPosition: Vector3, aRadius: number, bPosition: Vector3, bRadius: number): ((current: Entity, target: Entity) => void) | undefined
    {
        const radiusSquared  = (aRadius + bRadius) ** 2
        const distanceSquared = (aPosition[0] - bPosition[0]) **2 + 
            (aPosition[1] - bPosition[1]) ** 2 + 
            (aPosition[2] - bPosition[2]) ** 2

        if (distanceSquared <= radiusSquared)
        {
            return this._resolveSS.bind(this)
        }
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
        
        if (currentCollider.IsTrigger || targetCollider.IsTrigger || targetCollider.IsStatic)
        {
            return
        }
        
        const currentPos = current.GetComponent(Transform)!.Position
        const targetPos = target.GetComponent(Transform)!.Position

        const distance = Vector3.Distance(currentPos, targetPos)
        const overlap = (distance - currentCollider.Radius - targetCollider.Radius) * 0.5
        const direction = currentPos.Clone().Diff(targetPos).Normalize().Scale(overlap)
        
        const currentDisplacement = this.displacements.get(current) ?? Vector3.ZERO
        currentDisplacement.Sum(direction)
        
        const otherDisplacement = this.displacements.get(current) ?? Vector3.ZERO
        otherDisplacement.Diff(direction)

        this.displacements.set(current, currentDisplacement)
        this.displacements.set(current, otherDisplacement)
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
        const currentDisplacement = this.displacements.get(current) ?? Vector3.ZERO                

        if (!targetCollider.IsStatic)
        {
            currentDisplacement.Sum(overlap.Scale(0.5))
        }
        else
        {
            currentDisplacement.Sum(overlap)
        }

        this.displacements.set(current, currentDisplacement)
    }
    //#endregion

    OnUpdateEntity(entity: Entity): void
    {
        super.OnUpdateEntity(entity)

        if (this.entities.includes(entity))
        {
            this.collisions[entity.Id] = []
        }
        else
        {
            delete this.collisions[entity.Id]
        }
    }
}
