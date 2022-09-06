export type TypedArray = Uint8ClampedArray | Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array
export type NumberArray = number[] | TypedArray

export type FixedLengthArray<Type extends any, Length extends number, Arr extends Type[] = []> = 
    Arr['length'] extends Length
    ? Arr
    : FixedLengthArray<Type, Length, [Type, ...Arr]>

export type AtLeastOne<Type> = [Type, ...Type[]]
