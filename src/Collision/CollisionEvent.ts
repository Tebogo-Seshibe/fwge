export default class CollisionEvent extends FWGEEvent

    constructor()
    {
        super()
    }
}
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
