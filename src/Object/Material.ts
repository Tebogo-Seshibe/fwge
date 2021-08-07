import { GL } from '../FWGE';
import Colour4 from '../Colour/Colour4';
import Shader from '../Shader/Shader';
import Item from './Item';
import { isPowerOf2 } from '../Maths/Math';

export enum ImageMapType
{
    TEXTURE,
    NORMAL,
    SPECULAR
}


export function ApplyImage(material: Material, src: string, type: ImageMapType): void
{
    let img: HTMLImageElement = new Image()
    let texture: WebGLTexture | null = null

    switch (type)
    {
        case ImageMapType.TEXTURE:
            if (material.ImageMap)
            {
                GL.deleteTexture(material.ImageMap)
            }
            material.ImageMap = GL.createTexture();
            texture = material.ImageMap;
        break

        case ImageMapType.NORMAL:
            if (material.BumpMap)
            {
                GL.deleteTexture(material.BumpMap)
            }
            material.BumpMap = GL.createTexture();
            texture = material.BumpMap;
        break

        case ImageMapType.SPECULAR:
            if (material.SpecularMap)
            {
                GL.deleteTexture(material.SpecularMap)
            }
            material.SpecularMap = GL.createTexture();
            texture = material.SpecularMap;
        break
    }

    GL.bindTexture(GL.TEXTURE_2D, texture);
    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));

    img.onload = e =>
    {
        GL.bindTexture(GL.TEXTURE_2D, texture)
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, img)

        if (isPowerOf2(img.width) && isPowerOf2(img.height))
        {
            GL.generateMipmap(GL.TEXTURE_2D)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST)
        }
        else
        {
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
        }

        //GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);                
        GL.bindTexture(GL.TEXTURE_2D, null);
    }

    img.src = src
}

export class IMaterial
{
    name?: string
    ambient?: Colour4 | Float32Array | number[]
    diffuse?: Colour4 | Float32Array | number[]
    specular?: Colour4 | Float32Array | number[]
    alpha?: number
    shininess?: number
    shader?: Shader
    imagemap?: string
    normalmap?: string
    specularmap?: string
}

export default class Material extends Item
{
    public Ambient: Colour4
    public Diffuse: Colour4
    public Specular: Colour4

    public Alpha: number
    public Shininess: number

    public ImageMap: WebGLTexture | null = null
    public BumpMap: WebGLTexture | null = null
    public SpecularMap: WebGLTexture | null = null

    public Shader?: Shader

    constructor()
    constructor(renderMaterial: IMaterial)
    constructor(
    {
        name = 'Render Material',
        ambient = [0.50, 0.50, 0.50, 1.0],
        diffuse = [0.65, 0.65, 0.65, 1.0],
        specular = [0.75, 0.75, 0.75, 1.0],
        alpha = 1.0,
        shininess = 32.0,
        shader,
        imagemap, normalmap, specularmap
    }: IMaterial = new IMaterial)
    {
        super(name)

        this.Ambient = new Colour4(ambient as number[])
        this.Diffuse = new Colour4(diffuse as number[])
        this.Specular = new Colour4(specular as number[])

        this.Alpha = alpha
        this.Shininess = shininess

        this.Shader = shader

        if (imagemap)
        {
            ApplyImage(this, imagemap, ImageMapType.TEXTURE)
        }
        if (normalmap)
        {
            ApplyImage(this, normalmap, ImageMapType.NORMAL)
        }
        if (specularmap)
        {
            ApplyImage(this, specularmap, ImageMapType.SPECULAR)
        }
    }
}
