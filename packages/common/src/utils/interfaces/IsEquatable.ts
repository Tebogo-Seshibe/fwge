export interface IsEquatable<T>
{
    Equals(this: T, other: T): boolean;
}