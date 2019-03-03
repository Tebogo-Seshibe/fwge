/**
 * @name        SphereCollider
 * @module      FWGE.Physics
 * @description This is a sphere-shaped collision object
 */

window.SphereCollider = (function()
{
    /**
     * @param   {Object}    request
     * @param   {string}    request.name
     * @param   {Array}     request.position
     * @param   {number}    request.radius
     */
    function SphereCollider({name = "Sphere Collider", position = Vector3.Zero, radius = 2} = {})
    {
        Collider.call(this, name, position);

        Object.defineProperties(this,
        {
            /**
             * @property    {Radius}
             * @type        {number}
             */
            Radius:  { value: radius, configurable: false, enumerable: true, writable: true }
        });

        Object.seal(this);
    }

    SphereCollider.prototype = Object.create(null);
    Object.seal(SphereCollider.prototype);

    return SphereCollider;
})();
Object.seal(SphereCollider);
