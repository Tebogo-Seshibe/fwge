import { GL } from "@fwge/common"
import { Game, Scene } from "../base"
import { Class, SharedComponent } from "../ecs"

interface GameConfig
{
    height?: number
    width?: number
    canvas: HTMLCanvasElement | (() => HTMLCanvasElement)
    library: Array<[string, () => SharedComponent]>
    scenes: Class<Scene>[]
}

export function FWGEGame(config: GameConfig)
{
    return function (target: Class<Game>): void
    {
        const Init = target.prototype['Init'] as (this: Game) => void        
        target.prototype['Init'] = function (this: Game): void
        {
            const canvas = config.canvas instanceof HTMLCanvasElement
                ? config.canvas
                : config.canvas()

            this['init'](canvas)

            GL.canvas.width = config.width ?? 1920
            GL.canvas.height = config.height ?? 1080
            GL.viewport(0, 0, GL.drawingBufferWidth, GL.drawingBufferHeight)
            GL.clearColor(0,0,0,0)
            GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT)


            if (!this['_scenes'])
            {
                this['_scenes'] = new Map()
            }
        
            if (!this['_scenesIds'])
            {
                this['_scenesIds'] = new Map()
            }
            
            for (const [ name, libraryBuilder ] of config.library)
            {
                this.AddToLibrary(name, libraryBuilder())
            }

            for (const SceneConstructor of config.scenes)
            {
                const newScene = new SceneConstructor()
                newScene.Game = this

                this['_scenes'].set(newScene.Id, newScene)
                this['_scenesIds'].set(SceneConstructor, newScene.Id)

            }

            Init.apply(this)
        }
    }
}
