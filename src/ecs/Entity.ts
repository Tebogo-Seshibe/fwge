import { Component } from './Component'
import { Class, ComponentId, EntityId, Registry, TypeId } from './Registry'
import { Scene } from './Scene'

export class Entity
{
    private _components: Map<TypeId, ComponentId> = new Map()
    
    constructor(
        private readonly _scene: Scene,
        public readonly Id: EntityId = -1
    ) { }

    public AddComponent<T extends Component>(component: T): Entity
    {
        Registry.addComponent(component.Type, component)
        Registry.attachComponent(this.Id, component)

        this._components.set(component.Type, component.Id)
        
        this._scene.OnEntity(this)

        return this
    }

    public GetComponent<T extends Component>(type: Class<T>): T | undefined
    {
        const typeId = Registry.getComponentTypeId(type)!

        return Registry.getComponent(typeId, this._components.get(typeId)!)
    }

    public HasComponent<T extends Component>(type: Class<T>): boolean
    {
        return this._components.has(Registry.getComponentTypeId(type)!)
    }
    
    public RemoveComponent<T extends Component>(type: Class<T>): Entity
    {
        Registry.detachComponent(this.Id, this.GetComponent(type)!)

        this._scene.OnEntity(this)
        
        return this
    }
}
