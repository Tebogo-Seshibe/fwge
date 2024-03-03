import { randBetween } from "@fwge/common";
import { BasicLitMaterial, DefaultWindow, Game, MeshRenderer, RenderMode, RenderType, Renderer, Scene, Script, ScriptSystem, Shader, StaticMesh, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";
import { Input, InputSystem, KeyState } from "@fwge/input";
import { tetrominoI, tetrominoJ, tetrominoL, tetrominoO, tetrominoS, tetrominoT, tetrominoZ } from "../assets/TetrominoMesh";
import { tetrominoShaderFrag, tetrominoShaderVert } from "../assets/TetrominoShader";
import { Player } from "../entities";
import { RenderSystem } from "../systems";

enum BoardState
{
    EMPTY,
    BLOCK
}

export class Level extends Scene
{
    currentTetromino!: Entity;

    tetrominoScript!: Script;
    tetrominoInput!: Input;
    tetrominoMeshes!: MeshRenderer[];
    tetrominoShader!: Shader;
    tick = 0;
    dropRate = 1;
    
    inputReset = false;
    rows = 20;
    columns = 10;
    grid = new Uint8ClampedArray(this.rows * this.columns) as any as BoardState[];

    private getGridData(row: number, column: number): BoardState
    {
        const index = (this.rows * row) + column;
        return this.grid[index];
    }

    private setGridData(row: number, column: number, value: BoardState): void
    {
        const index = (this.rows * row) + column;
        this.grid[index] = value;
    }

    private isFullRow(row: number): boolean
    {
        for (let i = 0; i < this.columns; ++i)
        {
            if (this.getGridData(row, i) === BoardState.EMPTY)
            {
                return false;
            }
        }
        return true;
    }

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
                asset: new StaticMesh({
                    ...tetrominoO,
                    // instances: [{position: [0,0,0], rotation: [0,0,0], scale: [1,1,1]}]
                }),
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

                // Find what blocks we occupy
                // Determine whether we can move down
                // Move down if we can
                // Kill current tetromino if not

                const indices = [-1,-1,-1,-1,]
                const asset = this.currentTetromino.GetComponent(Renderer)!.Asset;
                switch (asset.Name)
                {
                    case 'O':
                        
                        break;
                }

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
                    this.inputReset = false;
                    this.dropNewTetromino();
                }
            },
        });

        this.tetrominoInput = new Input(
        {
            onInput: (_, { KeyA, KeyD, KeyW, KeyS, KeyLeft, KeyRight, KeyUp, KeyDown }) =>
            {
                const transform = this.currentTetromino.GetComponent(Transform)!;

                if (
                    this.inputReset &&
                    ((KeyS === KeyState.PRESSED || KeyDown === KeyState.PRESSED) ||
                    (KeyS === KeyState.DOWN || KeyDown === KeyState.DOWN))
                )
                {
                    transform.Position.Y -= 1;
                }
                
                if (!this.inputReset && KeyS === KeyState.UP && KeyDown === KeyState.UP)
                {
                    this.inputReset = true;
                }

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

        this.currentTetromino = new Entity()
            .AddComponent(this.tetrominoInput)
            .AddComponent(this.tetrominoScript)
            .AddComponent(new Transform(
            {
                position: [ 0, 20, 0 ],
                rotation: [ 0,  0, Math.floor(randBetween(1,4)) * 90 ]
            }))
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
