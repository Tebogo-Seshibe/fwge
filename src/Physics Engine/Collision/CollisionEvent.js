/**
 * @name        CollisionEvent
 * @module      FWGE.Physics
 * @description A collision event object
 */

let CollisionEvent = (function()
{
    /**
     * @param   {GameObject}    current
     * @param   {GameObject}    other
     * @param   {string}        type
     */
    function CollisionEvent(current, other, type)
    {
        Object.defineProperties(this,
        {
            /**
             * @property    {Current}
             * @type        {GameObject}
             */
            Current: { value: current, configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Other}
             * @type        {GameObject}
             */
            Other: { value: other, configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Type}
             * @type        {string}
             */
            Type: { value: type, configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {TimeStamp}
             * @type        {string}
             */
            TimeStamp: { value: new Date(Date.now()).toDateString(), configurable: false, enumerable: true, writable: false }
        });

        Object.seal(this);
    }

    CollisionEvent.prototype = Object.create(null);
    Object.seal(CollisionEvent.prototype);

    return CollisionEvent;
})();
Object.seal(CollisionEvent);
