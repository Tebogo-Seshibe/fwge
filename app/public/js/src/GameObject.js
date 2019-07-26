import Item from './Item';
import Transform from './Transform';
export let GameObjects = [];
export class IGameObject {
    constructor() {
        this.transform = new Transform();
    }
}
export default class GameObject extends Item {
    constructor({ name, transform = new Transform, material, mesh, physics, animation, begin = () => undefined, update = () => undefined, end = () => undefined, children = [] } = new IGameObject) {
        super(name);
        this.Begin = begin.bind(this);
        this.Update = update.bind(this);
        this.End = end.bind(this);
        this.Transform = transform;
        this.Mesh = mesh;
        this.Material = material;
        this.Physics = physics;
        this.Animation = animation;
        this.Children = [];
        for (let child of children) {
            this.Children.push(child);
        }
        GameObjects.push(this);
    }
    Clone() {
        return GameObject.Clone(this);
    }
    static Clone(gameObject) {
        let children = gameObject.Children.map(child => child.Clone());
        return new GameObject({
            name: gameObject.Name,
            transform: new Transform({
                position: gameObject.Transform.Position,
                rotation: gameObject.Transform.Rotation,
                scale: gameObject.Transform.Scale,
                shear: gameObject.Transform.Shear
            }),
            mesh: gameObject.Mesh,
            material: gameObject.Material,
            physics: gameObject.Physics,
            begin: gameObject.Begin,
            update: gameObject.Update,
            end: gameObject.End,
            children
        });
    }
}
//# sourceMappingURL=GameObject.js.map