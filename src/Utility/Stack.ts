export class StackNode<T>
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
	private Head: StackNode<T>

	constructor()
	{
		this.Head = undefined
	}

	Push(value: T): void
	{
		if (!this.Head)
		{
			this.Head = new StackNode<T>(value)
		}
		else
		{
			let newHead = new StackNode<T>(value, this.Head)
			this.Head = newHead
		}
	}

	Peek(): T
	{
		if (!this.Head)
			return null

		return this.Head.Value
	}

	Pop(): T
	{
		if (!this.Head)
			return null

		let oldHead = this.Head
		this.Head = this.Head.Predecessor

		return oldHead.Value
	}
}