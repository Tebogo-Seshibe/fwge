import { Vector2, Vector3 } from "@fwge/common"
import { Colour4 } from "./base"

export const POSITION_INDEX: number            = 0
export const NORMAL_INDEX: number              = 1
export const UV_INDEX: number                  = 2
export const COLOUR_INDEX: number              = 3
export const MODEL_VIEW_MATRIX_INDEX: number   = 4
export const NORMAL_MATRIX_INDEX: number       = 8

export const POSITION_SIZE: number = Vector3.BYTES_PER_ELEMENT * Vector3.SIZE
export const NORMAL_SIZE: number   = Vector3.BYTES_PER_ELEMENT * Vector3.SIZE
export const COLOUR_SIZE: number   = Colour4.BYTES_PER_ELEMENT * Colour4.SIZE
export const UV_SIZE: number       = Vector2.BYTES_PER_ELEMENT * Vector2.SIZE
