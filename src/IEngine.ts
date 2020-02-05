export default interface IEngine
{
    Init(...args: any): void
    Update(): void
    Reset(): void
}