export class BufferedArray<T>
{
    [index:number]: T;
    readonly Buffer: Array<T>;

    public constructor()
    public constructor(length: number)
    public constructor(args?: any)
    {
        this.Buffer = new Array<T>(args);
    }
}