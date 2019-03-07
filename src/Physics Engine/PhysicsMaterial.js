/**
 * @name        PhysicsMaterial
 * @module      FWGE.Game
 * @description Some words of encouragement
 */

window.PhysicsMaterial = (function()
{
    /**
     * @param   {Object} request
     * @param   {string} request.name
     */
    function PhysicsMaterial({name = 'Physics Material'} = {})
    {
        Item.call(this, name);

        // TODO

        Object.seal(this);
    }

    PhysicsMaterial.prototype = Object.create(null);
    Object.seal(PhysicsMaterial.prototype);

    return PhysicsMaterial;
})();
Object.seal(PhysicsMaterial);
