import List from './List';
export class TreeNode {
    constructor(children, value) {
        this.Value = value;
        this.Children = new List(children);
    }
}
export default class Tree {
    constructor(size = 1) {
        this.size = size;
        this.root = null;
    }
    Add(value) {
        if (value instanceof TreeNode) {
            value = value.Value;
        }
        let node = new TreeNode(this.size, value);
        let curr = this.root;
        while (curr) {
            if (curr.Children.Count === 0) {
                curr.Children.Add(node);
                curr;
            }
            else {
            }
            curr = null;
        }
    }
}
//# sourceMappingURL=Tree.js.map