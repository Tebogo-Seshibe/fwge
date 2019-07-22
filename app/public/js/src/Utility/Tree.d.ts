import List from './List';
export declare class TreeNode<T> {
    Value: T;
    Children: List<TreeNode<T>>;
    constructor(children: number, value?: T);
}
export default class Tree<T> {
    private readonly size;
    private root;
    constructor(size?: number);
    Add(value: TreeNode<T> | T): void;
}
