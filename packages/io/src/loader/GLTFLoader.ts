import { BasicLitMaterial, Camera, Game, IBasicLitMaterial, Image2D, Material, Mesh, MeshRenderer, Prefab, RenderType, Shader, StaticMesh, Transform } from "@fwge/core"
import { AccessorDataType, GLTF, GLTFAccessor, GLTFAccessorTypedArray, GLTFAttributeTypeLength, GLTFBufferView, GLTFPrimitive } from "../models/GLTF"
import { ILoader } from "./ILoader"

export const buffer_prefix = 'data:application/octet-stream;base64,'

export const GLTFLoader: ILoader<Prefab<any>> = (game: Game, srcGLTF: string, shader: Shader): Prefab<any> =>
{
    const gltf = JSON.parse(srcGLTF) as GLTF
    const buffers: Uint8Array[] = []
    
    for (let i = 0; i < gltf.buffers.length; ++i)
    {
        const buffer = gltf.buffers[i]
        const binstr = window.atob(buffer.uri?.substring(buffer_prefix.length) ?? '')
        const bin = new Uint8Array(buffer.byteLength)

        for (let byte = 0; byte < buffer.byteLength; ++byte)
        {
            bin[byte] = binstr.charCodeAt(byte)
        }

        buffers.push(bin)
    }
    
    return createPrefab(game, gltf, buffers, shader)
}

export const GLTFBinLoader: ILoader<Prefab<any>> = (game: Game, srcGLTF: string, srcBin: string, shader: Shader) =>
{
    const gltf = JSON.parse(srcGLTF) as GLTF
    const bin = new Uint8Array(gltf.buffers[0].byteLength)

    for (let byte = 0; byte < bin.byteLength; ++byte)
    {
        bin[byte] = srcBin.charCodeAt(byte)
    }

    return createPrefab(game, gltf, [bin], shader)
}

export const GLTBLoader: ILoader<Prefab<any>> = (game: Game, srcGLB: string, shader: Shader) =>
{
    let start = -1
    let end = -1
    let level: number | undefined
    
    for (let i = 0; i < srcGLB.length; ++i)
    {
        if (srcGLB[i] === '{') 
        {
            if (level === undefined)
            {
                start = i
                level = 1
            }
            else
            {
                level++
            }
        }
        
        if (srcGLB[i] === '}')
        {
            level = (level ?? 0) - 1
            if (level === 0)
            {
                end = i + 1
                break
            }
        }
    }

    const gltf = JSON.parse(srcGLB.substring(start, end)) as GLTF
    const bin = srcGLB.substring(end)
    const buffers: Uint8Array[] = []

    for (let i = 0, offset = 0; i < gltf.buffers.length; ++i)
    {
        const buffer = gltf.buffers[i]
        const data = new Uint8Array(buffer.byteLength)

        for (let byte = 0; byte < buffer.byteLength; ++byte)
        {
            data[byte] = bin.charCodeAt(i + offset)
        }

        buffers.push(data)
        offset += buffer.byteLength
    }

    return createPrefab(game, gltf, buffers, shader)
}

function parsePrimitive(game: Game, primitive: GLTFPrimitive, gltf: GLTF, buffers: Uint8Array[]): [Mesh, Material]
{
    const positionAccessor = gltf.accessors[primitive.attributes.POSITION]
    const normalAccessor = gltf.accessors[primitive.attributes.NORMAL]
    const tangentAccessor = gltf.accessors[primitive.attributes.TANGENT]
    const uvAccessor = gltf.accessors[primitive.attributes.TEXCOORD_0]
    const indexAccessor = gltf.accessors[primitive.indices]
    const materialAccessor = gltf.accessors[primitive.material]
    
    const positionArray = getArrayBuffer(positionAccessor, gltf.bufferViews[positionAccessor.bufferView], buffers)
    const normalArray = normalAccessor ? getArrayBuffer(normalAccessor, gltf.bufferViews[normalAccessor.bufferView], buffers) : undefined
    const tangentArray = tangentAccessor ? getArrayBuffer(tangentAccessor, gltf.bufferViews[tangentAccessor.bufferView], buffers) : undefined
    const uvArray = uvAccessor ? getArrayBuffer(uvAccessor, gltf.bufferViews[uvAccessor.bufferView], buffers) : undefined
    const indexArray = getIndexBuffer(indexAccessor, gltf.bufferViews[indexAccessor.bufferView], buffers)

    const mesh_args = {
        position: positionArray as [number, number, number][],
        normal: normalArray as [number, number, number][],
        uv: uvArray as [number, number][],
        index: indexArray
    }
    // meshes.push(new StaticMesh(args))

    const meshRenderer = new MeshRenderer({ asset: new StaticMesh(mesh_args) })

    return [null!,null!]
}

