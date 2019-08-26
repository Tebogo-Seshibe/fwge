import Cloneable from './Interfaces/Cloneable';
import Destroyable from './Interfaces/Destroyable';
import Updateable from './Interfaces/Updateable';
import Item from './Item';
import PhysicsMaterial from './Physics/PhysicsMaterial';
import Mesh from './Render/Mesh';
import RenderMaterial from './Render/RenderMaterial';
import Transform from './Transform';

export type GameObjectFunction = (this: GameObject) => void

export let GameObjects: GameObject[] = new Array<GameObject>()

export class IGameObject
{
    name?: string
    transform?: Transform = new Transform()
    material?: RenderMaterial
    mesh?: Mesh
    physics?: PhysicsMaterial
    animation?: Animation
    begin?: GameObjectFunction
    update?: GameObjectFunction
    end?: GameObjectFunction
    children?: GameObject[]
    visible?: boolean
}

export default class GameObject extends Item implements Cloneable<GameObject>, Destroyable, Updateable
{
    Transform: Transform
    Material: RenderMaterial
    Mesh: Mesh
    Physics: PhysicsMaterial
    Animation: Animation
    Begin: GameObjectFunction
    Update: GameObjectFunction
    End: GameObjectFunction
    Children: Array<GameObject>
    Visible: boolean = true

    constructor()
    constructor(gameObject: IGameObject)
    constructor(
    { 
        name, 
        transform = new Transform,
        material,
        mesh,
        physics,
        animation,
        begin = function(this: GameObject): void { },
        update = function(this: GameObject): void { },
        end = function(this: GameObject): void { },
        children = [],
        visible = true 
    }: IGameObject = new IGameObject)
    {
        super(name);
    
        this.Begin = begin.bind(this)
        this.Update = update.bind(this)
        this.End = end.bind(this)

        this.Transform = transform
        this.Mesh = mesh
        this.Material = material
        this.Physics = physics
        this.Animation = animation

        this.Children = []
        for (let child of children)
        {
            this.Children.push(child)
        }

        this.Visible = visible
        
        GameObjects.push(this)
    }

    Destroy(): void
    {

    }

    Clone(): GameObject
    {
        return new GameObject(
        {
            name:       this.Name + " Clone",
            transform:  new Transform(
            {
                position:   this.Transform.Position,
                rotation:   this.Transform.Rotation,
                scale:      this.Transform.Scale,
                shear:      this.Transform.Shear
            }),
            mesh:       this.Mesh,
            material:   this.Material,
            physics:    this.Physics,
            begin:      this.Begin,
            update:     this.Update,
            end:        this.End,
            children:   this.Children.map(child => child.Clone())
        });
    }
}