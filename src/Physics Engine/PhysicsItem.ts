import { GameItem } from "../Game Engine/GameItem";
import { SphereCollider } from "./Collision/SphereCollider";
import { BoxCollider } from "./Collision/BoxCollider";
import { PhysicsMaterial } from "./PhysicsMaterial";
import { PhysicsBody } from "./PhysicsBody";
import { GameObject } from "../Game Engine/GameObject";

export interface IPhysicsItem
{
    Name?:          string;
    GameObject?:    GameObject | null;
    Collider?:      BoxCollider | SphereCollider | null;
    Material?:      PhysicsMaterial | null;
    Body?:          PhysicsBody;
}

/**
 * @name PhysicsItem
 * @description The physics item
 * @module      FWGE.Physics
 * @param       request: {Object}
 */
export class PhysicsItem extends GameItem
{
    /**
     * @property    Collision: {Collision} [read|write]
     * @description Add some words...
     */
    public Collider: BoxCollider | SphereCollider | null;
    /**
     * @property    PhysicsMaterial: {PhysicsMaterial} [read|write]
     * @description Add some words...
     */
    public Material: PhysicsMaterial | null;
    /**
     * @property    PhysicsBody: {PhysicsBody} [read]
     * @description Add some words...
     */
    public Body: PhysicsBody;

    constructor(request: IPhysicsItem)
    {
        super(request.Name || "Physics Item", request.GameObject || null);
        
        this.Collider = request.Collider || null;
        this.Material = request.Material || null;
        this.Body = request.Body || new PhysicsBody({});
    }


    /**
     * @property    PhysicsUpdate: {Function}
     * @description Update the physics stuffs...
     */
    Update(Game: GameEngine, Physics: PhysicsEngine): void
    {
        if (!this.Body.LockY)
        {
            this.Body.Velocity += (Physics.Gravity * (Game.Time.Delta / 1000));

            if (this.GameObject)
                this.GameObject.Transform.Position.Y += this.Body.Velocity;
        }
    }
}
