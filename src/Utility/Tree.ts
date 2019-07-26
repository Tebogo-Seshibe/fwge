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
    private root: TreeNode<T>

    constructor(size: number = 0)
    {
        this.size = size
        this.root = undefined
    }
}