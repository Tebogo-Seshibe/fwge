import Cloneable from './Interfaces/Cloneable';
import Destroyable from './Interfaces/Destroyable';
import Updateable from './Interfaces/Updateable';
import Item from '../Item';
import PhysicsMaterial from '../Physics/PhysicsMaterial';
import Mesh from './Mesh';
import RenderMaterial from '../Render/RenderMaterial';
import Transform from './Transform';

export type GameObjectFunction = (this: GameObject) => void

export let GameObjects: GameObject[] = []

export class IGameObject
{
    name?: string
    transform?: Transform
    mesh?: Mesh
    material?: RenderMaterial
    physics?: PhysicsMaterial
    animation?: Animation
    children?: GameObject[]
    visible?: boolean
    begin?: GameObjectFunction
    update?: GameObjectFunction
    end?: GameObjectFunction
}

export default class GameObject extends Item implements Cloneable<GameObject>, Destroyable, Updateable
{
    public Transform: Transform
    public Mesh: Mesh
    public Material: RenderMaterial
    public Physics: PhysicsMaterial
    public Animation: Animation
    public Children: GameObject[]
    public Visible: boolean
    public Begin: GameObjectFunction
    public Update: GameObjectFunction
    public End: GameObjectFunction

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
        begin = function(this:GameObject){},
        update = function(this:GameObject){},
        end = function(this:GameObject){},
        children = [],
        visible = true
    }: IGameObject = new IGameObject)
    {
        super(name)
        
        if (transform)
        {
            this.Transform = transform
        }
        
        this.Mesh = mesh
        this.Material = material
        this.Physics = physics
        this.Animation = animation
    
        if (begin)
        {
            this.Begin = begin.bind(this)
        }

        if (update)
        {
            this.Update = update.bind(this)
        }
        
        if (end)
        {
            this.End = end.bind(this)
        }

        if (children)
        {
            for (let child of children)
            {
                this.Children.push(child)
            }
        }

        if (visible !== undefined)
        {
            this.Visible = visible
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