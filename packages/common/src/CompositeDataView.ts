import { TypedArray, TypedArrayConstructor } from "./types";

export interface IBufferView
{
    name: string | symbol | number;
    type: TypedArrayConstructor;
    length: number;
}

export class CompositeDataView extends DataView
{
    readonly #views: Record<string | symbol | number, TypedArray> = {};

    constructor(views: IBufferView[])
    {
        super(new ArrayBuffer(views
            .sort((a, b) => b.type.BYTES_PER_ELEMENT - a.type.BYTES_PER_ELEMENT)
            .map(x => x.length * x.type.BYTES_PER_ELEMENT)
            .reduce((t, c) => t + c, 0)));

        let offset = 0;

        for (const { name, type, length } of views)
        {
            const totalLength = type.BYTES_PER_ELEMENT * length;
            
            this.#views[name] = new type(this.buffer, offset, length);
            
            offset += totalLength;
        }
    }

    View<T extends TypedArray>(name: string | symbol | number): T | undefined
    {
        return this.#views[name] as T;
    }
}
