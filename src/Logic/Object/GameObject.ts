import Item from './Item';
import Collider from '../../Physics/Collision/Collider';
import Cloneable from '../Interfaces/Cloneable';
import Destroyable from '../Interfaces/Destroyable';
import Updateable from '../Interfaces/Updateable';
import Material from './Material';
import Mesh from './Mesh';
import RigidBody from './RigidBody';
import Transform from './Transform';

let OBJECT_COUNTER: number = 0

export let GameObjects: GameObject[] = []

export class IGameObject
{
    name?: string
    visible?: boolean

    parent?: GameObject
    children?: GameObject[]

    transform?: Transform
    material?: Material
    mesh?: Mesh
    rigidBody?: RigidBody
    collider?: Collider
    animation?: Animation

    collisionBegin?: (this: GameObject, other: Collider) => void
    collisionUpdate?: (this: GameObject, other: Collider) => void
    collisionEnd?: (this: GameObject, other: Collider) => void

    begin?: (this: GameObject) => void
    update?: (this: GameObject, delta: number) => void
    physicsUpdate?: (this: GameObject, delta: number) => void
    end?: (this: GameObject) => void
}

export default class GameObject extends Item implements Cloneable<GameObject>, Destroyable, Updateable
{
    public ObjectID: number = OBJECT_COUNTER++
    public Visible: boolean

    public Parent: GameObject
    public Children: GameObject[]
    
    public Transform: Transform
    public Material: Material
    public Mesh: Mesh
    public RigidBody: RigidBody
    public Collider: Collider
    public Animation: Animation    
    
    public OnCollisionBegin: (this: GameObject, other: Collider) => void
    public OnCollisionUpdate: (this: GameObject, other: Collider) => void
    public OnCollisionEnd: (this: GameObject, other: Collider) => void

    public Begin: (this: GameObject) => void
    public Update: (this: GameObject, delta: number) => void
    public PhysicsUpdate: (this: GameObject, delta: number) => void
    public End: (this: GameObject) => void

    constructor()
    constructor(gameObject: IGameObject)
    constructor(
    { 
        name = 'GameObject',
        visible = true,

        parent,
        children = [],

        transform = new Transform(),
        material,
        mesh,
        rigidBody,
        collider,
        animation,

        collisionBegin = function(this: GameObject, other: Collider) { },
        collisionUpdate = function(this: GameObject, other: Collider) { },
        collisionEnd = function(this: GameObject, other: Collider) { },

        begin = function(this: GameObject) { },
        update = function(this: GameObject, delta: number) { },
        physicsUpdate = function(this: GameObject, delta: number) { },
        end = function(this: GameObject) { },
    }: IGameObject = new IGameObject)
    {
        super(name)

        this.Visible = visible
        
        this.Parent = parent
        this.Children = []

        this.Transform = transform
        this.Material = material
        this.Mesh = mesh
        this.RigidBody = rigidBody
        this.Collider = collider
        this.Animation = animation

        this.OnCollisionBegin = collisionBegin
        this.OnCollisionUpdate = collisionUpdate
        this.OnCollisionEnd = collisionEnd

        this.Begin = begin
        this.Update = update
        this.PhysicsUpdate = physicsUpdate
        this.End = end

        if (this.Collider)
        {
            this.Collider.Parent = this
        }

        for (let child of children)
        {
            child.Parent = this
            this.Children.push(child)
            
            let index: number = GameObjects.indexOf(child)
            if (index !== -1)
            {
                GameObjects.splice(index, 1)
            }
        }
        
        GameObjects.push(this)
    }

    public Destroy(delay: number = 0): void
    {
        setTimeout(() =>
        {
            this.Children.forEach(child => child.Destroy())

            let index = GameObjects.indexOf(this)
            if (index !== -1)
            {
                GameObjects.splice(index, 1)
            }

            if (this.Parent)
            {
                index = this.Parent.Children.indexOf(this)
                if (index !== -1)
                {
                    this.Parent.Children.splice(index, 1)
                }
            }
        }, delay)
    }

    public Clone(): GameObject
    {
        return new GameObject(
        {
            name:           this.Name + " Clone",
            visible:        this.Visible,

            children:       this.Children.map(child => child.Clone()),

            transform:      this.Transform.Clone(),
            material:       this.Material,
            mesh:           this.Mesh,
            rigidBody:      this.RigidBody ? this.RigidBody.Clone() : undefined,
            collider:       this.Collider ? this.Collider.Clone() : undefined,

            collisionBegin: this.OnCollisionBegin,
            collisionUpdate:this.OnCollisionUpdate,
            collisionEnd:   this.OnCollisionEnd,

            begin:          this.Begin,
            update:         this.Update,
            physicsUpdate:  this.PhysicsUpdate,
            end:            this.End
        })
    }

    public OnCollision()
    {

    }
}
