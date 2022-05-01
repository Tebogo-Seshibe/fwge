import { Game, Scene } from "@fwge/core";
import { ILoader } from "./ILoader";

interface SceneConfig
{
    
}

interface SystemConfig
{
    
}

interface EntityConfig
{
    
}

interface ComponentConfig
{
    
}

interface GameConfig
{
    startUpScene: number,
    scenes: SceneConfig[]
    systems: SystemConfig[]
    entities: EntityConfig[]
    components: ComponentConfig[]
}

export const SceneLoader: ILoader<Scene> = (src: string, game: Game) =>
{
    const scene = game.CreateScene()
    const config = JSON.parse(src) as GameConfig
    return scene
}
let exampleSceneConfig = {
    startUpScene: 0,
    scenes: [
        {
            systems: [
               ['InputSystem', 0],
               ['ScriptSystem', 0],
               ['PhysicsSystem', 0],
               ['MeshRenderSystem', 0],
               ['ParticleSystem', 0],
               ['ColliderOutlineSystem', 0]
            ],
            entities: [

            ]
        }
    ],
    systems: {
        InputSystem: [
            { }
        ],
        ScriptSystem: [
            { }
        ],
        PhysicsSystem: [
            { }
        ],
        MeshRenderSystem: [{ 
            renderGrid: true,
            min: -100,
            max: 100,
            step: 1,
            wireframe: false
        }],
        ParticleSystem: [
            { }
        ],
        ColliderOutlineSystem: [
            { }
        ],
    },
    components: {
        Transform: [
            {
                position: [0, 0, 0],
                rotation: [0,0,0],
                scale: [1, 1, 1],
                shear: [0, 0, 0]
            },
            {
                position: [0, 1.8, 0],
                rotation: [0,0,0],
                scale: [1, 1, 1],
                shear: [0, 0, 0]
            }
        ]
    },
    entities: [

    ]
}