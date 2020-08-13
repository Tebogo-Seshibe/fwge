export default interface IEngine
{
    Init(...args: any): void
    Update(...args: any): void
    Reset(...args: any): void
}