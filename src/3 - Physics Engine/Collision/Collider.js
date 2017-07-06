/**
 * @name        Collider
 * @module      FWGE.Physics
 * @description This is the base object for collision objects
 */

let Collider = (function()
{
    /**
     * @param   {string}        name
     * @param   {Vector3}       position
     * @param   {PhysicsItem}   physicsitem
     */
    function Collider(name = "Collider", position = Vector3.Zero, physicsitem = undefined)
    {
        Item.call(this, name);   
        
        Object.defineProperties(this,
        {
            /**
             * @property    {Position}
             * @type        {Vector3}
             */
            Position: { value: position, configurable: false, enumerable: true, writable: false },

            /**
             * @property    {PhysicsItem}
             * @type        {PhysicsItem}
             */
            PhysicsItem: { value: physicsitem, configurable: false, enumerable: true, writable: true }
        });
    }

    Collider.prototype = Object.create(null);
    Object.seal(Collider.prototype);

    return Collider;
})();
Object.seal(Collider);
