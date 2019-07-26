export default interface Cloneable<T> {
    Clone(count?: number): T | T[];
}
