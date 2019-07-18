export class ListNode<T>
{
    public Previous: ListNode<T>
    public Next: ListNode<T>
    public Value: T

    constructor(value: T, previous?: ListNode<T>, next?: ListNode<T>)
    {
        this.Previous = previous
        this.Next = next
        this.Value = value
    }
}

export class ListIterator<T> implements IterableIterator<T>
{
    private curr: ListNode<T>

    constructor(root: ListNode<T>)
    {
        this.curr = root
    }

    [Symbol.iterator](): ListIterator<T>
    {
        return this
    }
    
    next(value?: any): IteratorResult<T>
    {
        let result: IteratorResult<T> = {
            done: !this.curr,
            value: undefined
        }

        if (this.curr)
        {
            result.value = this.curr.Value
            this.curr = this.curr.Next
        }

        return result
    }
    
    return?(value?: any): IteratorResult<T>
    {
        return this.next(value)
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

    constructor()
    constructor(size: number)
    constructor(buffer: T[])
    constructor(arg?: number | T[])
    {
        if (arg !== undefined)
        {
            if (typeof arg === 'number')
            {
                this.Size = arg
            }
            else
            {
                this.Size = arg.length
                this.AddMany(...arg)
            }
        }
        else
        {
            this.Size = Number.MAX_SAFE_INTEGER
        }
    }

    get Count(): number
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

    Add(value: T): boolean
    Add(value: T, index: number): boolean
    Add(value: T, index?: number): boolean
    {
        if (!this.head)
        {
            this.head = new ListNode<T>(value, undefined, undefined)
        }
        else
        {
            if (!Number.isSafeInteger(index) || index < 0 || index > this.Count)
            {
                index = this.Count
            }

            let previous = this.head
            while (previous && --index > 0)
            {
                previous = previous.Next
            }

            if (!previous)
            {
                return false
            }

            let node = new ListNode<T>(value, previous, previous.Next)
            previous.Next = node
        }

        return true
    }

    AddMany(...values: T[]): void
    {
        for (let value of values)
        {
            this.Add(value)
        }
    }

    AddRange(values: T[]): void
    AddRange(values: List<T>): void
    AddRange(values: T[]|List<T>): void
    {
        this.AddMany(...values)
    }

    Get(index: number): T
    {
        if (index < 0 || index > this.Count)
        {
            return undefined
        }

        let node: ListNode<T> = this.head

        while (node && --index >= 0)
        {
            node = node.Next
        }

        return !node ? undefined : node.Value
    }

    Contains(value: T): boolean
    {
        return this.IndexOf(value) !== -1
    }

    IndexOf(value: T): number
    {
        let index = 0

        for (let curr: ListNode<T> = this.head; curr && curr.Value != value; curr = curr.Next)
        {
            ++index
        }

        return index === this.Count ? -1 : index
    }

    Remove(value: T): boolean
    Remove(value: T, index: number): boolean
    Remove(value: T, index?: number): boolean
    {
        let node: ListNode<T> = this.head
        let found = false
        let count = 0

        while (node && !found)
        {
            node = node.Next
            ++count

            if (node.Value == value)
            {
                if (index === undefined || index >= count)
                {
                    found = true
                }
            }
        }

        if (node === undefined)
        {
            return false
        }
        
        node.Previous.Next = node.Next
        node.Next.Previous = node.Previous

        return true
    }

    RemoveMany(...values: T[]): void
    {
        for (let value of values)
        {
            this.Remove(value)
        }
    }

    RemoveRange(values: T[]): void
    RemoveRange(values: List<T>): void
    RemoveRange(values: T[] | List<T>): void
    {
        this.RemoveMany(...values)
    }    

    ToArray(): T[]
    {
        let array: T[] = new Array<T>()

        for (let value of this)
        {
            array.push(value)
        }

        return array
    }

    toString(): string
    {
        let count = this.Count

        if (count === 0)
        {
            return "()"
        }

        let node = this.head.Next
        let str = "(" + this.head.Value

        while (node)
        {
            str += "," + node.Value
            node = node.Next
        }
        str += ")"

        return str
    }

    [Symbol.iterator](): IterableIterator<T>
    {
        return new ListIterator<T>(this.head)
    }
}