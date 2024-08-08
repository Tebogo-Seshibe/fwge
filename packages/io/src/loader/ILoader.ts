import { Game } from "@fwge/core";

export type OBJKey = 'mtllib' | 'o' | 'g' | 'v' | 'vn' | 'vt' | 'vp' | 'f' | 'usemtl'

export interface OBJObject
{
    name?: string
    material?: string
    faces?: OBJFace[][]
}

export interface OBJFace
{
    v: number
    vt: number
    vn: number
}

export type ILoader<T> = (game: Game, src: string, ...rest: any[]) => T
