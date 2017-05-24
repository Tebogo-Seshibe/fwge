import { Item }     from "../Game Engine/Item";
import { Colour } from "./Colour";
import { Shader } from "./Shader";
import { FWGE } from "../FWGE";

export class IRenderMaterial
{
    Name:           string = '';
    Ambient:        Colour = new Colour();
    Diffuse:        Colour = new Colour();
    Specular:       Colour = new Colour();
    Alpha:          number = 1.0;
    Shininess:      number = 32;
    Shader:         Shader | null = null;
}

export interface ISetTexture
{
    ImageMap:       string;
    BumpMap:        string;
    SpecularMap:    string;
}

// Hillary: 081 393 0871
// Bruce:   073 120 4773

/**
 * @name        Material
 * @description This object defines how the mesh in a gameobject will look
 *              like when rendered to a screen.
 * @module      FWGE.Render
 */
export class RenderMaterial extends Item
{
    public Ambient:     Colour;
    public Diffuse:     Colour;
    public Specular:    Colour;
    public Alpha:       number;
    public Shininess:   number;
    public Shader:      Shader | null;
    public ImageMap:    WebGLTexture | null;
    public BumpMap:     WebGLTexture | null;
    public SpecularMap: WebGLTexture | null;

    constructor(request: IRenderMaterial)
    {
        super(request.Name || "Render Material");

        this.Ambient = new Colour(request.Ambient) || new Colour(0.50, 0.50, 0.50, 1.00);
        this.Diffuse = new Colour(request.Diffuse) || new Colour(0.75, 0.75, 0.75, 1.00);
        this.Specular = new Colour(request.Specular) || new Colour(1.00, 1.00, 1.00, 1.00)
        this.Alpha = request.Alpha || 1;
        this.Shininess = request.Shininess || 5;
        this.Shader = request.Shader || null;

        this.ImageMap = null;
        this.BumpMap = null;
        this.SpecularMap = null;
    }   
     
    /**
     * @function    SetTextures: void
     * @description This function simply loads the appropriate textures into memory.   
     * @param       request:        {Object}
     *              > imagemap:     {String}    [null]
     *              > bumpmap:      {String}    [null]
     *              > specularmap:  {String}    [null]
     */
    SetTextures(request: ISetTexture)
    {
        if (!!request.ImageMap)
        {
            if (!!this.ImageMap)
                FWGE.GL.deleteTexture(this.ImageMap);

            apply_image(request.ImageMap, this, 'image');
        }
        if (!!request.BumpMap)
        {
            if (!!this.BumpMap)
                FWGE.GL.deleteTexture(this.BumpMap);

            apply_image(request.BumpMap, this, 'bump');
        }
        if (!!request.SpecularMap)
        {
            if (!!this.SpecularMap)
                FWGE.GL.deleteTexture(this.SpecularMap);

            apply_image(request.SpecularMap, this, 'specular');
        }

        function apply_image(src: string, material: RenderMaterial, type: string)
        {
            var img = new Image();
            var texture: WebGLTexture | null;
            function isPowerOf2(value: number) { return (value & (value - 1)) == 0; };

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
                if (isPowerOf2(img.width) && isPowerOf2(img.height))
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
    }
}
