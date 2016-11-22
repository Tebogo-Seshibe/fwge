function Material(request)
{
    var $ = this;

    if (!request)   request = {};
    if (!request.ambient || request.ambient.Type !== "COLOUR") request.ambient = FWGE.Render.Colour.Create(request.ambient);
    if (!request.diffuse || request.diffuse.Type !== "COLOUR") request.diffuse = FWGE.Render.Colour.Create(request.diffuse);
    if (!request.specular || request.specular.Type !== "COLOUR") request.specular = FWGE.Render.Colour.Create(request.specular);
    if (typeof request.alpha !== 'number') request.alpha = 1.0;
    if (typeof request.shininess !== 'number') request.shininess = 5.0;
    if (!request.shader) request.shader = undefined;
    if (!request.imagemap) request.imagemap = undefined;
    if (!request.bumpmap) request.bumpmap = undefined;
    
    console.log(request);

    GameItem.call($, undefined, "MATERIAL");
    
    var _Ambient    = request.ambient;
    var _Diffuse    = request.diffuse;
    var _Specular   = request.specular;
    var _Alpha      = request.alpha;
    var _Shininess	= request.shininess;
    var _Shader     = request.shader;
    var _Image      = undefined;
    var _Bump       = undefined;
    
    Object.defineProperties($,
    {
        Ambient:
        {
            get: function getAmbient(){ return _Ambient; },
            set: function setAmbient()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Maths.Vector3.Set(_Ambient, arguments[0]);
            }
        },
        Diffuse:
        {
            get: function getDiffuse(){ return _Diffuse; },
            set: function setDiffuse()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Maths.Vector3.Set(_Diffuse, arguments[0]);
            }
        },
        Specular:
        {
            get: function getSpecular(){ return _Specular; },
            set: function setSpecular()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Maths.Vector3.Set(_Specular, arguments[0]);
            }
        },
        Alpha:
        {
            get: function getAlpha(){ return _Alpha; },
            set: function setAlpha()
            {
                if (typeof arguments[0] === 'number')
                    _Alpha = arguments[0];
            }
        },
        Shininess:
        {
            get: function getShininess(){ return _Shininess; },
            set: function setShininess()
            {
                if (typeof arguments[0] === 'number')
                    _Shininess = arguments[0];
            }
        },
        Shader:
        {
            get: function getShader(){ return _Shader; },
            set: function setShader()
            {
                if (arguments[0] instanceof Shader)
                    _Shader = arguments[0];
            }
        },
        Image:
        {
            get: function getImage(){ return _Image; },
            set: function setImage()
            {
                if (arguments[0] instanceof WebGLTexture || arguments[0] === undefined)
                    _Image = arguments[0];
            }
        },
        Bump:
        {
            get: function getBump(){ return _Bump; },
            set: function setBump()
            {
                if (arguments[0] instanceof WebGLTexture || arguments[0] === undefined)
                    _Bump = arguments[0];
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
        value: function SetTexture(imagemap, bumpmap)
        {
            if (!!imagemap)
            {
                var image = new Image();
                image.onload = function(){ this.LoadImage(image, this.Image) };
                image.src = imagemap;
            }
            
            if (!!bumpmap)
            {
                var bump = new Image();
                bump.onload = function(){ this.LoadImage(bump, this.Bump) };
                bump.src = bumpmap;
            }
        }
    },
    LoadImage:
    {
        value: function LoadImage(image, texture)
        {
            
        }
    }
});

