export interface IUpdateable
{
    Init(): void
    Start(): void
    Update(delta: number): void
    Stop(): void
}