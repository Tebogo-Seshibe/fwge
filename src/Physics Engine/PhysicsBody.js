/**
 * @constructor PhysicsBody
 * @description This object provides the masic physical properties of an object.
 * @module      FWGE.Physics
 * @param       request:    {Object}
 *              > mass:     {Number}    [nullable]
 *              > lockx:    {Boolean}   [nullable]
 *              > LockY:    {Boolean}   [nullable]
 *              > lockz:    {Boolean}   [nullable]
 */
function PhysicsBody(request)
{
	if (request) request = {};
    request.type = "PHYSICSBODY";
	PhysicsItem.call(this, request);

    var _Mass  = typeof request.mass  === 'number' ?  request.mass  : 1.0; 
    var _LockX = typeof request.lockx === 'boolean'?  request.lockx : false;
    var _LockY = typeof request.locky === 'boolean'?  request.locky : false;
    var _LockZ = typeof request.lockz === 'boolean'?  request.lockz : false;
    
	Object.defineProperties(this,
	{
        /**
         * @property    Mass: {Number}
         *              > get
         *              > set
         * @description The mass of the gameobject this physics body is attached to.
         */
    	Mass:
    	{
    		get: function getMass() { return _Mass; },
    		set: function setMass()
    		{
    			if (typeof arguments[0] === 'number' && arguments[0] >= 0.0)
                    _Mass = arguments[0];
    		},
    	},
        
        /**
         * @property    LockX: {Boolean}
         *              > get
         *              > set
         * @description Determines whether gravity will affect it along the x-axis
         */
        LockX:
        {
            get: function getLockX() { return _LockX; },
            set: function setLockX()
            {
                if (typeof arguments[0] === 'boolean')
                    _LockX = arguments[0];
            },
        },
        
        /**
         * @property    LockY: {Boolean}
         *              > get
         *              > set
         * @description Determines whether gravity will affect it along the y-axis
         */
        LockY:
        {
            get: function getLockY() { return _LockY; },
            set: function setLockY()
            {
                if (typeof arguments[0] === 'boolean')
                    _LockY = arguments[0];
            },
        },
        
        /**
         * @property    LockZ: {Boolean}
         *              > get
         *              > set
         * @description Determines whether gravity will affect it along the z-axis
         */
        LockZ:
        {
            get: function getLockZ() { return _LockZ; },
            set: function setLockZ()
            {
                if (typeof arguments[0] === 'boolean')
                    _LockZ = arguments[0];
            },
        }
    });
}

