// import { Game, Scene } from "../base"
// import { Class, Constructor, Entity, EntityId, SceneId, System, nextId } from "../ecs"

// export interface SceneConfig
// {
//     systems: Class<System>[]
//     entities: Class<any>[]
// }

// export function Scene(config: SceneConfig)
// {
//     return function <T extends Class<any>>(BaseScene: T): T & Class<Scene>
//     {
//         return class extends BaseScene
//         {            
//             public readonly Id: SceneId = nextId(BaseScene)

//             public set Game(game: Game)
//             {
//                 this._game = game
//             }

//             public get Game(): Game
//             {
//                 return this._game
//             }
            
//             public Init(): void
//             {
//                 for (const [ , entity] of this._entities)
//                 {
//                     entity.OnCreate()
//                 }

//                 for (const system of this._systems)
//                 {
//                     system.Scene = this as any as Scene
//                     for (const [, entity] of this._entities)
//                     {
//                         system.OnUpdateEntity(entity)
//                     }
//                     system.Init()
//                 }
//             }
            
//             public Start(): void
//             {
//                 if (!this._running)
//                 {
//                     this._running = true
//                     for (const system of this._systems)
//                     {
//                         system.onStart()
//                     }
//                 }
//             }

//             public Update(delta: number): void
//             {
//                 for (const system of this._systems)
//                 {
//                     system.Update(delta)
//                 }
//             }

//             public Stop(): void
//             {
//                 if (this._running)
//                 {
//                     for (const system of this._systems)
//                     {
//                         system.onStop()
//                         system.Reset()
//                     }
//                     this._running = false
//                 }
//             }
            
//             public AddSystem(system: System)
//             {
//                 this._systems.push(system)
//             }

//             //#region Entity Logic
//             public CreateEntity(): Entity
//             public CreateEntity<T extends Entity, K extends any[]>(constructor: Constructor<T, [Scene, ...K]>, ...args: K): T
//             public CreateEntity<T extends Entity, K extends any[]>(constructor?: Constructor<T, [Scene, ...K]>, ...args: K): T
//             {
//                 const entity = constructor 
//                     ? new constructor(this as any as Scene, ...args) 
//                     : new Entity(this as any as Scene)
//                 this._entities.set(entity.Id, entity)
//                 this.OnEntity(entity)
//                 entity.OnCreate()

//                 return entity as T
//             }

//             public GetEntity(entityId: EntityId): Entity | undefined
//             {
//                 return this._entities.get(entityId)
//             }

//             public RemoveEntity(entityId: EntityId): void
//             public RemoveEntity(entity: Entity): void
//             public RemoveEntity(arg: EntityId | Entity): void
//             {
//                 const entity = typeof arg === 'number'
//                     ? this.GetEntity(arg)
//                     : arg

//                 if (entity && this._entities.has(entity.Id))
//                 {
//                     this._entities.delete(entity.Id)
//                     this.OnEntity(entity)
//                     entity.OnDestroy()
//                 }
//             }

//             public OnEntity(entity: Entity): void
//             {
//                 if (this._running)
//                 {
//                     for (const system of this._systems)
//                     {
//                         system.OnUpdateEntity(entity)
//                     }
//                 }
//             }
//             //#endregion
            
//             private _game!: Game
//             private _entities: Map<EntityId, Entity> = new Map()
//             private _systems: System[] = []
//             private _running: boolean = false
            
//             constructor(..._: any[])
//             {
//                 super()
                
//                 for (const SystemConstructor of config.systems)
//                 {
//                     const system = new SystemConstructor()                
//                     this._systems.push(system)
//                 }

//                 for (const EntityConstructor of config.entities)
//                 {
//                     const newEntity = new EntityConstructor(this)
//                     this._entities.set(newEntity.Id, newEntity)
//                 }
//             }
//         }
//     }
// }
