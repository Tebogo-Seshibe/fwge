class StackNode<T>
{
	public Value: T
	public Predecessor: StackNode<T>

	constructor(value: T, predecessor?: StackNode<T>)
	{
		this.Value = value
		this.Predecessor = predecessor
	}
}

export default class Stack<T>
{
	private head: StackNode<T>

	constructor()
	{
		this.head = undefined
	}

	public Push(value: T): void
	{
		if (!this.head)
		{
			this.head = new StackNode<T>(value)
		}
		else
		{
			let newHead = new StackNode<T>(value, this.head)
			this.head = newHead
		}
	}

	public Peek(): T
	{
		if (!this.head)
		{
			return undefined
		}

		return this.head.Value
	}

	public Pop(): T
	{
		if (!this.head)
		{
			return undefined
		}

		let oldHead = this.head
		this.head = this.head.Predecessor

		return oldHead.Value
	}

	public Height(): number
	{
		let height: number = 0

		let curr: StackNode<T> = this.head

		while (curr)
		{
			++height
			curr = curr.Predecessor
		}

		return height
	}

	public toString(): string
	{
		
		if (!this.head)
		{
			return '[]'
		}
		
		let curr: StackNode<T> = this.head.Predecessor
		let str: string = '[' + this.head.Value

		while (curr)
		{
			str += ', ' + curr.Value
			curr = curr.Predecessor
		}
		str += ']'

		return str
	}
}