export type TypedArray = Uint8ClampedArray | Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float32Array | Float64Array
export type TypedArrayConstructor = Uint8ClampedArrayConstructor | Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor | Int8ArrayConstructor | Int16ArrayConstructor | Int32ArrayConstructor | Float32ArrayConstructor | Float64ArrayConstructor
export type NumberArray = number[] | TypedArray;

export type FixedLengthArray<Type, Length extends number, Arr extends Type[] = []> = 
    Arr['length'] extends Length
    ? Arr
    : FixedLengthArray<Type, Length, [Type, ...Arr]>;

export type AtLeastOne<Type> = [Type, ...Type[]];

export type Enumerate<N extends number, Acc extends number[] = []> = 
    Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>;