import { CalcuateDelay, Vector2, createContext, type IDelay } from "@fwge/common";
import { Class, Component, ComponentId, Entity, EntityId, ListContainer, System, Type, TypeId } from "@fwge/ecs";
import { Asset } from "./Asset";
import { Scene, type SceneId } from "./Scene";
import { Shader } from "./shader/Shader";
import { RenderWindow } from "./render";

export type Head<T extends any[]> = T extends [infer U, ...infer _]
    ? U
    : never;

export type Tail<T extends any[]> = T extends [infer _, ...infer U]
    ? U
    : never;

export type Args<T> = T extends new (...args: any[]) => Component | System | Scene | Asset
    ? Head<ConstructorParameters<T>> extends Game
        ? [T, ...Tail<ConstructorParameters<T>>]
        : [T, ...ConstructorParameters<T>]
    : never;

export interface LibraryEntry<T>
{
    name: string;
    create: () => T;
}

export interface GameConfig
{
    debug?: boolean;
    protocol?: string;
    canvas?: HTMLCanvasElement | (() => HTMLCanvasElement);
    height: number;
    width: number;
}

export abstract class Game
{
    abstract UseAssets: Type<Asset>[];
    abstract UseScenes: Type<Scene>[];

    //#region Private Fields
    #dimensions: Vector2 = new Vector2();
    #currentScene: Scene | undefined = undefined;
    #currTick: number = -1;
    #prevTick: number = -1;
    #tickId: number | undefined = undefined;
    #delayId: number | undefined = undefined;
    #running: boolean = false;
    #debug: boolean = false;
    #canvas: HTMLCanvasElement;
    #gl!: WebGL2RenderingContext;
    //#endregion

    public get Height(): number
    {
        return this.#dimensions[1];
    }

    public set Height(height: number)
    {
        this.#dimensions[1] = height;
        this.#canvas.height = height;
    }

    public get Width(): number
    {
        return this.#dimensions[0];
    }

    public set Width(width: number)
    {
        this.#dimensions[0] = width;
        this.#canvas.width = width;
    }  

    public get Canvas(): HTMLCanvasElement
    {
        return this.#canvas;
    }

    public get GL(): WebGL2RenderingContext
    {
        return this.#gl;
    }

    public get CurrentScene(): Scene | undefined
    {
        return this.#currentScene;
    }

    public get Scenes(): readonly Scene[]
    {
        return this.#scenes;
    }

    constructor()
    constructor(config: GameConfig)
    constructor(config?: GameConfig) {
        config = {
            debug: config?.debug ?? false,
            canvas: typeof config?.canvas === 'function'
                ? config.canvas()
                : config?.canvas instanceof HTMLCanvasElement 
                    ? config.canvas
                    : document.createElement('canvas'),
            height: config?.height ?? 1080,
            width: config?.width ?? 1920
        }
        
        this.#canvas = config.canvas as HTMLCanvasElement;
        this.#dimensions[0] = config.width;
        this.#dimensions[1] = config.height;
        this.#debug = config.debug as boolean;
        
        this.Reset()
        this.ResetContext(this.#debug);
    }

    public Reset(): void
    {
        Shader.CurrentBlockIndex = 0;
        Scene.SceneId = 0;
    }
    
    public ResetContext(debug: boolean = false): void
    {
        this.#gl = createContext(this.#canvas, debug);
    }

    async Init(): Promise<void>
    {
        for (const scene of this.UseScenes)
        {
            this.AddScene(new scene(this));
        }
    }

    public Start(): void;
    public Start(delay: IDelay): void;
    public Start(delay: IDelay = {}): void
    {
        this.#delayId = window.setTimeout(() => this.#start(), CalcuateDelay(delay));
    }

    public Stop(): void;
    public Stop(delay: IDelay): void;
    public Stop(delay: IDelay = {}): void
    {
        this.#delayId = window.setTimeout(() => this.#stop(), CalcuateDelay(delay));
    }

    public Exit(): void
    {
        this.Stop();

        for (let i = 0; i < this.#scenes.length; ++i)
        {
            this.#scenes[i]?.Destroy();
        }
        this.#scenes.empty();
    }

    //#region Private Methods
    #start(): void
    {
        if (this.#delayId !== undefined)
        {
            window.clearTimeout(this.#delayId);
        }

        if (this.#running)
        {
            return;
        }
        else
        {
            this.#running = true;
        }

        this.#prevTick = Date.now();
        this.#currTick = Date.now();
        this.#currentScene?.Start();

        this.#tickId = window.requestAnimationFrame(this.#update.bind(this));
    }

    #update(): void
    {
        const delta = (this.#currTick - this.#prevTick) / 1000;
        
        this.#currentScene?.Update(delta);
        this.#prevTick = this.#currTick;
        this.#currTick = Date.now();

        this.#tickId = window.requestAnimationFrame(this.#update.bind(this));
    }

    #stop(): void
    {
        this.#running = false;

        if (this.#delayId !== undefined)
        {
            window.clearTimeout(this.#delayId);
        }

        if (this.#tickId !== undefined)
        {
            window.cancelAnimationFrame(this.#tickId);
        }

        this.#currentScene?.Stop();
        this.#tickId = undefined;
    }
    //#endregion

    //#region Scene Management
    #scenes: Scene[] = [];
    
    public AddScene(scene: Scene): Game
    {
        this.#scenes[scene.Id] = scene;

        return this;
    }

    public GetScene<T extends Scene>(sceneId: SceneId): T | undefined
    {
        return this.#scenes[sceneId] as T;
    }

    public SetScene(sceneId: SceneId): Game
    {
        const newScene = this.#scenes[sceneId];
        
        if (newScene && this.#currentScene?.Id !== newScene.Id)
        {
            this.#currentScene = newScene;
            newScene.Init();
        }

        return this;
    }

    public RemoveScene(sceneId: SceneId): Game
    {
        this.#scenes[sceneId].Stop();
        delete this.#scenes[sceneId];

        return this;
    }
    //#endregion
}
