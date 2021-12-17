import assert from "assert"

declare global
{
    interface Array<T>
    {
        first: () => T 
        last: () => T
        swap: (firstIndex: number, secondIndex: number) => void
    }
}

Array.prototype.first = function()
{
    assert(this.length > 0)
    return this[0]
}

Array.prototype.last = function()
{
    assert(this.length > 0)
    return this[this.length - 1]
}

Array.prototype.swap = function(firstIndex: number, secondIndex: number)
{
    const left = this[firstIndex]
    const right = this[secondIndex]
    this[firstIndex] = right
    this[secondIndex] = left
}
