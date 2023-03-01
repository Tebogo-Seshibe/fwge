export default `import { Game, RenderSystem, Scene, ScriptSystem } from "@fwge/core"

export class {{ SceneName }} extends Scene
{
    
    constructor(game: Game)
    {
        super(game, {
            entities: [
            ],
            systems: [
                ScriptSystem,
                RenderSystem,
            ],
        })
    }
}

`