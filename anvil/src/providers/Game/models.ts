import { Class, Component, SharedComponent, System } from '@fwge/core'

export interface GameState
{
    scenes: SceneState[]
    components: Class<Component>[]
    libraries: Class<SharedComponent>[]
}

interface SceneState
{
    entities: EntityState[]
    systems: SystemState[]
}

interface EntityState
{
    name: string
    components: ComponentState[]
}

interface SystemState extends ConcreteState<System> { }

interface ComponentState extends ConcreteState<Component> { }

interface ConcreteState<T>
{
    type: Class<T>
    val: T
}