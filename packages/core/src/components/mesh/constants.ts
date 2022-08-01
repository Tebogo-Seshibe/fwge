import { Colour4, Matrix3, Matrix4, Vector2, Vector3 } from "@fwge/common"

export const POSITION_INDEX:            number = 0
export const NORMAL_INDEX:              number = 1
export const UV_INDEX:                  number = 2
export const COLOUR_INDEX:              number = 3
export const MODEL_VIEW_MATRIX_INDEX:   number = 4
export const NORMAL_MATRIX_INDEX:       number = 8

export const POSITION_SIZE:             number = Vector3.BYTES_PER_ELEMENT * Vector3.SIZE
export const NORMAL_SIZE:               number = Vector3.BYTES_PER_ELEMENT * Vector3.SIZE
export const UV_SIZE:                   number = Vector2.BYTES_PER_ELEMENT * Vector2.SIZE
export const COLOUR_SIZE:               number = Colour4.BYTES_PER_ELEMENT * Colour4.SIZE
export const MODEL_VIEW_MATRIX_SIZE:    number = Matrix4.BYTES_PER_ELEMENT * Matrix4.SIZE
export const NORMAL_MATRIX_SIZE:        number = Matrix3.BYTES_PER_ELEMENT * Matrix3.SIZE

export const isLittleEndian = (() => {
    let uInt32 = new Uint32Array([0x11223344]);
    let uInt8 = new Uint8Array(uInt32.buffer);
    
    return uInt8[0] === 0x44
})()