function createPrefab(game: Game, gltf: GLTF, buffers: Uint8Array[], shader: Shader)
{
    const prefab = new Prefab()

    const objects: Prefab<any>[] = []
    const meshes: StaticMesh[] = []
    const cameras: Camera[] = []
    const materials: Material[] = []
    const textures: Image2D[] = []

    const meshRendererMap = new Map<number, MeshRenderer>()
    const materialRendererMap = new Map<number, Material>()

    for (const material of gltf.materials ?? [])
    {
        const material_args: IBasicLitMaterial = {
            renderType: RenderType.OPAQUE,
            shader: shader,
            alpha: material.pbrMetallicRoughnes?.baseColorFactor[3] ?? 1.0,
            ambient: [
                material.pbrMetallicRoughnes?.baseColorFactor[0] ?? 0.3,
                material.pbrMetallicRoughnes?.baseColorFactor[1] ?? 0.3,
                material.pbrMetallicRoughnes?.baseColorFactor[2] ?? 0.3,
            ],
            shininess: Math.log2(material.pbrMetallicRoughnes?.metallicFactor ?? 0),
        }
    }
    
    for (const mesh of gltf.meshes)
    {
        for (const primitive of mesh.primitives)
        {
            const prefab = new Prefab()
            const positionAccessor = gltf.accessors[primitive.attributes.POSITION]
            const normalAccessor = gltf.accessors[primitive.attributes.NORMAL]
            const tangentAccessor = gltf.accessors[primitive.attributes.TANGENT]
            const uvAccessor = gltf.accessors[primitive.attributes.TEXCOORD_0]
            const indexAccessor = gltf.accessors[primitive.indices]
            
            const positionArray = getArrayBuffer(positionAccessor, gltf.bufferViews[positionAccessor.bufferView], buffers)
            const normalArray = normalAccessor ? getArrayBuffer(normalAccessor, gltf.bufferViews[normalAccessor.bufferView], buffers) : undefined
            const tangentArray = tangentAccessor ? getArrayBuffer(tangentAccessor, gltf.bufferViews[tangentAccessor.bufferView], buffers) : undefined
            const uvArray = uvAccessor ? getArrayBuffer(uvAccessor, gltf.bufferViews[uvAccessor.bufferView], buffers) : undefined
            const indexArray = getIndexBuffer(indexAccessor, gltf.bufferViews[indexAccessor.bufferView], buffers)

            const mesh_args = {
                position: positionArray as [number, number, number][],
                normal: normalArray as [number, number, number][],
                uv: uvArray as [number, number][],
                index: indexArray
            }
            // meshes.push(new StaticMesh(args))
            const materialAccessor = gltf.accessors[primitive.material]

            const meshRenderer = new MeshRenderer({ asset: new StaticMesh(mesh_args) })
            meshRendererMap.set(0, meshRenderer)
            prefab.AddComponent(new Transform())
            prefab.AddComponent(meshRenderer)
            // if (!materialAccessor)
            {
                prefab.AddComponent(new BasicLitMaterial(
                {
                    renderType: RenderType.OPAQUE,
                    shader: shader
                }))
            }
            objects.push(prefab)
        }
    }

    if (objects.length === 1)
    {
        return objects[0]
    }
    else
    {
        for (const child of objects)
        {
            prefab.AddChild(child)
        }
        return prefab
    }
}

// function createPrefab2(gltf: GLTF)
// {
//     const prefab = new Prefab()

//     const meshes: StaticMesh[] = []
//     const cameras: Camera[] = []
//     const materials: Material[] = []
//     const textures: Image2D[] = []

//     console.log(gltf)
//     console.log(prefab)

//     for (const mesh of gltf.meshes)
//     {
//         for (const primitive of mesh.primitives)
//         {
//             console.group(`Mesh`)

