/*!
 * @constructor DirectionalLight
 * @description Definition of a light that shines in a given direction.
 * @module      FWGE.Game.Light
 * @param       {Object: request} [nullable]
 *              > {Float32Array: colour}     [nullable]
 *              > {Number: intensity}        [nullable]
 *              > {Float32Array: direction}  [nullable]
 */
function DirectionalLight(request)
{
    if (!request) request = {};
    request.type = "DIRECTIONALLIGHT";
    LightObject.call(this, request);

    var _Direction = (request.direction instanceof Float32Array && request.direction.length === 3) ? request.direction : new Float32Array(3);

    Object.defineProperties(this,
    {
        /*!
         * @property    {Float32Array: Direction}
         *              > get
         *              > set
         * @description Returns the direction the light is pointing in.
         */
        Direction:
        {
            get: function getDirection() { return _Direction; },
            set: function setDirection(direction)
            {
                if (direction instanceof Float32Array && direction.length === 3)
                    FWGE.Game.Maths.Vector3.Set(_Direction, direction);
            }
        },

        /*!
         * @function    {undefined: DirectionalUpdate}
         * @description Updates the lighting.
         */
        DirectionalUpdate:
        {
            value: function DirectionalUpdate()
            {
                // TODO
                // Update the direction based on the orientation of the containing object.
            }
        }
    });
}

