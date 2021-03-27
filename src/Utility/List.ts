class ListNode<T>
{
    public Previous?: ListNode<T>
    public Next?: ListNode<T>
    public Value?: T

    constructor(value?: T, previous?: ListNode<T>, next?: ListNode<T>)
    {
        this.Previous = previous
        this.Next = next
        this.Value = value
    }
}

export class ListIterator<T> implements IterableIterator<T>
{
    private curr: ListNode<T> | undefined

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
        let result: IteratorResult<T> | undefined = {
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
    private head: ListNode<T> | undefined

    constructor()
    constructor(size: number)
    constructor(buffer: T[])
    constructor(...buffer: T[])
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

    public get Count(): number
    {
        let node: ListNode<T> | undefined = this.head
        let count: number = 0

        while (node)
        {
            node = node.Next
            count++   
        }

        return count
    }

    public Add(value: T): boolean
    public Add(value: T, index: number): boolean
    public Add(value: T, index: number = 0): boolean
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

            let previous: ListNode<T> | undefined = this.head
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

    public AddMany(...values: T[]): void
    {
        for (let value of values)
        {
            this.Add(value)
        }
    }

    public AddRange(values: T[]): void
    public AddRange(values: List<T>): void
    public AddRange(values: T[] | List<T>): void
    {
        this.AddMany(...values)
    }

    public Get(index: number): T | undefined
    {
        if (index < 0 || index > this.Count)
        {
            return undefined
        }

        let node: ListNode<T> | undefined = this.head

        while (node && --index >= 0)
        {
            node = node.Next
        }

        return !node ? undefined : node.Value
    }

    public Contains(value: T): boolean
    {
        return this.IndexOf(value) !== -1
    }

    public IndexOf(value: T): number
    {
        let index = 0

        for (let curr: ListNode<T> | undefined = this.head; curr && curr.Value != value; curr = curr.Next)
        {
            ++index
        }

        return index === this.Count ? -1 : index
    }

    public Remove(value: T): boolean
    public Remove(value: T, index: number): boolean
    public Remove(value: T, index?: number): boolean
    {
        let node: ListNode<T> | undefined = this.head
        let found = false
        let count = 0

        while (node && !found)
        {
            node = node.Next
            ++count

            if (node!.Value == value)
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
        
        node!.Previous!.Next = node.Next
        node!.Next!.Previous = node.Previous

        return true
    }

    public RemoveMany(...values: T[]): void
    {
        for (let value of values)
        {
            this.Remove(value)
        }
    }

    public RemoveRange(values: T[]): void
    public RemoveRange(values: List<T>): void
    public RemoveRange(values: T[] | List<T>): void
    {
        this.RemoveMany(...values)
    }    

    public ToArray(): T[]
    {
        let array: T[] = new Array<T>()

        for (let value of this)
        {
            array.push(value)
        }

        return array
    }

    public toString(): string
    {
		if (!this.head)
		{
			return '()'
		}
		
		let curr: ListNode<T> | undefined = this.head.Next
		let str: string = '(' + this.head.Value

		while (curr)
		{
			str += ', ' + curr.Value
			curr = curr.Next
		}
		str += ')'

		return str
    }

    [Symbol.iterator](): IterableIterator<ListNode<T | undefined> | undefined>
    {
        return new ListIterator<ListNode<T> | undefined>(this.head)
    }
}