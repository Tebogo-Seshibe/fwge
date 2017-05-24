import { GameObject } from '../../../src/Game Engine/GameObject';
import { LightItem } from '../../../src/Game Engine/Light/LightItem';

export interface IScene
{
    Name?: string;
}

export class Scene
{
    public Name: string;
    public Objects: Array<GameObject>;
    public Lights: Array<LightItem>;
    public Sounds: Array<undefined>;

    constructor(request: IScene)
    {
        this.Name = request.Name || "New Scene";
    }
}