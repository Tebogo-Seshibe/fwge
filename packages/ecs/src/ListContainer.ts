export class ListContainer<T>
{
    private list: (T | undefined)[] = [];
    private free: number[] = [];

    constructor(
        private offset: number = 0
    ) { }

    Add(item: T): number
    {
        let index: number;

        if (this.free.length === 0)
        {
            index = this.list.length;
        }
        else
        {
            index = this.free.pop()!;
        }
        this.list[index] = item;

        return index + this.offset;
    }
    
    Get(index: number): T | undefined
    {
        return this.list[index - this.offset];
    }

    All(): (T | undefined)[]
    {
        return this.list.map(x => x);
    }
    
    Remove(index: number): void
    {
        index -= this.offset;
        this.list[index] = undefined;
        this.free.push(index);
    }
}
