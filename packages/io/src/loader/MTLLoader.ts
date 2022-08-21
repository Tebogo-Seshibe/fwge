import { Colour4 } from "@fwge/common"
import { BasicLitMaterial, Material, RenderType, Shader } from "@fwge/core"
import { ILoader } from "./ILoader"

export type MTLKey = 'newmtl' 
    | 'ka' | 'kd' | 'ks' | 'ns' | 'd' | 'tr' | 'illum' 
    | 'map_ka' | 'map_kd' | 'map_d'
    | 'map_disp' | 'map_bump' | 'bump'
    | 'map_ks'

export type MTL = { [name: string]: Material }
export const MTLLoader: ILoader<MTL> =  (src: string, defaultShader: Shader) =>
{
    const materials: MTL = { }
    const mtlLines = src.trim().split('\n').map(x => x.trim())
    const matMap: Map<string, any> = new Map()
    let newmtl: string = ''
    for (let line of mtlLines)
    {
        const key = line.split(' ')[0].trim().toLowerCase() as MTLKey
        const value = line.substring(key.length).trim()
        const values = value.split(' ').map(x => x.trim()).filter(x => x.length > 0)
        
        switch (key)
        {
            case 'newmtl':
                newmtl = value
                matMap.set(newmtl, {})
                break

            case 'ka':
                matMap.get(newmtl)!.ambient = new Colour4(
                    parseFloat(values[0]),
                    parseFloat(values[1]),
                    parseFloat(values[2]),
                    1.0
                )
                break

            case 'kd':
                matMap.get(newmtl)!.diffuse = new Colour4(
                    parseFloat(values[0]),
                    parseFloat(values[1]),
                    parseFloat(values[2]),
                    1.0
                )
                break

            case 'ks':
                matMap.get(newmtl)!.specular = new Colour4(
                    parseFloat(values[0]),
                    parseFloat(values[1]),
                    parseFloat(values[2]),
                    1.0
                )
                break

            case 'ns':
                matMap.get(newmtl)!.shininess = parseFloat(value)
                break

            case 'd':
                matMap.get(newmtl)!.alpha = parseFloat(value)
                break

            case 'tr':
                matMap.get(newmtl)!.alpha = 1.0 - parseFloat(value)
                break

            case 'map_ka':
            case 'map_kd':
            case 'map_d':
                matMap.get(newmtl)!.imagemap = value
                break

            case 'map_ks':
                matMap.get(newmtl)!.specularmap = value
                break

            case 'map_bump':
            case 'bump':
                matMap.get(newmtl)!.normalmap = values.last().trim()
                break
        }
    }

    const matKeys = Array.from(matMap.keys())
    for (const key of matKeys)
    {
        const material = matMap.get(key)
        if (!material)
        {
            continue
        }
        const src = (material.imagemap ?? '')
        material.shader = defaultShader
        material.renderType = src.includes('.png') || src.includes('.tga') ? RenderType.TRANSPARENT : RenderType.OPAQUE
        materials[key!] = new BasicLitMaterial(material)
    }

    return materials
}
