/**
 * @name        Material
 * @module      FWGE.Render
 * @description This object defines how the mesh in a gameobject will look
 *              like when rendered to a screen.
 */

window.RenderMaterial = (function()
{
    /**
     * @param   {Object}    request
     * @param   {string}    request.name
     * @param   {Array}     request.ambient
     * @param   {Array}     request.diffuse
     * @param   {Array}     request.specular
     * @param   {number}    request.alpha
     * @param   {number}    request.shininess
     * @param   {Shader}    request.shader
     */
    function RenderMaterial({name = 'Render Material', ambient = [0.50, 0.50, 0.50, 1.00], diffuse = [0.75, 0.75, 0.75, 1.00], specular = [1.00, 1.00, 1.00, 1.00], alpha = 1, shininess = 5, shader = undefined, texture = undefined} = {})
    {
        Item.call(this, name);

        Object.defineProperties(this,
        {
            /**
             * @property    {Ambient}
             * @type        {Colour}
             */
            Ambient: { value: new Colour(ambient[0], ambient[1], ambient[2], ambient[3]), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Diffuse}
             * @type        {Colour}
             */
            Diffuse: { value: new Colour(diffuse[0], diffuse[1], diffuse[2], diffuse[3]), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Specular}
             * @type        {Colour}
             */
            Specular: { value: new Colour(specular[0], specular[1], specular[2], specular[3]), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Alpha}
             * @type        {number}
             */
            Alpha: { value: alpha, configurable: false, enumerable: true, writable: true },
            
            /**
             * @property    {Shininess}
             * @type        {number}
             */
            Shininess: { value: shininess, configurable: false, enumerable: true, writable: true },
            
            /**
             * @property    {Shader}
             * @type        {Shader}
             */
            Shader: { value: shader, configurable: false, enumerable: true, writable: true },

            
            /**
             * @property    {ImageMap}
             * @type        {WebGLTexture}
             */
            ImageMap: { value: null, configurable: false, enumerable: true, writable: true },
            
            /**
             * @property    {BumpMap}
             * @type        {WebGLTexture}
             */
            BumpMap: { value: null, configurable: false, enumerable: true, writable: true },
            
            /**
             * @property    {SpecularMap}
             * @type        {WebGLTexture}
             */
            SpecularMap: { value: null, configurable: false, enumerable: true, writable: true },
        });

        Object.seal(this);
        this.SetTextures(texture);
    }
    Object.defineProperties(RenderMaterial,
    {
        /**
         * @function    IsPowerOf2
         * @param       {number}    value
         * @return      {boolean}
         */
        IsPowerOf2:
        {
            value: function IsPowerOf2(value)
            {
                return (value & (value - 1)) == 0;
            }
        },

        /**
         * @function    ApplyImage
         * @param       {string}            src
         * @param       {RenderMaterial}    material
         * @param       {string}            type
         * @return      {undefined}
         */
        ApplyImage:
        {
            value: function ApplyImage(src, material, type)
            {
                var img = new Image();
                var texture = null;

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
                    if (RenderMaterial.IsPowerOf2(img.width) && RenderMaterial.IsPowerOf2(img.height))
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
    });

    RenderMaterial.prototype = Object.create(null);
    Object.defineProperties(RenderMaterial.prototype,
    {
        /**
         * @function    SetTextures
         * @param       {Object}    request
         * @param       {String}    request.imagemap
         * @param       {String}    request.bumpmap
         * @param       {String}    request.specularmap
         * @return      {undefined}
         */
        SetTextures: 
        { 
            value: function SetTextures({imagemap = undefined, bumpmap = undefined, specularmap = undefined} = {})
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
    });
    Object.seal(RenderMaterial.prototype);

    return RenderMaterial;
})();
Object.seal(RenderMaterial);
