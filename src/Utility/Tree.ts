import List from './List'

export class TreeNode<T>
{
    public Value: T
    public Children: List<TreeNode<T>>

    constructor(children: number, value?: T)
    {
        this.Value = value
        this.Children = new List<TreeNode<T>>(children)
    }
}

export default class Tree<T>
{
    private readonly size: number
    private root: TreeNode<T> | null

    constructor(size: number = Number.MAX_SAFE_INTEGER)
    {
        this.size = size
        this.root = null
    }

    Add(value: TreeNode<T> | T): void
    {
        if (value instanceof TreeNode)
        {
            value = value.Value
        }
        
        let node: TreeNode<T> = new TreeNode<T>(this.size, value)

        let curr: TreeNode<T> = this.root
        while (curr)
        {
            if (curr.Children.Count === 0)
            {
                curr.Children.Add(node)
                curr
            }
            else
            {

            }
            curr = null
        }
    }
}