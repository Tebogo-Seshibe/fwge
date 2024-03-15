import { AreaLight, Camera, DirectionalLight, Game, Material, PointLight, Prefab, RenderSystem, Scene, Script, ScriptSystem, Shader, SpotLight, StaticMesh, Tag, Transform } from "@fwge/core"
import { Class, Component, Constructor, Entity, System, Type } from "@fwge/ecs"
import { Input, InputSystem } from "@fwge/input"
import { CubeCollider, MeshCollider, PhysicsSystem, RigidBody, SphereCollider } from "@fwge/physics"
import { ParticleSpawner } from "@fwge/render"
import { ILoader } from "./ILoader"

interface SceneConfig
{
    systems: number[]
    entities: number[]
}

interface SystemConfig
{
    type: string
    config: any
}

interface EntityConfig
{
    type: string
    components?: number[]
    config?: any
}

interface ComponentConfig
{
    type: string
    config: any
}

interface GameConfig
{
    startUpScene: number,
    scenes: SceneConfig[]
    systems: SystemConfig[]
    entities: EntityConfig[]
    components: ComponentConfig[]
}

interface Indexer
{
    type: string
    index: number   
}

export const TypeMappers: Map<string, Type<any>> = new Map()

//#region Systems
TypeMappers.set('InputSystem', InputSystem)
TypeMappers.set('ScriptSystem', ScriptSystem)
TypeMappers.set('PhysicsSystem', PhysicsSystem)
TypeMappers.set('RenderSystem', RenderSystem)
// TypeMappers.set('ParticleSystem', ParticleSystem)
//#endregion

//#region Entities
TypeMappers.set('Entity', Entity)
//#endregion

//#region Components
TypeMappers.set('Audio', Audio)

TypeMappers.set('Script', Script)
TypeMappers.set('Tag', Tag)
TypeMappers.set('Transform', Transform)

TypeMappers.set('Input', Input)

TypeMappers.set('CubeCollider', CubeCollider)
TypeMappers.set('MeshCollider', MeshCollider)
TypeMappers.set('SphereCollider', SphereCollider)
TypeMappers.set('RigidBody', RigidBody)

TypeMappers.set('AreaLight', AreaLight)
// TypeMappers.set('AmbientLight', AmbientLight)
TypeMappers.set('DirectionalLight', DirectionalLight)
TypeMappers.set('PointLight', PointLight)
TypeMappers.set('SpotLight', SpotLight)
// TypeMappers.set('DynamicMesh', DynamicMesh)
TypeMappers.set('StaticMesh', StaticMesh)
TypeMappers.set('ParticleSpawner', ParticleSpawner)
TypeMappers.set('ShaderAsset', Shader)
TypeMappers.set('Camera', Camera)
TypeMappers.set('Material', Material)

// TypeMappers.set('UIComponent', UIComponent)
//#endregion

export const GameLoader: ILoader<Scene[] | void> = (src: string, game: Game) =>
{    
    const newGame: GameConfig = JSON.parse(src)
    const components: Component[] = []
    const entities: Prefab<any>[] = []
    const systems: System[] = []
    const scenes: Scene[] = []

    for (const systemConfig of newGame.systems)
    {
        const constructor = TypeMappers.get(systemConfig.type)
        if (constructor)
        {
            const newSystem: System = systemConfig.config instanceof Array
                ? new constructor(...systemConfig.config)
                : new constructor(systemConfig.config)
            systems.push(newSystem)
        }
    }

    for (const componentConfig of newGame.components)
    {
        const constructor = TypeMappers.get(componentConfig.type)
        if (constructor)
        {
            const newComponent = componentConfig.config instanceof Array
                ? new constructor(...componentConfig.config)
                : new constructor(componentConfig.config)
            components.push(newComponent)
        }
    }
    
    for (const entityConfig of newGame.entities)
    {
        const constructor = TypeMappers.get(entityConfig.type)! as Constructor<any>
        if (constructor)
        {
            const newEntity = new Prefab(constructor)
            entities.push(newEntity)
            
            if (entityConfig.components)
            {
                for (const componentIndex of entityConfig.components)
                {
                    newEntity.AddComponent(components[componentIndex])
                }
            }
        }
    }
    
    for (const scene of newGame.scenes)
    {
        const newScene = {} as Scene
        // for (const systemIndex of scene.systems)
        // {
        //     newScene.UseSystem(systems[systemIndex])
        // }
        // for (const entityIndex of scene.entities)
        // {
        //     entities[entityIndex].Instance(newScene)
        // }
        scenes.push(newScene)
    }

    return scenes
    // const config = JSON.parse(src) as GameConfig
    // return scene
}