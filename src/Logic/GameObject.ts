import Item from '../Item';
import Collider from './Collision/Collider';
import Cloneable from './Interfaces/Cloneable';
import Destroyable from './Interfaces/Destroyable';
import Updateable from './Interfaces/Updateable';
import Material from './Material';
import Mesh from './Mesh';
import RigidBody from './RigidBody';
import Transform from './Transform';

export let GameObjects: GameObject[] = []

export class IGameObject
{
    name?: string    
    transform?: Transform
    material?: Material
    mesh?: Mesh
    visible?: boolean
    rigidbody?: RigidBody
    collider?: Collider
    animation?: Animation
    children?: GameObject[]
    begin?: (this: GameObject) => void
    update?: (this: GameObject) => void
    end?: (this: GameObject) => void
}

export default class GameObject extends Item implements Cloneable<GameObject>, Destroyable, Updateable
{
    public Root: GameObject
    public Transform: Transform
    public Material: Material
    public Mesh: Mesh
    public Visible: boolean
    public RigidBody: RigidBody
    public Collider: Collider
    public Animation: Animation    
    public Children: GameObject[]
    
    public Begin: (this: GameObject) => void
    public Update: (this: GameObject) => void
    public End: (this: GameObject) => void

    constructor()
    constructor(gameObject: IGameObject)
    constructor(
    { 
        name = 'GameObject',
        transform = new Transform(),
        material,
        mesh,
        visible = true,
        rigidbody,
        collider,
        animation,
        children = [],
        begin = function (this: GameObject) { },
        update = function (this: GameObject) { },
        end = function (this: GameObject) { },
    }: IGameObject = new IGameObject)
    {
        super(name)

        this.Transform = transform        
        this.Material = material
        this.Mesh = mesh
        this.Visible = visible
        this.RigidBody = rigidbody
        this.Collider = collider
        this.Animation = animation
        this.Children = []
        this.Begin = begin.bind(this)
        this.Update = update.bind(this)
        this.End = end.bind(this)

        if (this.Collider)
        {
            this.Collider.Parent = this
        }

        for (let child of children)
        {
            child.Root = this
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

            if (this.Root)
            {
                index = this.Root.Children.indexOf(this)
                if (index !== -1)
                {
                    this.Root.Children.splice(index)
                }
            }
        }, delay)
    }

    public Clone(): GameObject
    {
        return new GameObject(
        {
            name:           this.Name + " Clone",
            transform:      this.Transform.Clone(),
            material:       this.Material,
            mesh:           this.Mesh,
            visible:        this.Visible,
            rigidbody:      this.RigidBody ? this.RigidBody.Clone() : undefined,
            collider:       this.Collider ? this.Collider.Clone() : undefined,
            children:       this.Children.map(child => child.Clone())
        })
    }
}
