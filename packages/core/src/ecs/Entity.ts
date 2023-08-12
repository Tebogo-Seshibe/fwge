import { CreateUUID, UUID } from '@fwge/common';
import { Scene } from '../base/Scene';
import { Component } from './Component';
import { Class, EntityId, Registry } from './Registry';

export class Entity 
{
    public readonly Id: EntityId;
    public readonly UUID: UUID;

    private _parent: Entity | undefined;
    private _scene: Scene;
    private _childrenIds: EntityId[] = [];

    public get Scene(): Scene
    {
        return this._scene;
    }

    public get Parent(): Entity | undefined
    {
        return this._parent;
    }

    public set Parent(parent: Entity | undefined)
    {
        this._parent = parent;
    }

    public get Children(): Entity[]
    {
        const entities: Entity[] = [];
        for (let i = 0; i < this._childrenIds.length; ++i)
        {
            entities.push(this.Scene.GetEntity(this._childrenIds[i])!);
        }
        return entities;
    }

    public get Components(): Record<string, Component>
    {
        return Registry.getAllComponents(this.Id).reduce((prev, component) => ({ ...prev, [component.Type.name]: component }), {});
    }
    //#endregion

    constructor(scene: Scene, uuid?: UUID)
    {
        this._scene = scene;
        this.Id = Registry.createEntity();
        this.UUID = uuid ?? CreateUUID();
    }

    //#region Component Methods
    public AddComponent<T extends Component>(component: T): Entity
    {
        Registry.addComponent(this.Id, component);
        component.AddOwner(this);
        return this;
    }

    public GetComponent<T extends Component>(componentType: Class<T>): T | undefined;
    public GetComponent<T extends Component, U extends T = T>(componentType: Class<T>, childComponentType: Class<U>): U | undefined;
    public GetComponent<T extends Component, U extends T = T>(componentType: Class<T>, _?: Class<U>): U | undefined
    {
        return Registry.getComponent(this.Id, componentType) as U;
    }

    public HasComponent<T extends Component>(componentType: Class<T>): boolean
    {
        return Registry.hasComponent(this.Id, componentType);
    }

    public RemoveComponent<T extends Component>(componentType: Class<T>): Entity
    {
        const component = Registry.removeComponent(this.Id, componentType);
        component.RemoveOwner(this);        
        return this;
    }
    //#endregion

    //#region Children Entity Methods
    public AddChild(entity: Entity): Entity;
    public AddChild(entity: EntityId): Entity;
    public AddChild(arg: EntityId | Entity): Entity
    {
        const child = typeof arg === 'number' ? arg : arg.Id;

        if (child !== this.Id && !this._childrenIds.includes(child))
        {
            this._childrenIds.push(child);
            this.Scene.GetEntity(child)!.Parent = this;
        }

        return this;
    }

    public GetChild(index: number): Entity
    {
        if (index >= this._childrenIds.length)
        {
            throw new Error(`Index out of range`);
        }

        return this.Scene.GetEntity(this._childrenIds[index])!;
    }

    public RemoveChild(arg: Entity): Entity;
    public RemoveChild(arg: EntityId): Entity;
    public RemoveChild(arg: EntityId | Entity): Entity
    {
        const child = typeof arg === 'number' ? arg : arg.Id;
        const index = this._childrenIds.indexOf(child);

        if (index !== -1)
        {
            this._childrenIds.swap(index, this._childrenIds.length - 1);
            this._childrenIds.pop();
            this.Scene.GetEntity(child)!.Parent = undefined;
        }

        return this;
    }
    //#endregion

    //#region Lifecycle
    public Destroy()
    {
        this.OnDestroy();

        this._scene = undefined!;
        this._parent = undefined!;
        this._childrenIds = undefined!;

        Registry.removeEntity(this.Id);
    }

    OnCreate(): void { }
    OnDestroy(): void { }
    //#endregion
}