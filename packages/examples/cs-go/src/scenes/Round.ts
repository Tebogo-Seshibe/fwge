import { AreaLight, Entity, Game, Material, RenderSystem, Scene, Script, ScriptSystem, Shader, Tag, Transform } from "@fwge/core";
import { InputSystem } from "@fwge/input";
import { MTLLoader, OBJLoader, OBJMTLPrefabBuilder } from "@fwge/io";
import { FPSController } from "../entities";
import { FullScreen } from "../entities/FullScreen";
import { Platform } from "../entities/Platform";
import { FPSCounterSystem } from "../systems/FPSCounterSystem";
import shapesMTL from '/public/objects/shapes/shapes.mtl?raw';
import shapesOBJ from '/public/objects/shapes/shapes.obj?raw';

export class Round extends Scene
{
    fpsCounterDiv!: HTMLDivElement;

    constructor(game: Game)
    {
        super(game, {
            entities: [
                FullScreen,
                FPSController,
                Platform,
                OBJMTLPrefabBuilder(
                    OBJLoader(shapesOBJ),
                    MTLLoader(shapesMTL, game.GetAsset('Basic Shader', Shader))
                ).AddComponent(new Tag('Shapes'))
                    .AddComponent(new Transform(
                        {
                            position: [0, 4.5, 0]
                        }))
                    .AddComponent(new Script(
                        {
                            start()
                            {
                                (this as Entity).Children.forEach(child =>
                                {
                                    const r = Math.random();
                                    const g = Math.random();
                                    const b = Math.random();

                                    child.GetComponent(Material)!.Colour.Set(r, g, b);
                                });
                            },
                            update(delta)
                            {
                                const transform = (this as Entity).GetComponent(Transform)!;
                                transform.Rotation.Y += delta * 15;
                                transform.Rotation.Z += delta * 25;
                            }
                        })),
            ],
            systems: [
                InputSystem,
                ScriptSystem,
                RenderSystem,
                FPSCounterSystem
            ]
        });
    }

    Init(): void
    {
        this.fpsCounterDiv = document.querySelector<HTMLDivElement>('#fpsCounter')!;
        this.CreateEntity().AddComponent(new AreaLight(
            {
                colour: [1, 1, 1],
                intensity: 1.0
            }));
        super.Init();
    }

    Update(delta: number): void
    {
        super.Update(delta);

        const fps = Math.round(delta === 0 ? 0 : 1 / delta);
        this.fpsCounterDiv.innerText = (fps < 10 ? '  ' + fps : fps < 100 ? ' ' + fps : fps) + 'fps';
    }
}
