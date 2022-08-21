export default `import { Game } from '@fwge/core'
import { Main } from './scenes'

export class {{ GameName }} extends Game
{

    constructor()
    {
        super({
            canvas: () => document.querySelector<HTMLCanvasElement>('#canvas')!,
            height: 1080,
            width: 1920,
            startupScene: Main,
            scenes: [
                Main
            ],
            components: [                
            ],
            assets: [                
            ],
        })
    }
}

`