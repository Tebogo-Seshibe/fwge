export interface ISerializable<T>
{
    serialize(): string
    deserialize(src: string): T    
}
