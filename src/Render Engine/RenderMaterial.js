var __MATERIAL__ = [];

/**
 * @name        Material
 * @description This object defines how the mesh in a gameobject will look
 *              like when rendered to a screen.
 * @module      FWGE.Render
 */
function RenderMaterial(request)
{
    if (!request) request = {};
    request.type = "MATERIAL";
    Item.call(this, request);

    function colour(item)
    {
        if (!item || !(item instanceof Array)) item = [0, 0, 0];
        
        switch (item.length)
        {
            case 0: item.position[0] = 0;
            case 1: item.position[1] = 0;
            case 2: item.position[2] = 0;
        }

        return FWGE.Render.Colour.Create(item);
    }
   
    var _Ambient     = colour(request.ambient);
    var _Diffuse     = colour(request.diffuse);
    var _Specular    = colour(request.specular);
    var _Alpha       = typeof request.alpha     === 'number' && request.alpha     >= 0 ? request.alpha     : 1.0;
    var _Shininess   = typeof request.shininess === 'number' && request.shininess >= 0 ? request.shininess : 5.0;
    var _Shader      = request.shader instanceof Shader ? request.shader : undefined;
    var _ImageMap    = undefined;
    var _BumpMap     = undefined;
    var _SpecularMap = undefined;
    
    Object.defineProperties(this,
    {
        /**
         * @property    Ambient: {Float32Array}
         *              > get
         *              > set
         * @description The colour of the material under no light
         */
        Ambient:
        {
            get: function getAmbient() { return _Ambient; },
            set: function setAmbient()
            {
                if (arguments[0].Type === 'COLOUR')
                    FWGE.Game.Maths.Vector3.Set(_Ambient, arguments[0]);
            }
        },

        /**
         * @property    Diffuse: {Float32Array}
         *              > get
         *              > set
         * @description The colour of the object under even/flat light
         */
        Diffuse:
        {
            get: function getDiffuse() { return _Diffuse; },
            set: function setDiffuse()
            {
                if (arguments[0].Type === 'COLOUR')
                    FWGE.Game.Maths.Vector3.Set(_Diffuse, arguments[0]);
            }
        },

        /**
         * @property    Specular: {Float32Array}
         *              > get
         *              > set
         * @description The colour of the object when reflection specular light
         */
        Specular:
        {
            get: function getSpecular() { return _Specular; },
            set: function setSpecular()
            {
                if (arguments[0].Type === 'COLOUR')
                    FWGE.Game.Maths.Vector3.Set(_Specular, arguments[0]);
            }
        },

        /**
         * @property    Alpha: {Number}
         *              > get
         *              > set
         * @description The opacity of the material
         */
        Alpha:
        {
            get: function getAlpha() { return _Alpha; },
            set: function setAlpha()
            {
                if (typeof arguments[0] === 'number')
                    _Alpha = arguments[0];
            }
        },

        /**
         * @property    Shininess: {Number}
         *              > get
         *              > set
         * @description This amount of shine the specular light shows
         */
        Shininess:
        {
            get: function getShininess() { return _Shininess; },
            set: function setShininess()
            {
                if (typeof arguments[0] === 'number')
                    _Shininess = arguments[0];
            }
        },

        /**
         * @property    Shader: {Shader}
         *              > get
         *              > set
         * @description The shader used to the render
         */
        Shader:
        {
            get: function getShader() { return _Shader; },
            set: function setShader()
            {
                if (arguments[0] instanceof Shader)
                    _Shader = arguments[0];
            }
        },

        /**
         * @property    ImageMap: {WebGLTexture}
         *              > get
         *              > set
         * @description The texture map for the material
         */
        ImageMap:
        {
            get: function getImageMap() { return _ImageMap; },
            set: function setImageMap()
            {
                if (arguments[0] instanceof WebGLTexture)
                    _ImageMap = arguments[0];
                else if (arguments[0] === undefined)
                {
                    GL.deleteTexture(_ImageMap);
                    _ImageMap = undefined;
                }
            }
        },

        /**
         * @property    BumpMap: {WebGLTexture}
         *              > get
         *              > set
         * @description The bump map for the material
         */
        BumpMap:
        {
            get: function getBumpMap() { return _BumpMap; },
            set: function setBumpMap()
            {
                if (arguments[0] instanceof WebGLTexture)
                    _BumpMap = arguments[0];
                else if (arguments[0] === undefined)
                {
                    GL.deleteTexture(_BumpMap);
                    _BumpMap = undefined;
                }
            }
        },

        /**
         * @property    SpecularMap: {WebGLTexture}
         *              > get
         *              > set
         * @description The specular map for the material
         */
        SpecularMap:
        {
            get: function getSpecularMap() { return _SpecularMap; },
            set: function setSpecularMap()
            {
                if (arguments[0] instanceof WebGLTexture)
                    _SpecularMap = arguments[0];
                else if (arguments[0] === undefined)
                {
                    GL.deleteTexture(_SpecularMap);
                    _SpecularMap = undefined;
                }
            }
        }
    });

    this.SetTextures(request);
    
    __MATERIAL__.push(this);
}
Object.defineProperties(RenderMaterial.prototype,
{
    constructor: { value: RenderMaterial },
    
    /**
     * @function    SetTextures: void
     * @description This function simply loads the appropriate textures into memory.   
     * @param       request:        {Object}
     *              > imagemap:     {String}    [nullable]
     *              > bumpmap:      {String}    [nullable]
     *              > specularmap:  {String}    [nullable]
     */
    SetTextures:
    {
        value: function SetTextures(request)
        {
            if (!request) request = {};
            if (typeof request.imagemap === 'string')
            {
                if (!this.ImageMap)
                    this.ImageMap = GL.createTexture();
                apply_image(request.imagemap, this.ImageMap);
            }
            if (typeof request.bumpmap === 'string')
            {
                if (!this.BumpMap)
                    this.BumpMap = GL.createTexture();
                apply_image(request.bumpmap, this.BumpMap);
            }
            if (typeof request.specularmap === 'string')
            {
                if (!this.SpecularMap)
                    this.SpecularMap = GL.createTexture();
                apply_image(request.specularmap, this.Specular);
            }

            function apply_image(src, texture)
            {
                var img = new Image()
                img.onload = function()
                {
                    GL.bindTexture(GL.TEXTURE_2D, texture);
                    GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
                    GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, img);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
                    GL.generateMipmap(GL.TEXTURE_2D);
                    GL.bindTexture(GL.TEXTURE_2D, null);
                };
                img.src = src;
            }
        }
    }
});

