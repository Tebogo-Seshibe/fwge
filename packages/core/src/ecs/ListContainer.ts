export class ListContainer<T>
{
    private list: (T | undefined)[] = [];
    private free: number[] = [];

    public get Items(): readonly (T | undefined)[]
    {
        return this.list;
    }

    constructor(
        private offset: number = 0
    ) { }

    public Add(item: T): number
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
    
    public Get(index: number): T | undefined
    {
        return this.list[index - this.offset];
    }
    
    public Set(index: number, item: T | undefined): void
    {
        this.list[index - this.offset] = item;
    }
    
    public Remove(index: number): void
    {
        index -= this.offset;
        this.list[index] = undefined;
        this.free.push(index);
    }
}
