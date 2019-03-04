export class IAttachable
{

}

export default interface Attachable<T>
{
    Attach(t: T): void
    AttachAll(...t: T[]): void
    Detach(t: T): void
    DetachAll(...t: T[]): void
}