//             const positionAccessor = gltf.accessors[primitive.attributes.NORMAL]
//             const normalAccessor = gltf.accessors[primitive.attributes.NORMAL]
//             const tangentAccessor = gltf.accessors[primitive.attributes.TANGENT]
//             const uvAccessor = gltf.accessors[primitive.attributes.TEXCOORD_0]
//             const indexAccessor = gltf.accessors[primitive.indices]
//             console.log({ positionAccessor, normalAccessor, tangentAccessor, uvAccessor, indexAccessor })
            
//             const positionArray = getArrayBuffer(positionAccessor, gltf.bufferViews[positionAccessor.bufferView], gltf.buffers)
//             const normalArray = getArrayBuffer(normalAccessor, gltf.bufferViews[normalAccessor.bufferView], gltf.buffers)
//             const tangentArray = getArrayBuffer(tangentAccessor, gltf.bufferViews[tangentAccessor.bufferView], gltf.buffers)
//             const uvArray = getArrayBuffer(uvAccessor, gltf.bufferViews[uvAccessor.bufferView], gltf.buffers)
//             const indexArray = getIndexBuffer(indexAccessor, gltf.bufferViews)
//             console.log({ positionArray, normalArray, tangentArray, uvArray, indexArray })


//             console.groupEnd()
//         }
//     }

//     return prefab
// }

function getArrayBuffer(accessor: GLTFAccessor | undefined, bufferView: GLTFBufferView, buffers: Uint8Array[]): number[][]
{
    if (!accessor)
    {
        return []
    }

    const arr: number[][] = []
    const buffer = buffers[bufferView.buffer]

    const size = GLTFAttributeTypeLength.get(accessor.type)!
    const bufferType = GLTFAccessorTypedArray.get(accessor.componentType)!
    const bytesPerElement = size * bufferType.BYTES_PER_ELEMENT

    const offset = (bufferView.byteOffset ?? 0) + (accessor.byteOffset ?? 0)
    const length = bufferView.byteLength
    const end = offset + length
    const rawBufferChunk = new Uint8Array(buffer.slice(offset, end))
    const typedBufferChunk = new bufferType(rawBufferChunk.buffer)
     
    const stride = (bufferView.byteStride ?? 0) + bytesPerElement
    const sub_buffer = new bufferType(buffer, offset, (bytesPerElement * accessor.count))
  

    for (let i = 0; i < typedBufferChunk.length; i += size)
    {
        const values = []
        for (let j = 0; j < size; ++j)
        {
            values.push(typedBufferChunk[i + j])
        }
        arr.push(values)
    }
    
    return arr
}

function convertBuffer(buffer: Uint8Array, type: AccessorDataType, bufferType: Int8ArrayConstructor | Uint8ArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor)
{
    switch (type)
    {
        case AccessorDataType.UNSIGNED_BYTE:
            return bufferType.from(buffer).map(x => x)
        case AccessorDataType.SIGNED_BYTE:
            return bufferType.from(buffer).map(x => x)
        case AccessorDataType.UNSIGNED_SHORT:
            return bufferType.from(buffer).map(x => x)
        case AccessorDataType.SIGNED_SHORT:
            return bufferType.from(buffer).map(x => x)
        case AccessorDataType.UNSIGNED_INT:
            return bufferType.from(buffer).map(x => x)
        case AccessorDataType.FLOAT:
            return bufferType.from(buffer).map(x => (x - 128) / 128.0)
        default: 
            return bufferType.from(buffer)
    }
}

function getIndexBuffer(accessor: GLTFAccessor | undefined, bufferView: GLTFBufferView, buffers: Uint8Array[]): number[]
{    
    if (!accessor)
    {
        return []
    }

    const arr: number[] = []
    const buffer = buffers[bufferView.buffer]
    const view = buffer.slice(
        (bufferView.byteOffset ?? 0),
        (bufferView.byteOffset ?? 0) + bufferView.byteLength
    )

    const size = GLTFAttributeTypeLength.get(accessor.type)!
    const bufferType = GLTFAccessorTypedArray.get(accessor.componentType)!
    const typedView = new bufferType(view.buffer)

    for (let i = 0; i < typedView.length; i += size)
    {
        arr.push(typedView[i])
    }

    return typedView as any as number[] 
}

