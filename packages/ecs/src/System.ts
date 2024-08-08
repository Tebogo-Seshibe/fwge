export class System
{
    public readonly Name: string;

    constructor()
    {
        this.Name = new.target.name;
    }
    
    public Init(): void {}
    public Start(): void {}
    public Update(delta: number): void {}
    public Stop(): void {}
}
