import { Scene, IScene } from './Scene';

export interface IProject
{
    Name?: string;
}

export class Project
{
    public Name: string;
    public Scenes: Array<Scene>;

    constructor(request: IProject)
    {
        this.Name = request.Name || "New Project";
    }
}