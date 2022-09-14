import { TypedArray } from "../../types"

export interface IBindable<T extends TypedArray>
{
    readonly BufferData: T

    Bind(...args: any[]): void
}
