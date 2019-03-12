import Colour4 from './Colour4'
import FWGE from '../FWGE'
import Item from '../Item'
import Maths from '../Maths/Maths'
import Shader from '../Shader/Shader'

export class IRenderMaterial
{
    name?: string = 'Render Material'
    ambient?: Colour4 | Array<number> = [0.50, 0.50, 0.50, 1.00]
    diffuse?: Colour4 | Array<number> = [0.75, 0.75, 0.75, 1.00]
    specular?: Colour4 | Array<number> = [1.00, 1.00, 1.00, 1.00]
    alpha?: number = 1
    shininess?: number = 5
    shader?: Shader
    texture?: any
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

    constructor({name, ambient, diffuse, specular, alpha, shininess, shader, texture}: IRenderMaterial = new IRenderMaterial)
    {
        super(name)
    }

    AttachShader(shader: Shader): void
    {

    }

    static BindMap(): void
    {

    }

    static ApplyImage(src: string, material: RenderMaterial, type: string): void
    {
        let img: HTMLImageElement = new Image()
        let texture: WebGLTexture = null

        switch(type)
        {
            case 'image':
                material.ImageMap = FWGE.GL.createTexture();
                texture = material.ImageMap;
            break;

            case 'bump':
                material.BumpMap = FWGE.GL.createTexture();
                texture = material.BumpMap;
            break;

            case 'specular':
                material.SpecularMap = FWGE.GL.createTexture();
                texture = material.SpecularMap;
            break;

            default: texture = null;
        }

        FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, texture);
        FWGE.GL.texImage2D(FWGE.GL.TEXTURE_2D, 0, FWGE.GL.RGBA, 1, 1, 0, FWGE.GL.RGBA, FWGE.GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));

        img.onload = function()
        {
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, texture);
            FWGE.GL.texImage2D(FWGE.GL.TEXTURE_2D, 0, FWGE.GL.RGBA, FWGE.GL.RGBA, FWGE.GL.UNSIGNED_BYTE, img);

            // then either generate mips if the image uses power-of-2 dimensions or 
            // set the filtering correctly for non-power-of-2 images.
            if (Maths.IsPowerOf2(img.width) && Maths.IsPowerOf2(img.height))
            {
                FWGE.GL.generateMipmap(FWGE.GL.TEXTURE_2D);
                FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_MAG_FILTER, FWGE.GL.LINEAR);
                FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_MIN_FILTER, FWGE.GL.LINEAR_MIPMAP_NEAREST);
            }
            else
            {
                FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_WRAP_S, FWGE.GL.CLAMP_TO_EDGE);
                FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_WRAP_T, FWGE.GL.CLAMP_TO_EDGE);
                FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_MIN_FILTER, FWGE.GL.LINEAR);
            }

            //FWGE.GL.pixelStorei(FWGE.GL.UNPACK_FLIP_Y_WEBGL, true);                
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
        };
        img.src = src;
    }

    SetTextures({imagemap = 'undefined', bumpmap = 'undefined', specularmap = 'undefined'} = {}): void
    {
        if (!!imagemap)
        {
            if (!!this.ImageMap)
                FWGE.GL.deleteTexture(this.ImageMap);

            RenderMaterial.ApplyImage(imagemap, this, 'image');
        }
        if (!!bumpmap)
        {
            if (!!this.BumpMap)
                FWGE.GL.deleteTexture(this.BumpMap);

            RenderMaterial.ApplyImage(bumpmap, this, 'bump');
        }
        if (!!specularmap)
        {
            if (!!this.SpecularMap)
                FWGE.GL.deleteTexture(this.SpecularMap);

            RenderMaterial.ApplyImage(specularmap, this, 'specular');
        }
    }
}