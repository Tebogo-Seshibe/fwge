/*!
 *  @constructor    LightItem
 *  @description    Base definition of an object that illuminates the scene.
 *  @param          {Object: request} [nullable]
 *                  > {Float32Array: colour}
 *                  > {Number: intensity}
 */
function LightItem(request)
{
    if (!request) request = {};
    GameItem.call(this, request);

    var _Colour = request.colour instanceof Float32Array ? request.colour : new Float32Array(3);
    var _Intensity = typeof request.intensity === 'number' ? request.intensity : 1.0;

    Object.defineProperties(this,
    {
        /*!
            * @property    {Float32Array: Colour}
            *              > get
            *              > set
            * @description Descrbies the colour that the light object emits. 
            */
        Colour:
        {
            get: function getColour() { return _Colour; },
            set: function setColour(colour)
            {
                if (colour instanceof Float32Array && colour.length === 3)
                    FWGE.Game.Maths.Vector3.Set(_Colour, colour);
            }
        },

        /*!
         * @property    {Number: Intensity}
         *              > get
         *              > set
         * @description Descrbies the intensity at which the light object emits. 
         */
        Intensity:
        {
            get: function getIntensity() { return _Intensity; },
            set: function setIntensity(colour)
            {
                if (typeof colour === 'number')
                    _Intensity = Math.clamp(0, 255, colour);
            }
        }
    });
}

