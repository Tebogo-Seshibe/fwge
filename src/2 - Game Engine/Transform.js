/**
 * @name        Transform
 * @module      FWGE.Game
 * @description This object contains all the transformations that 
 *              are to be applied to the parent gameobject.
 */

window.Transform = (function()
{
    /**
     * @param   {Object}    request
     * @param   {Array}     request.position
     * @param   {Array}     request.rotation
     * @param   {Array}     request.scale
     * @param   {Array}     request.shear
     */
    function Transform({position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], shear = [0, 0, 0]} = {})
    {
        Object.defineProperties(this,
        {        
            /**
             * @property    {Position}
             * @type        {Vector3}
             */
            Position: { value: new Vector3(position[0], position[1], position[2]), configurable: false, enumerable: true, writable: false },

            /**
             * @property    {Rotation}
             * @type        {Vector3}
             */           
            Rotation: { value: new Vector3(rotation[0], rotation[1], rotation[2]), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Scale}
             * @type        {Vector3}
             */
            Scale: { value: new Vector3(scale[0], scale[1], scale[2]), configurable: false, enumerable: true, writable: false },

            /**
             * @property    {Shear}
             * @type        {Vector3}
             */
            Shear: { value: new Vector3(shear[0], shear[1], shear[2]), configurable: false, enumerable: true, writable: false }
        });

        Object.seal(this);
    }

    Transform.prototype = Object.create(null);
    Object.defineProperties(Transform.prototype,
    {
        /**
         * @property    {UP}
         * @type        {Vector3}
         */
        UP: { value: new Vector3(0, 1, 0), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {FORWARD}
         * @type        {Vector3}
         */
        FORWARD: { value: new Vector3(0, 0, 1), configurable: false, enumerable: true, writable: false },
        
        /**
         * @property    {RIGHT}
         * @type        {Vector3}
         */
        RIGHT: { value: new Vector3(1, 0, 0), configurable: false, enumerable: true, writable: false },

    });
    Object.seal(Transform.prototype);

    return Transform;
})();
Object.seal(Transform);
