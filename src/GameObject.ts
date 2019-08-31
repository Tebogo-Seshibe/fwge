import Cloneable from './Interfaces/Cloneable';
import Destroyable from './Interfaces/Destroyable';
import Updateable from './Interfaces/Updateable';
import Item from './Item';
import PhysicsMaterial from './Physics/PhysicsMaterial';
import Mesh from './Render/Mesh';
import RenderMaterial from './Render/RenderMaterial';
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
    Transform: Transform = new Transform()
    Mesh: Mesh
    Material: RenderMaterial
    Physics: PhysicsMaterial
    Animation: Animation
    Children: GameObject[] = []
    Visible: boolean = true
    Begin: GameObjectFunction = function(this: GameObject): void { }
    Update: GameObjectFunction = function(this: GameObject): void { }
    End: GameObjectFunction = function(this: GameObject): void { }

    constructor()
    constructor(gameObject: IGameObject)
    constructor(
    { 
        name = 'GameObject',
        transform,
        material,
        mesh,
        physics,
        animation,
        begin,
        update,
        end,
        children,
        visible 
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

        this.Children = []
        for (let child of children)
        {
            this.Children.push(child)
        }

        this.Visible = visible
        
        GameObjects.push(this)
    }

    public Destroy(): void
    {

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