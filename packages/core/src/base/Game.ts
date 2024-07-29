import { CalcuateDelay, GL, type IDelay, Vector2, createContext } from "@fwge/common";
import { Registry, Type, type Class } from "@fwge/ecs";
import { type Asset } from "./Asset";
import { type Prefab } from "./Prefab";
import { type Scene, type SceneId } from "./Scene";

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
    scenes: Type<Scene>[];
    startupScene: SceneId;

    assets?: LibraryEntry<Asset>[];
    prefabs?: LibraryEntry<Prefab>[];
}

export class Game
{
    //#region Private Fields
    private readonly _dimensions: Vector2 = new Vector2();
    private readonly _scenes: Record<SceneId, Scene> = {};
    private readonly _assets: Record<string, Record<string, Asset>> = {};
    private readonly _prefabs: Record<string, Record<string, Prefab>> = {};

    private _activeScene: Scene | undefined = undefined;
    private _currTick: number = -1;
    private _prevTick: number = -1;
    private _tickId: number | undefined = undefined;
    private _delayId: number | undefined = undefined;
    private _running: boolean = false;
    private _canvas!: HTMLCanvasElement;
    private _gl!: WebGL2RenderingContext;
    //#endregion

    public get Height(): number
    {
        return this._dimensions[1];
    }

    public set Height(height: number)
    {
        this._dimensions[1] = height;
        this._canvas.height = height;
    }

    public get Width(): number
    {
        return this._dimensions[0];
    }

    public set Width(width: number)
    {
        this._dimensions[0] = width;
        this._canvas.width = width;
    }  

    public get Canvas(): HTMLCanvasElement
    {
        return this._canvas;
    }

    public get GL(): WebGL2RenderingContext
    {
        return this._gl;
    }

    public get Scenes(): readonly Scene[]
    {
        return Object.keys(this._scenes).map(sceneId => this.GetScene(+sceneId)) as readonly Scene[];
    }

    constructor() {
        this._canvas = document.createElement('canvas');
        this.ResetContext();
    }

    Init(config: GameConfig)
    {
        config = {
            ...config,
            assets: config.assets ?? [],
            prefabs: config.prefabs ?? []
        };

        if (config.debug) {
            this.ResetContext(true);
        }

        this.Width = config.width;
        this.Height = config.height;

        for (const sceneConstructor of config.scenes)
        {
            const scene = new sceneConstructor(this);
            this.AddScene(scene);
            scene.Init();
        }

        for (const { name, create } of config.prefabs!)
        {
            const prefab = create();
            const library = this._prefabs[prefab.Type.name] ?? {};
            library[name] = prefab;
            this._prefabs[prefab.Type.name] = library;
        }

        for (const { name, create } of config.assets!)
        {
            const asset = create();
            const library = this._assets[asset.Type.name] ?? {};
            library[name] = asset;
            this._assets[asset.Type.name] = library;
        }

        this.SetScene(config.startupScene);
    }

    public ResetContext(debug: boolean = false): void
    {
        this._gl = createContext(this._canvas, debug);
    }

    public Start(): void;
    public Start(delay: IDelay): void;
    public Start(delay: IDelay = {}): void
    {
        window.setTimeout(() => this._start(), CalcuateDelay(delay));
    }

    public Stop(): void;
    public Stop(delay: IDelay): void;
    public Stop(delay: IDelay = {}): void
    {
        window.setTimeout(() => this._stop(), CalcuateDelay(delay));
    }

    public AddScene(scene: Scene): Game
    {
        this._scenes[scene.Id] = scene;

        return this;
    }

    public GetScene(sceneId: SceneId): Scene | undefined
    {
        return this._scenes[sceneId];
    }

    public SetScene(sceneId: SceneId): Game
    {
        const newScene = this._scenes[sceneId];
        
        if (newScene && this._activeScene?.Id !== newScene.Id)
        {
            this._activeScene = newScene;
        }

        return this;
    }

    public RemoveScene(sceneId: SceneId): Game
    {
        this._scenes[sceneId].Stop();
        delete this._scenes[sceneId];

        return this;
    }

    public GetAsset<T extends Asset = Asset>(assetType: Type<T>, name: string): T| undefined
    {
        return this._assets[assetType.name][name] as T;
    }

    public GetPrefab<T extends Prefab = Prefab>(prefabType: Type<T>, name: string): T| undefined
    {
        return this._prefabs[prefabType.name][name] as T;
    }

    //#region Private Methods
    private _start(): void
    {
        if (this._running)
        {
            return;
        }
        else
        {
            this._running = true;
        }

        this._prevTick = Date.now();
        this._currTick = Date.now();
        this._activeScene?.Start();

        this._tickId = window.requestAnimationFrame(this._update.bind(this));
    }

    private _update(): void
    {
        const delta = (this._currTick - this._prevTick) / 1000;
        
        this._activeScene?.Update(delta);
        this._prevTick = this._currTick;
        this._currTick = Date.now();

        this._tickId = window.requestAnimationFrame(this._update.bind(this));
    }

    private _stop(): void
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
}
