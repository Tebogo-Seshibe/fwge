// import 'reflect-metadata'
// import { Component, Entity, Class, EntityId, nextId, TypeId } from "../ecs"

// export function Entity()
// {
//     return function <T extends Class<any>>(EntityClass: T): T & Class<Entity>
//     {
//         return class extends EntityClass
//         {
//             public readonly Id: EntityId = nextId(Entity)
//             public OnCreate(): void { }
//             public OnDestroy(): void { }
            
//             //#region Properties
//             public get Parent(): Entity | undefined
//             {
//                 return this._parent
//             }
        
//             public set Parent(parent: EntityId | Entity | undefined)
//             {
//                 const newParent = typeof parent === 'number'
//                     ? this.Scene.GetEntity(parent)
//                     : parent
        
//                 if (newParent && newParent.Id !== this.Id)
//                 {
//                     this._parent = newParent
//                 }
//             }
            
//             public get Children(): Entity[]
//             {
//                 return this._children
//                     .filter(x => x !== undefined) as Entity[]
//             }
        
//             public get Components(): { [key: string]: Component }
//             {
//                 return [...this._components.values()]
//                     .reduce((prev, curr) => ({ ...prev, [curr!.Type.name]: curr }), { })
//             }
//             //#endregion
        
//             //#region Component Methods
//             public AddComponent<T extends Component>(component: T): Entity
//             {
//                 debugger
//                 component.AddOwner(this as any as Entity)
//                 this._components.set(component.Type._typeId!, component)
//                 this.Scene.OnEntity(this)
        
//                 return this as any as Entity
//             }
        
//             public GetComponent<T extends Component>(componentType: Class<T>): T | undefined
//             {
//                 if (!this._components)
//                 {
//                     this._components = new Map()
//                 }
//                 return this._components.get(componentType._typeId!) as T
//             }
        
//             public HasComponent<T extends Component>(componentType: Class<T>): boolean
//             {
//                 if (!this._components)
//                 {
//                     this._components = new Map()
//                 }
//                 return this._components.has(componentType._typeId!)
//             }
            
//             public RemoveComponent<T extends Component>(componentType: Class<T>): Entity
//             {
//                 if (!this._components)
//                 {
//                     this._components = new Map()
//                 }
//                 const component = this._components.get(componentType._typeId!)
//                 if (component)
//                 {
//                     component.RemoveOwner(this as any as Entity)
//                     this._components.delete(component.Type._typeId!)
//                     this.Scene.OnEntity(this)
//                 }
        
//                 return this as any as Entity
//             }
//             //#endregion
            
//             //#region Children Entity Methods
//             public AddChild(entity: Entity): Entity
//             public AddChild(entity: EntityId): Entity
//             public AddChild(arg: EntityId | Entity): Entity
//             {
//                 const child = typeof arg === 'number'
//                     ? this.Scene.GetEntity(arg)!
//                     : arg as Entity
                
//                 if (child && this !== child && !this._children.includes(child))
//                 {
//                     this._children.push(child)
//                     child.Parent = this
//                 }
        
//                 return this as any as Entity
//             }
        
//             public GetChild(index: number): Entity
//             {
//                 if (index >= this._children.length)
//                 {
//                     throw new Error(`Index out of range`)
//                 }
                
//                 return this._children[index]
//             }
        
//             public RemoveChild(arg: Entity): Entity
//             public RemoveChild(arg: EntityId): Entity
//             public RemoveChild(arg: EntityId | Entity): Entity
//             {
//                 const child = typeof arg === 'number'
//                     ? this.Scene.GetEntity(arg)!
//                     : arg
        
//                 const childIndex = this._children.indexOf(child)
//                 if (this.Id !== child.Id && childIndex !== -1)
//                 {
//                     this._children.swap(childIndex, this._children.length - 1)
//                     this._children.pop()
//                     child.Parent = undefined
//                 }
        
//                 return this as any as Entity
//             }
//             //#endregion
            
//             private _children: Entity[] = []
//             private _parent?: Entity
//             private _components: Map<TypeId, Component> = new Map()
//         }
//     }
// }
