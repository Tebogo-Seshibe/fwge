import { CalcuateDelay, createContext, GL, IDelay, UUID } from "@fwge/common";
import { SharedComponent } from "../ecs";
import { Class, SceneId } from "../ecs/Registry";
import { Asset } from "./Asset";
import { Prefab } from "./Prefab";
import { Scene } from "./Scene";

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
}

export class Game
{
    public readonly UUID: UUID = UUID.Create();

    readonly Height: number;
    readonly Width: number;
    readonly Scenes: Map<SceneId, Scene> = new Map();
    readonly Assets: Map<string, Map<string, Asset>> = new Map();
    readonly Components: Map<string, Map<string, SharedComponent>> = new Map();
    readonly Prefabs: Map<string, Map<string, Prefab>> = new Map();

    //#region Private Fields
    private _scenesIds: Map<Class<Scene>, SceneId> = new Map();
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

        for (const { name, create } of config.prefabs!)
        {
            const asset = create();
            const library = this.Prefabs.get(asset.Type.name) ?? new Map();
            library.set(name, asset);
            this.Prefabs.set(asset.Type.name, library);
        }

        for (const { name, create } of config.assets!)
        {
            const asset = create();
            const library = this.Assets.get(asset.Type.name) ?? new Map();
            library.set(name, asset);
            this.Assets.set(asset.Type.name, library);
        }

        for (const { name, create } of config.components!)
        {
            const component = create();
            const library = this.Components.get(component.Type.name) ?? new Map();
            library.set(name, component);
            this.Components.set(component.Type.name, library);
        }

        for (const SceneConstructor of config.scenes!)
        {
            const newScene = new SceneConstructor(this);
            this.Scenes.set(newScene.ID, newScene);
            this._scenesIds.set(SceneConstructor, newScene.ID);

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
        this.Scenes.set(scene.ID, scene);
    }

    GetScene(sceneType: Class<Scene>): Scene | undefined;
    GetScene(sceneId: SceneId): Scene | undefined;
    GetScene(scene: Class<Scene> | SceneId): Scene | undefined
    {
        if (typeof scene !== 'number')
        {
            scene = this._scenesIds.get(scene) as SceneId;
        }

        return this.Scenes.get(scene);
    }

    SetScene(sceneType: Class<Scene>): void;
    SetScene(sceneId: SceneId): void;
    SetScene(sceneId: Class<Scene> | SceneId): void
    {
        if (typeof sceneId !== 'number')
        {
            sceneId = this._scenesIds.get(sceneId) as SceneId;
        }
        const newScene = this.Scenes.get(sceneId);

        if (!newScene || (this._activeScene && this._activeScene.ID === newScene.ID))
        {
            return;
        }
        this._activeScene = newScene;
    }

    GetComponent<T extends SharedComponent>(name: string, type: Class<T>): T | undefined
    {
        return this.Components.get(type.name)?.get(name) as T;
    }

    GetAsset<T extends Asset>(name: string, type: Class<T>): T | undefined
    {
        return this.Assets.get(type.name)?.get(name) as T;
    }

    GetPrefab<T extends Prefab>(name: string, type: Class<T>): T | undefined
    {
        return this.Prefabs.get(type.name)?.get(name) as T;
    }
}
