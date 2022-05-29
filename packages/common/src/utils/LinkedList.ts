export class  LinkedListNode<T>
{
    constructor(
        public value: T,
        public next?: LinkedListNode<T>
    ) { }
}

export class DoubleListNode<T>
{
    constructor(
        public value: T,
        public next?: DoubleListNode<T>,
        public prev?: DoubleListNode<T>
    ) {}
}

export class LinkedList<T>
{
    private count: number = 0
    private head?: LinkedListNode<T> = undefined

    public get Count(): number
    {
        return this.count
    }

    constructor(...values: T[])
    {
        for (const value of values)
        {
            this.Add(value)
        }
    }

    Add(value: T): void
    Add(value: T, index: number): void
    Add(value: T, index: number = this.count): void
    {
        if (index < 0 || index > this.count)
        {
            throw new Error(`Index out of range: ${ index }`)
        }

        const node = new LinkedListNode<T>(value)

        if (index === 0)
        {
            node.next = this.head
            this.head = node
        }
        else
        {
            let curr = this.head!
            
            while (--index > 0)
            {
                curr = curr.next!
            }
            
            node.next = curr.next
            curr.next = node
        }

        this.count++
    }

    Find(value: T): number
    {
        for (let index = 0, curr = this.head; curr; index++, curr = curr?.next)
        {
            if (curr.value == value)
            {
                return index
            }
        }
        return -1
    }

    Remove(index: number): T | undefined
    {
        return undefined
    }

    Get(index: number): T | undefined
    {
        if (index < 0 || index >= this.count)
        {
            throw new Error(`Index out of range: ${ index }`)
        }

        let curr = this.head
        while (--index >= 0)
        {
            curr = curr?.next
        }
        return curr?.value
    }

    groupLog(groupName: string = 'SingleListNode'): void
    {
        console.groupCollapsed(groupName)
        for (let node = this.head; node; node = node.next)
        {
            console.log(node)
        }
        console.groupEnd()
    }

    toString(): string
    {
        let str = '['

        let curr = this.head
        while (curr)
        {
            str += curr.value + ','
            curr = curr.next
        }

        return str.substring(0, str.length - 1) + ']'
    }
}

export class DoubleLinkedList<T>
{
    private head?: DoubleListNode<T>
    private tail?: DoubleListNode<T>

    constructor(...values: T[])
    {
        for (const value of values)
        {
            this.Add(value)
        }
    }

    Add(value: T): void
    {
        const node = new DoubleListNode<T>(value)

        if (!this.head)
        {
            this.head = node

            return    
        }
        else
        {
            let curr = this.head
            while (curr.next)
            {
                curr = curr.next
            }
            curr.next = node
            node.prev = curr
        }

        this.tail = node
    }

    Remove(index: number): T | undefined
    {
        return undefined
    }

    Get(index: number): T | undefined
    {
        return undefined
    }

    groupLog(groupName: string = 'DoubleLinkedList'): void
    {
        console.groupCollapsed(groupName)
        for (let node = this.head; node; node = node.next)
        {
            console.log(node)
        }
        console.groupEnd()
    }

    toString(): string
    {
        let str = '['
        let curr = this.head

        while (curr)
        {
            str += curr.value + ','
            curr = curr.next
        }

        return str.substring(0, str.length - 1) + ']'
    }
}
