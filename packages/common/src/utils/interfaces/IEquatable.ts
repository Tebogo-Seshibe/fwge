export interface IEquatable<T>
{
    Equals(this: T, other: T): boolean
}