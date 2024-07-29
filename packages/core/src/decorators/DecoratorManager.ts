import { Component, Constructor, Entity } from "@fwge/ecs";
import { Asset, GameConfig, IScene, Scene } from "../base";

export class DecoratorManager {
    static Assets: {
        name: string, 
        class: Constructor<Asset>
        config: any[] 
    }[] = [];
    static Components: {
        name: string, 
        class: Constructor<Component>
        config: any[] 
    }[] = [];
    static Entities: {
        name: string, 
        class: Constructor<Entity>
        config: any[] 
    }[] = [];
    static Scene: {
        name: string, 
        class: Constructor<Scene>
        config: IScene }[

        ] = [];
    static System: {
        name: string, 
        class: Constructor<any>
        config: any[] 
    }[] = [];
    static Game: GameConfig | undefined = undefined;
} 