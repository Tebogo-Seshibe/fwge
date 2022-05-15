import { Game, Scene } from "../base"
import { Class } from "../ecs"

interface GameConfig
{
    scenes: Class<Scene>[]
}

export function FWGEGame(config: GameConfig): ClassDecorator
{
    return function <TFunction extends Function>(target: TFunction): void
    {
        const OnInit = Reflect.get(target.prototype, 'OnInit') as Function
        delete target.prototype['OnInit']
        Reflect.set(target.prototype, 'OnInit', function (this: Game)
        {

            if (!this['_scenes'])
            {
                this['_scenes'] = []
            }
            
            for (const scene of config.scenes)
            {
                const newScene = new scene(this)
                newScene.OnInit()
                this['_scenes'].push(newScene)
            }

            OnInit()
        })
    }
}