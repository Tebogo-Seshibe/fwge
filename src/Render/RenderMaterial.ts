import Item from '../Item';
import '../Maths/Maths';
import Shader from '../Shader/Shader';
import { GL } from '../Utility/Control';
import Colour4 from './Colour4';

export enum ImageMapType
{
    TEXTURE,
    NORMAL,
    SPECULAR
}

export class IRenderMaterial
{
    name?: string
    ambient?: Colour4 | Float32Array | number[]
    diffuse?: Colour4 | Float32Array | number[]
    specular?: Colour4 | Float32Array | number[]
    alpha?: number
    shininess?: number
    shader: Shader
    imagemap?: string
    normalmap?: string
    specularmap?: string
}

export default class RenderMaterial extends Item
{
    public Ambient: Colour4
    public Diffuse: Colour4
    public Specular: Colour4

    public Alpha: number
    public Shininess: number

    public ImageMap: WebGLTexture
    public BumpMap: WebGLTexture
    public SpecularMap: WebGLTexture

    public Shader: Shader

    constructor()
    constructor(renderMaterial: IRenderMaterial)
    constructor(
    {
        name = 'Render Material',
        ambient = [0.5, 0.5, 0.5, 1.0],
        diffuse = [0.5, 0.5, 0.5, 1.0],
        specular = [0.5, 0.5, 0.5, 1.0],
        alpha = 1.0,
        shininess = 32.0,
        shader,
        imagemap, normalmap, specularmap
    }: IRenderMaterial = new IRenderMaterial)
    {
        super(name)

        this.Ambient = new Colour4(ambient as number[])
        this.Diffuse = new Colour4(diffuse as number[])
        this.Specular = new Colour4(specular as number[])

        this.Alpha = alpha
        this.Shininess = shininess

        this.Shader = shader

        if (imagemap) RenderMaterial.ApplyImage(this, imagemap, ImageMapType.TEXTURE)
        if (normalmap) RenderMaterial.ApplyImage(this, normalmap, ImageMapType.NORMAL)
        if (specularmap) RenderMaterial.ApplyImage(this, specularmap, ImageMapType.SPECULAR)
    }

    public static ApplyImage(material: RenderMaterial, src: string, type: ImageMapType): void
    {
        let img: HTMLImageElement = new Image()
        let texture: WebGLTexture = null

        switch (type)
        {
            case ImageMapType.TEXTURE:
                material.ImageMap = GL.createTexture();
                texture = material.ImageMap;
            break;

            case ImageMapType.NORMAL:
                material.BumpMap = GL.createTexture();
                texture = material.BumpMap;
            break;

            case ImageMapType.SPECULAR:
                material.SpecularMap = GL.createTexture();
                texture = material.SpecularMap;
            break;

            default: texture = null;
        }

        GL.bindTexture(GL.TEXTURE_2D, texture);
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));

        img.onload = function()
        {
            GL.bindTexture(GL.TEXTURE_2D, texture);
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, img);

            // then either generate mips if the image uses power-of-2 dimensions or 
            // set the filtering correctly for non-power-of-2 images.
            if (Math.isPowerOf2(img.width) && Math.isPowerOf2(img.height))
            {
                GL.generateMipmap(GL.TEXTURE_2D);
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST);
            }
            else
            {
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
            }

            //GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);                
            GL.bindTexture(GL.TEXTURE_2D, null);
        }

        img.src = src
    }
}
