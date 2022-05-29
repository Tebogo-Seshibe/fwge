declare global
{
    interface Array<T>
    {
        first: () => T 
        last: () => T
        swap: (firstIndex: number, secondIndex: number) => void
        empty: () => void
    }
}

Array.prototype.first = function()
{
    return this[0]
}

Array.prototype.last = function()
{
    return this[this.length - 1]
}

Array.prototype.swap = function(firstIndex: number, secondIndex: number)
{
    const left = this[firstIndex]
    const right = this[secondIndex]
    this[firstIndex] = right
    this[secondIndex] = left
}

Array.prototype.empty = function()
{
    while (this.length > 0)
    {
        this.pop()
    }
}
export { }
