var __MATERIAL__ = [];

/*!
 *  @constructor    Material
 *  @description    Hello
 *  @param          {Object: request}
 *                  > {Array: ambient}
 *                  > {Array: diffuse}
 *                  > {Array: specular}
 *                  > {Number: alpha}
 *                  > {Number: shininess}
 *                  > {Number: shader}
 *                  > {String: imagemap}
 *                  > {String: bumpmap}
 *                  > {String: specularmap}
 */
function RenderMaterial(request)
{
    if (!request) request = {};
    request.type = "MATERIAL";
    RenderItem.call(this, {parent: undefined, });

    function colour(item)
    {
        if (!item || !(item instanceof Array)) item = [0, 0, 0];
        if (item.length < 3)
        {
            switch (item.length)
            {
                case 0: item.position[0] = 0;
                case 1: item.position[1] = 0;
                case 2: item.position[2] = 0;
            }
        }

        return FWGE.Render.Colour.Create(item);
    }
   
    var _Ambient     = colour(request.ambient);
    var _Diffuse     = colour(request.diffuse);
    var _Specular    = colour(request.specular);
    var _Alpha       = typeof request.alpha     === 'number' && request.alpha     >= 0 ? request.alpha     : 1.0;
    var _Shininess	 = typeof request.shininess === 'number' && request.shininess >= 0 ? request.shininess : 5.0;
    var _Shader      = request.shader instanceof Shader ? request.shader : undefined;
    var _ImageMap    = undefined;
    var _BumpMap     = undefined;
    var _SpecularMap = undefined;
    
    Object.defineProperties(this,
    {
        /*!
         *  @property       {Float32Array: Ambient}
         *  @description    
         */
        Ambient:
        {
            get: function getAmbient() { return _Ambient; },
            set: function setAmbient(ambient)
            {
                if (ambient.Type === 'COLOUR')
                    FWGE.Game.Maths.Vector3.Set(_Ambient, ambient);
            }
        },

        /*!
         *  @property       {Float32Array: Diffuse}
         *  @description    
         */
        Diffuse:
        {
            get: function getDiffuse() { return _Diffuse; },
            set: function setDiffuse(diffuse)
            {
                if (diffuse.Type === 'COLOUR')
                    FWGE.Game.Maths.Vector3.Set(_Diffuse, diffuse);
            }
        },

        /*!
         *  @property       {Float32Array: Specular}
         *  @description    
         */
        Specular:
        {
            get: function getSpecular() { return _Specular; },
            set: function setSpecular(specular)
            {
                if (specular.Type === 'COLOUR')
                    FWGE.Game.Maths.Vector3.Set(_Specular, specular);
            }
        },

        /*!
         *  @property       {Number: Alpha}
         *  @description    
         */
        Alpha:
        {
            get: function getAlpha() { return _Alpha; },
            set: function setAlpha(alpha)
            {
                if (typeof alpha === 'number')
                    _Alpha = alpha;
            }
        },

        /*!
         *  @property       {Number: Shininess}
         *  @description    
         */
        Shininess:
        {
            get: function getShininess() { return _Shininess; },
            set: function setShininess(shininess)
            {
                if (typeof shininess === 'number')
                    _Shininess = shininess;
            }
        },

        /*!
         *  @property       {Shader: Shader}
         *  @description    
         */
        Shader:
        {
            get: function getShader() { return _Shader; },
            set: function setShader(shader)
            {
                if (shader instanceof Shader)
                    _Shader = shader;
            }
        },

        /*!
         *  @property       {WebGLTexture: ImageMap}
         *  @description    
         */
        ImageMap:
        {
            get: function getImageMap() { return _ImageMap; },
            set: function setImageMap(imagemap)
            {
                if (imagemap instanceof WebGLTexture || imagemap === undefined)
                    _ImageMap = imagemap;
            }
        },

        /*!
         *  @property       {WebGLTexture: BumpMap}
         *  @description    
         */
        BumpMap:
        {
            get: function getBumpMap() { return _BumpMap; },
            set: function setBumpMap(bumpmap)
            {
                if (bumpmap instanceof WebGLTexture || bumpmap === undefined)
                    _BumpMap = bumpmap;
            }
        },

        /*!
         *  @property       {WebGLTexture: SpecularMap}
         *  @description    
         */
        SpecularMap:
        {
            get: function getSpecularMap() { return _SpecularMap; },
            set: function setSpecularMap(specularmap)
            {
                if (specularmap instanceof WebGLTexture || specularmap === undefined)
                    _SpecularMap = specularmap;
            }
        }
    });
    
    __MATERIAL__.push(this);
}
Object.defineProperties(RenderMaterial.prototype,
{
    constructor: { value: RenderMaterial },
    
    /*!
     *  @description    
     *  @param          {Object}
     *                  {String: image}
     *                  {String: bump}
     *                  {String: specular}
     */
    SetTexture:
    {
        value: function SetTextures(request)
        {
            if (!request) request = {};
            if (typeof request.image === 'string')      apply_image(request.image, this.ImageMap);
            if (typeof request.bump === 'string')       apply_image(request.bump, this.BumpMap);
            if (typeof request.specular === 'string')   apply_image(request.specular, this.Specular);

            function apply_image(src, texture)
            {
                var img = new Image();
                img.onload = function onload()
                {
                    //this.LoadImage(img, texture);
                };
                img.src = src;
            }
        }
    }
});

