/**
 * @name        BoxCollider
 * @module      FWGE.Physics
 * @description This is a cube-shaped collision object
 */

window.BoxCollider = (function()
{
    /**
     * @param   {Object}  request
     * @param   {string}  request.name
     * @param   {Array}   request.position
     * @param   {number}  request.height
     * @param   {number}  request.width
     * @param   {number}  request.breadth
     */
    function BoxCollider({name = 'Box Collider', position = Vector3.Zero, height = 2, width = 2, breadth = 2} = {})
    {
        Collider.call(this, name, position);
        
        Object.defineProperties(this,
        {
            /**
             * @property    {Height}
             * @type        {number}
             */
            Height: { value: height, configurable: false, enumerable: true, writable: true },
            
            /**
             * @property    {Width}
             * @type        {number}
             */
            Width: { value: width, configurable: false, enumerable: true, writable: true },
            
            /**
             * @property    {Breadth}
             * @type        {number}
             */
            Breadth: { value: breadth, configurable: false, enumerable: true, writable: true }
        });    

        Object.seal(this);
    }

    BoxCollider.prototype = Object.create(null);
    Object.seal(BoxCollider.prototype);

    return BoxCollider;
})();
Object.seal(BoxCollider);
