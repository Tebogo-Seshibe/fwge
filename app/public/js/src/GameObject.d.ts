import Item from './Item';
import Mesh from './Render/Mesh';
import PhysicsMaterial from './Physics/PhysicsMaterial';
import RenderMaterial from './Render/RenderMaterial';
import Transform from './Transform';
declare type GameObjectFunction = (this: GameObject) => void;
export declare let GameObjects: Array<GameObject>;
export declare class IGameObject {
    name?: string;
    transform?: Transform;
    material?: RenderMaterial;
    mesh?: Mesh;
    physics?: PhysicsMaterial;
    animation?: Animation;
    begin?: GameObjectFunction;
    update?: GameObjectFunction;
    end?: GameObjectFunction;
    children?: Array<GameObject>;
}
export default class GameObject extends Item {
    Bame: string;
    Transform: Transform;
    Material: RenderMaterial;
    Mesh: Mesh;
    Physics: PhysicsMaterial;
    Animation: Animation;
    Begin: GameObjectFunction;
    Update: GameObjectFunction;
    End: GameObjectFunction;
    Children: Array<GameObject>;
    constructor({ name, transform, material, mesh, physics, animation, begin, update, end, children }?: IGameObject);
    Clone(): GameObject;
    static Clone(gameObject: GameObject): GameObject;
}
export {};
