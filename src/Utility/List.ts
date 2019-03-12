class ListNode<T>
{
    public Next: ListNode<T>;
    public Previous: ListNode<T>;
    public Value: T;

    constructor(value: T, next?: ListNode<T>, previous?: ListNode<T>)
    {
        this.Value = value
        this.Next = next
        this.Previous = previous
    }
}

class ListIterator<T> implements IterableIterator<T>
{
    [Symbol.iterator](): IterableIterator<T>
    {
        throw new Error('Method not implemented.');
    }   
    next(value?: any): IteratorResult<T>
    {
        return {
            done: !value,
            value
        }
    }
    return?(value?: any): IteratorResult<T>
    {
        return {
            done: !value,
            value
        }
    }
    throw?(e?: any): IteratorResult<T>
    {
        throw new Error(e)
    }    
}


export default class List<T> implements Iterable<T>
{
    [index: number]: T

    public readonly Size: number
    private head: ListNode<T>

    constructor(size: number = Number.MAX_SAFE_INTEGER, buffer?: List<T> | Array<T>)
    {
        this.Size = size
        
        if (buffer)
        {
            this.AddAll(buffer)   
        }
    }

    get Length(): number
    {
        let node: ListNode<T> = this.head
        let count: number = 0

        while (node)
        {
            node = node.Next
            count++   
        }

        return count
    }

    Add(value: ListNode<T> | T, index?:  number): boolean
    {
        if (this.Length == this.Size)
        {
            return false
        }
            
        if (value instanceof ListNode)
        {
            value = value.Value
        }

        if (!Number.isSafeInteger(index) || index < 0 || index > this.Length)
        {
            index = this.Length   
        }

        let parent = this.Get(index - 1)
        let node = new ListNode<T>(value, parent, parent.Next)
        parent.Next = node

        return true
    }

    AddMany(...values: ListNode<T>[] | T[] ): void
    {
        for (let value of values)
        {
            this.Add(value)
        }
    }

    AddAll(values: List<T> | Array<T>): void
    {
        for (let value of values)
        {
            this.Add(value)
        }
    }

    Get(index: number): ListNode<T>
    {
        if (index < 0 || index > this.Length)
        {
            return null
        }

        let node: ListNode<T> = this.head

        while (--index > 0)
        {
            node = node.Next
        }

        return node
    }

    Find(value: T): ListNode<T>
    {
        let node: ListNode<T> = null

        for (let curr: ListNode<T> = this.head; curr && !node; curr = curr.Next)
        {
            if (curr.Value === value)
            {
                node = curr
            }
        }

        return node
    }

    IndexOf(value: T): number
    {
        let index = 0

        for (let curr: ListNode<T> = this.head; curr && curr.Value != value; curr = curr.Next)
        {
            ++index
        }

        return index === this.Length ? -1 : index
    }

    Remove(value: T | number): T
    {
        let node: ListNode<T> = null

        if (typeof value === 'number')
        {
            node = this.Get(value)
        }
        else
        {
            node = this.head

            while (node && node.Value != value)
            {
                node = node.Next
            }
        }

        if (node)
        {
            node.Previous.Next = node.Next

            node.Previous = null
            node.Next = null
            
            return node.Value
        }
        else
        {
            return null
        }
    }

    ToArray(): Array<T>
    {
        let array: Array<T> = new Array<T>(this.Length)

        for (let curr = this.head; curr; curr = curr.Next)
        {
            array.push(curr.Value)
        }

        return array
    }

    [Symbol.iterator](): IterableIterator<T>
    {
        return new ListIterator<T>()
    }
}