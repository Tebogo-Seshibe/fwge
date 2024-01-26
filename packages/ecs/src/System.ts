export abstract class System
{
    public abstract Init(): void;
    public abstract Start(): void;
    public abstract Update(delta: number): void;
    public abstract Stop(): void;
}
