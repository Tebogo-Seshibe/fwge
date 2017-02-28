/**
 * @name        LightItem
 * @description Base definition of an object that illuminates the scene.
 */
function LightItem(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type += "LIGHTITEM ";
    
    GameItem.call(this, request);

    var _Colour = FWGE.Render.Colour.Create(request.colour instanceof Float32Array ? request.colour : new Float32Array(3));
    var _Intensity = typeof request.intensity === 'number' ? request.intensity : 1.0;

    Object.defineProperties(this,
    {
        /**
         * @property    Colour: {Float32Array}
         *              > get
         *              > set
         * @description Descrbies the colour that the light object emits.
         */
        Colour:
        {
            get: function getColour() { return _Colour; },
            set: function setColour()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Game.Maths.Vector3.Set(_Colour, arguments[0]);
            }
        },

        /**
         * @property    Intensity:  {Number}
         *              > get
         *              > set
         * @description Descrbies the intensity at which the light object emits.
         *              This ranges between: [0, 1].
         */
        Intensity:
        {
            get: function getIntensity() { return _Intensity; },
            set: function setIntensity()
            {
                if (typeof arguments[0] === 'number')
                    _Intensity = Math.clamp(arguments[0], 0, 1);
            }
        }
    });
}

