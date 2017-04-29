export interface IKeyFrame<T>
{
    Before: T;
    After: T;
}

export class KeyFrame<T>
{
    public readonly Before: T;
    public readonly After: T;

    constructor(request: IKeyFrame<T>)
    {
        this.Before = request.Before;
        this.After = request.After;
    }
}
