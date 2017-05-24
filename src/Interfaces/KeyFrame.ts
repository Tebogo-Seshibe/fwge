export interface IKeyFrame<T>
{
    Before: T;
    After:  T;
    Current: T;
    Length: number;
}

export class KeyFrame<T>
{
    public readonly Before: T;
    public readonly After:  T;
    public readonly Length: number;
    public Current: T;
    private Offset: T;

    constructor(request: IKeyFrame<T>)
    {
        this.Before = request.Before;
        this.After  = request.After;
        this.Length = request.Length;
    }
}
