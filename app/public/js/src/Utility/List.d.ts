export declare class ListNode<T> {
    Previous: ListNode<T>;
    Next: ListNode<T>;
    Value: T;
    constructor(value: T, previous?: ListNode<T>, next?: ListNode<T>);
}
export declare class ListIterator<T> implements IterableIterator<T> {
    private curr;
    constructor(root: ListNode<T>);
    [Symbol.iterator](): ListIterator<T>;
    next(value?: any): IteratorResult<T>;
    return?(value?: any): IteratorResult<T>;
    throw?(e?: any): IteratorResult<T>;
}
export default class List<T> implements Iterable<T> {
    [index: number]: T;
    readonly Size: number;
    private head;
    constructor();
    constructor(size: number);
    constructor(buffer: T[]);
    constructor(...buffer: T[]);
    readonly Count: number;
    Add(value: T): boolean;
    Add(value: T, index: number): boolean;
    AddMany(...values: T[]): void;
    AddRange(values: T[]): void;
    AddRange(values: List<T>): void;
    Get(index: number): T;
    Contains(value: T): boolean;
    IndexOf(value: T): number;
    Remove(value: T): boolean;
    Remove(value: T, index: number): boolean;
    RemoveMany(...values: T[]): void;
    RemoveRange(values: T[]): void;
    RemoveRange(values: List<T>): void;
    ToArray(): T[];
    toString(): string;
    [Symbol.iterator](): IterableIterator<T>;
}
