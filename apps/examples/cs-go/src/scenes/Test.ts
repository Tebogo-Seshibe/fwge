import { DefaultWindow, Game, Scene } from "@fwge/core";
import { Component, Entity, Registry, System } from "@fwge/ecs";

class PlayerTag extends Component {
    constructor(){
        super();
    }
}

export class Test extends Scene
{
    constructor(game: Game)
    {
        super(game,
        {
            windows: [ new DefaultWindow() ],
            systems: [
                new class extends System {
                    hmm = Registry.RegisterView([PlayerTag])
                    Init(): void
                    {
                        console.log('init')
                        console.log(this.hmm, Registry.GetView(this.hmm))
                    }
                    Start(): void
                    {
                        console.log('start')
                    }
                    Update(_delta: number): void
                    {
                        for (const entityId of Registry.GetView(this.hmm))
                        {
                            const hmm = Registry.GetComponent(entityId, PlayerTag)!;
                            console.log('Yep', entityId, hmm.Id);
                        }
                    }
                    Stop(): void
                    {
                        console.log('stop')
                    }

                }
            ],
            entities: [
                new class extends Entity {
                    Init(): void
                    {
                        console.log('new Entity')
                        this.AddComponent(new PlayerTag())
                    }

                }
            ],
        })
    }
}
