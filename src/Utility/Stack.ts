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

	Push(value: T): void
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

	Peek(): T
	{
		if (!this.head)
		{
			return undefined
		}

		return this.head.Value
	}

	Pop(): T
	{
		if (!this.head)
		{
			return undefined
		}

		let oldHead = this.head
		this.head = this.head.Predecessor

		return oldHead.Value
	}
}