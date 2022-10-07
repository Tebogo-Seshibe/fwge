import { Vector3, Vector3Array } from "@fwge/common"
import { Entity, EntityId, getComponent, Scene, System, Transform } from "@fwge/core"
import { Collider } from "../components"
import { Test } from "./MeshMesh"
import { SAT } from "./SAT"
import { CollisionState, _Collision, _Collision_Id } from "./types"

export class PhysicsSystem extends System
{
    private readonly _collisions: Map<_Collision_Id, _Collision> = new Map()
    
    private collisionStates: Map<string, CollisionState> = new Map()
    private offsets: Map<EntityId, Vector3> = new Map()
    private offsetBuffer: Float32Array = new Float32Array()
    private offsetBufferIndex: Map<EntityId, number> = new Map()

    constructor(scene: Scene)
    {
        super(scene, { requiredComponents: [ Transform, Collider ] })
    }
    
    Init(): void { }
    Start(): void { console.log(this) }
    Stop(): void { }

    Update(_: number): void
    {
        for (let i = 0; i < this.entityIds.length - 1; ++i)
        {
            const aEntity = this.Scene.GetEntity(this.entityIds[i])!

            for (let j = i + 1; j < this.entityIds.length; ++j)
            {
                const bEntity = this.Scene.GetEntity(this.entityIds[j])!

                this.#detect(aEntity, bEntity)
            }
        }

        for (const [entityId, offset] of this.offsets)
        {
            const entity = this.Scene.GetEntity(entityId)!
            const transform = entity.GetComponent(Transform)!
            transform.Position.Add(offset)
            offset.Set(0)
        }
    }

    #potentialUpdate()
    {
        for (const [entityId, offsetIndex] of this.offsetBufferIndex)
        {
            const offset = this.offsetBuffer.slice(offsetIndex, 3) as any as Vector3Array
            if (Vector3.Length(offset) === 0)
            {
                continue
            }
            
            const entity = this.Scene.GetEntity(entityId)!
            const transform = entity.GetComponent(Transform)!
            transform.Position.Add(offset)
            
            this.offsetBuffer[offsetIndex + 0] = 0
            this.offsetBuffer[offsetIndex + 1] = 0
            this.offsetBuffer[offsetIndex + 2] = 0
        }
    }

    #detect(aEntity: Entity, bEntity: Entity)
    {
        const id = `${aEntity.Id}_${bEntity.Id}`
        let state = this.collisionStates.get(id) ?? CollisionState.None

        const aCollider = aEntity.GetComponent(Collider)!
        const aTransform = aEntity!.GetComponent(Transform)!
        const bCollider = bEntity.GetComponent(Collider)!
        const bTransform = bEntity!.GetComponent(Transform)!
        
        let offset = Test(aTransform, aCollider, bTransform, bCollider)

        if (offset)
        {
            switch (state)
            {
                case CollisionState.None:
                case CollisionState.Exit:
                    state = CollisionState.Enter
                    break
                    
                case CollisionState.Enter:
                    state = CollisionState.Update
                break
            }
        }
        else
        {
            switch (state)
            {
                case CollisionState.Enter:
                case CollisionState.Update:
                    state = CollisionState.Exit
                    break
                case CollisionState.Exit:
                    state = CollisionState.None
                    break
            }
        }

        if (offset)
        {
            if (!this.offsets.has(aEntity.Id))
            {
                this.offsets.set(aEntity.Id, Vector3.Zero)
            }
    
            if (!this.offsets.has(bEntity.Id))
            {
                this.offsets.set(bEntity.Id, Vector3.Zero)
            }

            this.offsets.get(aEntity.Id)!.Add(offset[0])
            this.offsets.get(bEntity.Id)!.Add(offset[1])
        }
        
        switch (state)
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

        this.collisionStates.set(id, state)
    }

    override OnUpdateEntity(entity: Entity)
    {
        super.OnUpdateEntity(entity)

        if (this.IsValidEntity(entity))
        {
            const offsetIndex = this.offsetBuffer.length
            this.offsetBufferIndex.set(entity.Id, offsetIndex)
            this.offsetBuffer = new Float32Array([...this.offsetBuffer, 0,0,0])
        }
    }
}
