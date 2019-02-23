/**
 * @name        PhysicsItem
 * @module      FWGE.Physics
 * @description Some random container
 */

window.PhysicsItem = (function()
{
    /**
     * @param   {Object}            request
     * @param   {string}            request.name
     * @param   {GameObject}        request.parent
     * @param   {PhysicsBody}       request.body
     * @param   {Collider}          request.collider
     * @param   {PhysicsMaterial}   request.material
     */
    function PhysicsItem({name = "Physics Item", parent = undefined, body = undefined, collider = undefined, material = undefined} = {})
    {
        GameItem.call(this, name, parent);

        Object.defineProperties(this,
        {
            /**
             * @property    {Collider}
             * @type        {Collider}
             */
            Collider: { value: collider, configurable: false, enumerable: true, writable: true },

            /**
             * @property    {Material}
             * @type        {PhysicsMaterial}
             */
            Material: { value: material, configurable: false, enumerable: true, writable: true },
            
            /**
             * @property    {Body}
             * @type        {PhysicsBody}
             */
            Body: { value: new PhysicsBody(body), configurable: false, enumerable: true, writable: true },
        });

        Object.seal(this);
    }

    PhysicsItem.prototype = Object.create(null);
    Object.seal(PhysicsItem.prototype);

    return PhysicsItem;
})();
Object.seal(PhysicsItem);
