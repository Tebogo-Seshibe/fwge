import { TypedArray } from "../../types";

export interface IsBindable<T extends TypedArray>
{
    readonly BufferData: T;
    Bind(...args: any[]): void;
}
