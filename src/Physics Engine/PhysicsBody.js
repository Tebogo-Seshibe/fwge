/**
 * @name        PhysicsBody
 * @module      FWGE.Physics
 * @description This object provides the masic physical properties of an object.
 */

window.PhysicsBody = (function()
{
    /**
     * @param    {Object}   requext
     * @param    {string}   requext.name
     * @param    {number}   requext.mass
     * @param    {boolean}  requext.lockx
     * @param    {boolean}  requext.locky
     * @param    {boolean}  requext.lockz
     */
    function PhysicsBody({name = 'Physics Body', mass = 1, lockx = true, locky = true, lockz = true} = {})
    {
        Item.call(this, name);

        var _Grounded = true;
        var _Velocity = 0;
            
        Object.defineProperties(this,
        {
            /**
             * @property    {Mass}
             * @type        {Number}
             */
            Mass: { value: mass, configurable: false, enumerable: true, writable: true },

            /**
             * @property    {LockX}
             * @type        {Boolean}
             */
            LockX: { value: lockx, configurable: false, enumerable: true, writable: true },

            /**
             * @property    {LockY} 
             * @type        {Boolean}
             */
            LockY: { value: locky, configurable: false, enumerable: true, writable: true },

            /**
             * @property    {LockZ}
             * @type        {Boolean}
             */
            LockZ: { value: lockz, configurable: false, enumerable: true, writable: true },

            /**
             * @property    {Grounded}
             * @type        {Boolean}
             */
            Grounded: { get: function get() { return _Grounded; } },
            
            /**
             * @property    {Velocity}
             * @type        {Number}
             */
            Velocity: { get: function get() { return _Velocity; } }    
        });

        Object.seal(this);
    }

    PhysicsBody.prototype = Object.create(null);
    Object.seal(PhysicsBody.prototype);

    return PhysicsBody;
})();
Object.seal(PhysicsBody);
