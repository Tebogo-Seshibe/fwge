import GameItem from './GameItem'
import Cloneable from './Interfaces/Cloneable'
import Destroyable from './Interfaces/Destroyable'
import Item from './Item'
import List from './Utility/List'
import Mesh from './Render/Mesh'
import PhysicsMaterial from './Physics/PhysicsMaterial'
import RenderMaterial from './Render/RenderMaterial'
import Transform from './Transform'
import Updateable from './Interfaces/Updateable'

type GameObjectFunction = (this: GameObject) => void

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
    children?: Array<GameObject>
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

    constructor({ name, transform = new Transform, material, mesh, physics, animation, begin = (): void => undefined, update = (): void => undefined, end = (): void => undefined, children = [] }: IGameObject = new IGameObject)
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

        GameObjects.push(this)
    }

    Destroy(): void
    {

    }

    Clone(): GameObject
    {
        return GameObject.Clone(this)
    }

    static Clone(gameObject: GameObject): GameObject
    {   
        let children = gameObject.Children.map(child => child.Clone())

        return new GameObject(
        {
            name:       gameObject.Name,
            transform:  new Transform(
            {
                position:   gameObject.Transform.Position,
                rotation:   gameObject.Transform.Rotation,
                scale:      gameObject.Transform.Scale,
                shear:      gameObject.Transform.Shear
            }),
            mesh:       gameObject.Mesh,
            material:   gameObject.Material,
            physics:    gameObject.Physics,
            begin:      gameObject.Begin,
            update:     gameObject.Update,
            end:        gameObject.End,
            children
        });
    }
}