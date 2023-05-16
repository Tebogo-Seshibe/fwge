import { TypedArray, TypedArrayConstructor } from "./types";

export interface IBufferView
{
    name: string;
    type: TypedArrayConstructor;
    length: number;
}

export class CompositeDataView extends DataView
{
    private readonly _views: Record<string, TypedArray> = Object.create(null);

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
            
            this._views[name] = new type(this.buffer, offset, length);
            
            offset += totalLength;
        }
    }

    View<T extends TypedArray>(name: string): T | undefined
    {
        return this._views[name] as T;
    }
}
