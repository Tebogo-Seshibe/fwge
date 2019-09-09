import Item from '../Item';
import PhysicsItem from '../Physics/PhysicsItem';
import RenderMaterial from '../Render/RenderMaterial';
import Cloneable from './Interfaces/Cloneable';
import Destroyable from './Interfaces/Destroyable';
import Updateable from './Interfaces/Updateable';
import Mesh from './Mesh';
import Transform from './Transform';

export let GameObjects: GameObject[] = []

export class IGameObject
{
    name?: string
    transform?: Transform
    mesh?: Mesh
    material?: RenderMaterial
    physics?: PhysicsItem
    animation?: Animation
    children?: GameObject[]
    visible?: boolean
    begin?: (this: GameObject) => void
    update?: (this: GameObject) => void
    end?: (this: GameObject) => void
}

export default class GameObject extends Item implements Cloneable<GameObject>, Destroyable, Updateable
{
    public Transform: Transform
    public Mesh: Mesh
    public Material: RenderMaterial
    public Physics: PhysicsItem
    public Animation: Animation
    public Children: GameObject[]
    public Visible: boolean
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
        physics,
        animation,
        begin = function(this: GameObject) { },
        update = function(this: GameObject) { },
        end = function(this: GameObject) { },
        children = [],
        visible = true
    }: IGameObject = new IGameObject)
    {
        super(name)

        this.Transform = transform        
        this.Mesh = mesh
        this.Material = material
        this.Physics = physics
        this.Animation = animation
        this.Begin = begin.bind(this)
        this.Update = update.bind(this)
        this.End = end.bind(this)
        this.Visible = visible

        for (let child of children)
        {
            this.Children.push(child)
        }
        
        GameObjects.push(this)
    }

    public Destroy(delay: number = 0): void
    {
        setTimeout(() => GameObjects = GameObjects.slice(GameObjects.indexOf(this), 1), delay)
    }

    public Clone(): GameObject
    {
        return new GameObject(
        {
            name:           this.Name + " Clone",
            transform:      new Transform(
            {
                position:   this.Transform.Position,
                rotation:   this.Transform.Rotation,
                scale:      this.Transform.Scale,
                shear:      this.Transform.Shear
            }),
            mesh:           this.Mesh,
            material:       this.Material,
            physics:        this.Physics,
            begin:          this.Begin,
            update:         this.Update,
            end:            this.End,
            children:       this.Children.map(child => child.Clone())
        });
    }
}