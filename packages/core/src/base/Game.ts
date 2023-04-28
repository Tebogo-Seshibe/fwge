import { CalcuateDelay, CreateUUID, GL, IDelay, UUID, createContext } from "@fwge/common";
import { Component, SharedComponent } from "../ecs";
import { Class, Registry } from "../ecs/Registry";
import { Asset } from "./Asset";
import { Prefab } from "./Prefab";
import { Scene, SceneId } from "./Scene";

export interface LibraryEntry<T>
{
    name: string;
    create: () => T;
}

export interface GameConfig
{
    debug?: boolean;
    height: number;
    width: number;
    canvas: HTMLCanvasElement | (() => HTMLCanvasElement);
    scenes: Class<Scene>[];
    startupScene: Class<Scene>;

    assets?: Array<LibraryEntry<Asset>>;
    components?: Array<LibraryEntry<SharedComponent>>;
    prefabs?: Array<LibraryEntry<Prefab>>;
    componentsTypes: Array<Class<Component>>;
}

export class Game
{
    public readonly UUID: UUID = CreateUUID();
    public readonly Height: number;
    public readonly Width: number;

    private readonly Scenes: Record<SceneId, Scene> = {};
    private readonly Assets: Record<string, Record<string, Asset>> = {};
    private readonly Components: Record<string, Record<string, SharedComponent>> = {};
    private readonly Prefabs: Record<string, Record<string, Prefab>> = {};
    private readonly _scenesIds: Map<Class<Scene>, SceneId> = new Map();

    //#region Private Fields
    private _activeScene: Scene | undefined = undefined;
    private _currTick: number = -1;
    private _prevTick: number = -1;
    private _tickId: number | undefined = undefined;
    private _delayId: number | undefined = undefined;
    private _running: boolean = false;
    //#endregion    

    constructor();
    constructor(config: GameConfig);
    constructor(config?: GameConfig)
    {
        config = {
            ...config!,
            debug: config?.debug === undefined ? false : config.debug,
            components: config?.components ?? [],
            assets: config?.assets ?? []
        };

        config.canvas = config.canvas instanceof HTMLCanvasElement
            ? config.canvas
            : config.canvas?.call(document);

        if (!config.canvas)
        {
            throw new Error('No canvas element found');
        }

        this.ResetContext(config.canvas, config.debug!);

        GL.canvas.width = config.width;
        GL.canvas.height = config.height;

        this.Width = config.width;
        this.Height = config.height;

        Registry.registerComponents(...config.componentsTypes); 

        for (const { name, create } of config.prefabs!)
        {
            const asset = create();
            const library = this.Prefabs[asset.Type.name] ?? {};
            library[name] = asset;
            this.Prefabs[asset.Type.name] = library;
        }

        for (const { name, create } of config.assets!)
        {
            const asset = create();
            const library = this.Assets[asset.Type.name] ?? {};
            library[name] = asset;
            this.Assets[asset.Type.name] = library;
        }

        for (const { name, create } of config.components!)
        {
            const component = create();
            const library = this.Components[component.Type.name] ?? {};
            library[name] = component;
            this.Components[component.Type.name] = library;
        }

        for (const SceneConstructor of config.scenes!)
        {
            const newScene = new SceneConstructor(this);
            this.Scenes[newScene.Id] = newScene;
            this._scenesIds.set(SceneConstructor, newScene.Id);

            newScene.Init();
        }

        this.SetScene(config.startupScene as Class<Scene>);
    }

    ResetContext(canvas: HTMLCanvasElement, debug: boolean)
    {
        createContext(canvas, debug);
    }

    Start(): void;
    Start(delay: IDelay): void;
    Start(delay: IDelay = {}): void
    {
        window.setTimeout(() => this._start(), CalcuateDelay(delay));
    }

    Stop(): void;
    Stop(delay: IDelay): void;
    Stop(delay: IDelay = {}): void
    {
        window.setTimeout(() => this._stop(), CalcuateDelay(delay));
    }

    //#region Private Methods
    private _start()
    {
        if (this._running)
        {
            return;
        }

        if (!this._activeScene)
        {
            this._tickId = window.setTimeout(this._start.bind(this));
        }

        this._prevTick = Date.now();
        this._currTick = Date.now();
        this._activeScene!.Start();

        this._tickId = window.requestAnimationFrame(this._update.bind(this));
    }

    private _update(): void
    {
        const delta = (this._currTick - this._prevTick) / 1000;
        
        this._activeScene!.Update(delta);
        this._prevTick = this._currTick;
        this._currTick = Date.now();

        this._tickId = window.requestAnimationFrame(this._update.bind(this));
    }

    private _stop()
    {
        this._running = false;

        if (this._delayId !== undefined)
        {
            window.clearTimeout(this._delayId);
        }

        if (this._tickId !== undefined)
        {
            window.cancelAnimationFrame(this._tickId);
        }

        this._activeScene?.Stop();
        this._tickId = undefined;
    }
    //#endregion

    AddScene(scene: Scene): void
    {
        this.Scenes[scene.Id] = scene;
    }

    GetScene(sceneType: Class<Scene>): Scene | undefined;
    GetScene(sceneId: SceneId): Scene | undefined;
    GetScene(scene: Class<Scene> | SceneId): Scene | undefined
    {
        if (typeof scene !== 'number')
        {
            scene = this._scenesIds.get(scene) as SceneId;
        }

        return this.Scenes[scene];
    }

    SetScene(sceneType: Class<Scene>): void;
    SetScene(sceneId: SceneId): void;
    SetScene(sceneId: Class<Scene> | SceneId): void
    {
        if (typeof sceneId !== 'number')
        {
            sceneId = this._scenesIds.get(sceneId) as SceneId;
        }
        const newScene = this.Scenes[sceneId];

        if (!newScene || (this._activeScene && this._activeScene.Id === newScene.Id))
        {
            return;
        }
        this._activeScene = newScene;
    }

    GetComponent<T extends SharedComponent>(name: string, type: Class<T>): T | undefined
    {
        return this.Components[type.name][name] as T;
    }

    GetAsset<T extends Asset>(name: string, type: Class<T>): T | undefined
    {
        return this.Assets[type.name][name] as T;
    }

    GetPrefab<T extends Prefab>(name: string, type: Class<T>): T | undefined
    {
        return this.Prefabs[type.name][name] as T;
    }
}
