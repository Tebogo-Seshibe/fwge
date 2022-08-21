import { FixedLengthArray, TypedArray } from "@fwge/common"

export enum AccessorDataType
{
    SIGNED_BYTE = 5120,
    UNSIGNED_BYTE = 5121,
    SIGNED_SHORT = 5122,
    UNSIGNED_SHORT = 5123,
    UNSIGNED_INT = 5125,
    FLOAT = 5126,
}

export interface GLTFAsset
{
    generator?: string
    version: number
}

export interface GLTFNodeType
{
    translation?: [number, number, number]
    rotation?: [number, number, number]
    scale?: [number, number, number]
}

export interface GLTFMeshNode extends GLTFNodeType
{
    mesh: number
}

export interface GLTFCameraNode extends GLTFNodeType
{
    camera: number
}

export type GLTFNode = 
      GLTFMeshNode
    | GLTFCameraNode

export interface GLTFScene
{
    nodes: number[]
}

export interface GLTFBuffer
{
    uri?: string
    byteLength: number
    data?: Uint8Array
}

export interface GLTFSampler
{
    input: number
    interpolation: 'LINEAR'
    output: number
}

export interface GLTFTarget
{
    node: number
    path: keyof GLTFNodeType
}

export interface GLTFChannel
{
    sampler: number
    target: GLTFTarget
}

export interface GLTFAnimation
{
    samplers: GLTFSampler[]
    channels: GLTFChannel[]
}

export interface GLTFBufferView
{
    buffer: number
    byteOffset: number
    byteLength: number
    byteStride?: number
    target?: number
    data?: Uint8Array
}

export interface GLTFAccessorType
{
    bufferView: number
    byteOffset: number
    componentType: AccessorDataType
    count: number
}

export type TypedAccessor<Name, Length extends number> = 
{ 
    type: Name
    min?: FixedLengthArray<number, Length>
    max?: FixedLengthArray<number, Length>
}

export type Mat4 = TypedAccessor<'MAT4', 16>
export type GLTFAccessor = GLTFAccessorType & (
    TypedAccessor<'SCALAR', 1>
    | TypedAccessor<'VEC2', 2>
    | TypedAccessor<'VEC3', 3>
    | TypedAccessor<'VEC4', 4>
    | TypedAccessor<'MAT2', 4>
    | TypedAccessor<'MAT3', 9>
    | TypedAccessor<'MAT4', 16>
)

export const GLTFAttributeTypeLength: Map<GLTFAccessor['type'], number> = new Map(
[
    ["SCALAR", 1],
    ["VEC2", 2],
    ["VEC3", 3],
    ["VEC4", 4],
    ["MAT2", 4],
    ["MAT3", 9],
    ["MAT4", 16]
])


export const GLTFAccessorTypedArray: Map<AccessorDataType, Int8ArrayConstructor | Uint8ArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor> = new Map(
[
    [AccessorDataType.SIGNED_BYTE, Int8Array as any],
    [AccessorDataType.UNSIGNED_BYTE, Uint8Array as any],
    [AccessorDataType.SIGNED_SHORT, Int16Array as any],
    [AccessorDataType.UNSIGNED_SHORT, Uint16Array as any],
    [AccessorDataType.UNSIGNED_INT, Uint32Array as any],
    [AccessorDataType.FLOAT, Float32Array as any]
])

export interface GLTFSampler
{
    magFilter: number
    minFilter: number
    wrapS: number
    wrapT: number
}

export interface GLTFImage
{
    uri: string
    mimeType?: string
}

export interface GLTFTexture
{
    sampler: number
    source: number
}

export interface GLTFTextureIndex
{
    index: number
    scale?: number
    textCoord?: number
}

export interface GLTFPBRMetallicRoughnes
{
    baseColorFactor: [number, number, number, number]
    baseColorTexture: GLTFTextureIndex
    metallicRoughnessTexture: GLTFTextureIndex
    metallicFactor?: number
    roughnessFactor?: number
}

export interface GLTFMaterial
{
    alphaMode: 'MASK' | 'BLEND'
    doubleSided: boolean
    pbrMetallicRoughnes: GLTFPBRMetallicRoughnes
    normalTexture: GLTFTextureIndex
}

export interface GLTFAttribute
{
    POSITION: number
    TEXCOORD_0: number
    NORMAL: number
    TANGENT: number
}

export interface GLTFPrimitive
{
    indices: number
    material: number
    mode: number
    attributes: GLTFAttribute
    targets: GLTFAttribute[]
}

export interface GLTFMesh
{
    primitives: GLTFPrimitive[]
    weights: number[]
}

export interface GLTFPerpectiveCamera
{
    type: 'perpective'
    perpective: {
        aspectRatio: number
        yfov: number
        zfar: number
        znear: number
    }
}

export interface GLTFOrthographicCamera
{
    type: 'orthographic'
    orthographic: {
        xmag: number
        ymag: number
        zfar: number
        znear: number
    }    
}

export type GLTFCamera = GLTFPerpectiveCamera | GLTFOrthographicCamera

export interface GLTF
{
    asset: GLTFAsset

    scene: number
    scenes: GLTFScene[]
    nodes: GLTFNode[]

    cameras: GLTFCamera[]
    animations: GLTFAnimation[]
    images: GLTFImage[]
    meshes: GLTFMesh[]
    materials: GLTFMaterial[]

    buffers: GLTFBuffer[]
    bufferViews: GLTFBufferView[]
    accessors: GLTFAccessor[]
}