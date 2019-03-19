export default interface Attachable<T>
{
    Attach(t: T): void
    AttachMany(...t: T[]): void
    Detach(t: T): void
    DetachMany(...t: T[]): void
}