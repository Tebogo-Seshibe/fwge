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

export type ILoader<T> = (src: string, ...rest: any[]) => T
