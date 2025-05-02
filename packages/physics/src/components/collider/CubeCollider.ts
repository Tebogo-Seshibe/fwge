import { CubeGeometry, Vector3 } from "@fwge/common"
import { Collider } from "./Collider"
import { Entity } from "@fwge/ecs"

interface ICubeCollider
{
    isStatic?: boolean
    isTrigger?: boolean
    position?: Vector3
    material?: any
    
    height?: number
    width?: number
    depth?: number

    onCollisionEnter?: (this: Entity, other: Entity) => void
    onCollision?: (this: Entity, other: Entity) => void
    onCollisionExit?: (this: Entity, other: Entity) => void
}

export class CubeCollider extends Collider
{
    #height: number = 1
    #width: number = 1
    #depth: number = 1

    get Height()
    {
        return this.#height
    }

    set Height(height: number)
    {
        this.Scale.Y = height
        this.#height = height
    }

    get Width()
    {
        return this.#width
    }

    set Width(width: number)
    {
        this.Scale.X = width
        this.#width = width
    }

    get Depth()
    {
        return this.#depth
    }
    
    set Depth(depth: number)
    {
        this.Scale.Z = depth
        this.#depth = depth
    }

    public Up: Vector3 = new Vector3(0, 1, 0)
    public Right: Vector3 = new Vector3(1, 0, 0)
    public Forward: Vector3 = new Vector3(0, 0, 1)

    constructor()
    constructor(collider: ICubeCollider)
    constructor(collider: ICubeCollider = { })
    {
        super(
            collider.position ?? Vector3.Zero,
            collider.isStatic ?? false,
            collider.isTrigger ?? false,
            collider.material,
            collider.onCollisionEnter,
            collider.onCollision,
            collider.onCollisionExit,
            new CubeGeometry()
        )

        this.Height = collider.height ?? 1.0
        this.Width = collider.width ?? 1.0
        this.Depth = collider.depth ?? 1.0
    }
}
