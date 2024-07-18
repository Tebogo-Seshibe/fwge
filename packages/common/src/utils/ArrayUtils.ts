declare global
{
    interface Array<T>
    {
        first():  T;
        last(): T;
        swap: (firstIndex: number, secondIndex: number) => void;
        empty: () => void;
        any: (predicate?: (item: T, index: number, arr: Array<T>) => boolean) => boolean;
    }
}

Array.prototype.first = function ()
{
    return this[0];
}

Array.prototype.last = function ()
{
    return this[this.length - 1];
}

Array.prototype.swap = function (firstIndex: number, secondIndex: number)
{
    const value = this[firstIndex];
    this[firstIndex] = this[secondIndex];
    this[secondIndex] = value;
}

Array.prototype.empty = function ()
{
    while (this.length > 0)
    {
        this.pop();
    }
}

Array.prototype.any = function (predicate?: (item: unknown, index: number, arr: Array<unknown>) => boolean)
{
    if (predicate)
    {
        for (let i = 0; i < this.length; ++i)
        {
            if (predicate(this[i], i, this))
            {
                return true
            }
        }
    }
    else
    {
        return this.length > 0
    }

    return false
}

export { }
