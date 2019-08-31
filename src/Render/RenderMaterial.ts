import Item from '../Item';
import '../Maths/Maths';
import Shader from '../Shader/Shader';
import { GL } from '../Utility/Control';
import Colour4 from './Colour4';

export enum ImageMapType
{
    TEXTURE,
    BUMP,
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
    shader?: Shader
    imagemap?: string
    normalmap?: string
    specularmap?: string
}

export default class RenderMaterial extends Item
{
    public Ambient: Colour4 = new Colour4(0.5, 0.5, 0.5, 1.0)
    public Diffuse: Colour4 = new Colour4(0.5, 0.5, 0.5, 1.0)
    public Specular: Colour4 = new Colour4(0.5, 0.5, 0.5, 1.0)

    public Alpha: number = 1
    public Shininess: number = 5

    public ImageMap: WebGLTexture
    public BumpMap: WebGLTexture
    public SpecularMap: WebGLTexture

    public Shader: Shader

    constructor()
    constructor(renderMaterial: IRenderMaterial)
    constructor({ name = 'Render Material', ambient, diffuse, specular, alpha, shininess, shader, imagemap }: IRenderMaterial = new IRenderMaterial)
    {
        super(name)

        if (ambient)
        {
            this.Ambient = new Colour4(ambient as number[])
        }

        if (diffuse)
        {
            this.Diffuse = new Colour4(diffuse as number[])
        }

        if (specular)
        {
            this.Specular = new Colour4(specular as number[])
        }
        
        if (alpha)
        {
            this.Alpha = alpha
        }

        if (shininess)
        {
            this.Shininess = shininess
        }

        this.Shader = shader

        if (imagemap)
        {
            RenderMaterial.ApplyImage(this, imagemap, ImageMapType.TEXTURE)
        }
    }

    public static ApplyImage(material: RenderMaterial, src: string, type: ImageMapType): void
    {
        let img: HTMLImageElement = new Image()
        let texture: WebGLTexture = null

        switch(type)
        {
            case ImageMapType.TEXTURE:
                material.ImageMap = GL.createTexture();
                texture = material.ImageMap;
            break;

            case ImageMapType.BUMP:
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
