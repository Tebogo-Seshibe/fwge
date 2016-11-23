/*!
 *  @param {Object: request}
 *    @param {Array: ambient}
 *    @param {Array: diffuse}
 *    @param {Array: specular}
 *    @param {Array: alpha}
 *    @param {Array: shininess}
 *    @param {Array: shader}
 *    @param {Array: imagemap}
 *    @param {Array: bumpmap}
 *    @param {Array: specularmap}
 */
function Material(request)
{
    var $ = this;
    if (!request) request = {};
    GameItem.call($, undefined, "MATERIAL");

    function setup(item)
    {
        if (!item || !(item instanceof Array)) item = [0,0,0];
        if (item.length < 3)
        {
            switch (item.length)
            {
                case 0: item.position[0] = 0;
                case 1: item.position[1] = 0;
                case 2: item.position[2] = 0;
            }
        }

        return item;
    }
    
    var _Ambient     = FWGE.Render.Colour.Create(setup(request.ambient));
    var _Diffuse     = FWGE.Render.Colour.Create(setup(request.diffuse));
    var _Specular    = FWGE.Render.Colour.Create(setup(request.specular));
    var _Alpha       = typeof request.alpha === 'number' && request.alpha >= 0 ? request.alpha : 1.0;
    var _Shininess	 = typeof request.shininess === 'number' && request.shininess >= 0 ? request.shininess : 5.0;
    var _Shader      = request.shader instanceof Shader ? request.shader : undefined;
    var _ImageMap    = undefined;
    var _BumpMap     = undefined;
    var _SpecularMap = undefined;
    
    Object.defineProperties($,
    {
        Ambient:
        {
            get: function getAmbient() { return _Ambient; },
            set: function setAmbient()
            {
                if (arguments[0].Type === 'COLOUR')
                    FWGE.Maths.Vector3.Set(_Ambient, arguments[0]);
            }
        },
        Diffuse:
        {
            get: function getDiffuse() { return _Diffuse; },
            set: function setDiffuse()
            {
                if (arguments[0].Type === 'COLOUR')
                    FWGE.Maths.Vector3.Set(_Diffuse, arguments[0]);
            }
        },
        Specular:
        {
            get: function getSpecular() { return _Specular; },
            set: function setSpecular()
            {
                if (arguments[0].Type === 'COLOUR')
                    FWGE.Maths.Vector3.Set(_Specular, arguments[0]);
            }
        },
        Alpha:
        {
            get: function getAlpha() { return _Alpha; },
            set: function setAlpha()
            {
                if (typeof arguments[0] === 'number')
                    _Alpha = arguments[0];
            }
        },
        Shininess:
        {
            get: function getShininess() { return _Shininess; },
            set: function setShininess()
            {
                if (typeof arguments[0] === 'number')
                    _Shininess = arguments[0];
            }
        },
        Shader:
        {
            get: function getShader() { return _Shader; },
            set: function setShader()
            {
                if (arguments[0] instanceof Shader)
                    _Shader = arguments[0];
            }
        },
        ImageMap:
        {
            get: function getImageMap() { return _ImageMap; },
            set: function setImageMap()
            {
                if (arguments[0] instanceof WebGLTexture || arguments[0] === undefined)
                    _ImageMap = arguments[0];
            }
        },
        BumpMap:
        {
            get: function getBumpMap() { return _BumpMap; },
            set: function setBumpMap()
            {
                if (arguments[0] instanceof WebGLTexture || arguments[0] === undefined)
                    _BumpMap = arguments[0];
            }
        },
        SpecularMap:
        {
            get: function getSpecularMap() { return _SpecularMap; },
            set: function setSpecularMap()
            {
                if (arguments[0] instanceof WebGLTexture || arguments[0] === undefined)
                    _SpecularMap = arguments[0];
            }
        }
    });
    
    __MATERIAL__.push($);
}
Object.defineProperties(Material.prototype,
{
    constructor: { value: Material },
    SetTexture:
    {
        /*!
         *  @param {Object}
         *    @param {String: image}
         *    @param {String: bump}
         *    @param {String: specular}
         */
        value: function SetTextures(request)
        {
            if (!request) request = {};

            if (!!request.image)
            {
                var img = new Image();
                img.onload = function(){ this.LoadImage(img, this.ImageMap) };
                img.src = image;
            }
            
            if (!!request.bump)
            {
                var img = new Image();
                img.onload = function(){ this.LoadImage(img, this.BumpMap) };
                img.src = bump;
            }
            
            if (!!request.specular)
            {
                var img = new Image();
                img.onload = function(){ this.LoadImage(img, this.SpecularMap) };
                img.src = specular;
            }
        }
    },
    LoadImage:
    {
        /*!
         *  @param {Image: image}
         *  @param {WebGLTexture: texture}
         */
        value: function LoadImage(image, texture)
        {
            
        }
    }
});

