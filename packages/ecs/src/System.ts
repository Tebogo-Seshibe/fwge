export abstract class System
{
    public readonly Name: string;

    constructor()
    {
        this.Name = new.target.name;
    }
    
    public abstract Init(): void;
    public abstract Start(): void;
    public abstract Update(delta: number): void;
    public abstract Stop(): void;
}
