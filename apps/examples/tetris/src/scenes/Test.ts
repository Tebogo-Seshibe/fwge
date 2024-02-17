import { randBetween } from "@fwge/common";
import { BasicLitMaterial, DefaultWindow, Game, MeshRenderer, RenderMode, RenderType, Scene, Script, ScriptSystem, Shader, StaticMesh, Transform } from "@fwge/core";
import { Registry } from "@fwge/ecs";
import { Input, InputSystem, KeyState } from "@fwge/input";
import { tetrominoI, tetrominoJ, tetrominoL, tetrominoO, tetrominoS, tetrominoT, tetrominoZ } from "../assets/TetrominoMesh";
import { tetrominoShaderFrag, tetrominoShaderVert } from "../assets/TetrominoShader";
import { Player, Tetromino } from "../entities";
import { RenderSystem } from "../systems";

export class Test extends Scene
{
    currentTetromino!: Tetromino;
    tetrominoScript!: Script;
    tetrominoInput!: Input;
    tetrominoMeshes!: MeshRenderer[];
    tetrominoShader!: Shader;
    tick = 0;
    dropRate = 0.01;
    
    constructor(game: Game)
    {
        super(game,
        {
            windows: [ DefaultWindow ],
            systems:
            [
                InputSystem,
                ScriptSystem,
                RenderSystem
            ],
            entities:
            [
                Player
            ],
        });
    }

    Init(): void
    {
        this.tetrominoMeshes =
        [
            new MeshRenderer(
            {
                asset: new StaticMesh(tetrominoO),
                renderMode: RenderMode.FACE
            }),
            new MeshRenderer(
            {
                asset: new StaticMesh(tetrominoT),
                renderMode: RenderMode.FACE
            }),
            new MeshRenderer(
            {
                asset: new StaticMesh(tetrominoZ),
                renderMode: RenderMode.FACE
            }),
            new MeshRenderer(
            {
                asset: new StaticMesh(tetrominoS),
                renderMode: RenderMode.FACE
            }),
            new MeshRenderer(
            {
                asset: new StaticMesh(tetrominoJ),
                renderMode: RenderMode.FACE
            }),
            new MeshRenderer(
            {
                asset: new StaticMesh(tetrominoL),
                renderMode: RenderMode.FACE
            }),
            new MeshRenderer(
            {
                asset: new StaticMesh(tetrominoI),
                renderMode: RenderMode.FACE
            }),
        ];

        this.tetrominoScript = new Script(
        {
            update: (delta) =>
            {
                const transform = this.currentTetromino.GetComponent(Transform)!;

                if (transform.Position.Y > 0)
                {
                    if (this.tick > this.dropRate)
                    {
                        this.tick -= this.dropRate;
                        transform.Position.Y -= 1;
                    }
                    else
                    {
                        this.tick += delta;
                    }
                }

                if (transform.Position.Y === 0)
                {
                    this.dropNewTetromino();
                }
            },
        });

        this.tetrominoInput = new Input(
        {
            onInput: (_, { KeyA, KeyD, KeyW, KeyLeft, KeyRight, KeyUp }) =>
            {
                const transform = this.currentTetromino.GetComponent(Transform)!;

                if (KeyA === KeyState.PRESSED || KeyLeft === KeyState.PRESSED)
                {
                    transform.Position.X -= 1;
                }
                
                if (KeyD === KeyState.PRESSED || KeyRight === KeyState.PRESSED)
                {
                    transform.Position.X += 1;
                }
                
                if (KeyW === KeyState.PRESSED || KeyUp === KeyState.PRESSED)
                {
                    transform.Rotation.Z += 90;
                }
            }
        });

        this.tetrominoShader = new Shader(tetrominoShaderVert, tetrominoShaderFrag);
        
        super.Init();
    }

    private dropNewTetromino()
    {
        if (this.currentTetromino)
        {
            this.currentTetromino.RemoveComponents(Input, Script)
        }

        let index = Math.floor(Math.random() * this.tetrominoMeshes.length) % this.tetrominoMeshes.length;

        this.currentTetromino = new Tetromino()
            .AddComponent(this.tetrominoInput)
            .AddComponent(this.tetrominoScript)
            .AddComponent(new Transform({ position: [ 0, 10, 0 ] }))
            .AddComponent(this.tetrominoMeshes[index])
            .AddComponent(new BasicLitMaterial(
            {
                colour:     [ randBetween(5,10) / 10, randBetween(5,10) / 10, randBetween(5,10) / 10 ],
                renderType: RenderType.OPAQUE,
                shader:     this.tetrominoShader,
            }));

        this.Entities.push(this.currentTetromino.Id);
    }

    Start(): void
    {
        super.Start();
        
        this.dropNewTetromino();
    }
}
