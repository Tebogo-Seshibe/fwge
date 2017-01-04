function PhysicsBody(request)
{
	if (request) request = {};
    request.type = "RIGIDBODY";
	PhysicsItem.call(this, request);

    var _Mass  = typeof request.mass  === 'number' ?  request.mass  : 1.0; 
    var _LockX = typeof request.lockx === 'boolean'?  request.lockx : false;
    var _LockY = typeof request.locky === 'boolean'?  request.locky : false;
    var _LockZ = typeof request.lockz === 'boolean'?  request.lockz : false;
    
	Object.defineProperties(this,
	{
    	Mass:
    	{
    		get: function getMass() { return _Mass; },
    		set: function setMass(mass)
    		{
    			if (typeof mass === 'number' && mass >= 0.0)
    				_Mass = mass;
    		},
    	},
        LockX:
        {
            get: function getLockX() { return _LockX; },
            set: function setLockX(lockx)
            {
                if (typeof lockx === 'boolean')
                    _LockX = lockx;
            },
        },
        LockY:
        {
            get: function getLockY() { return _LockY; },
            set: function setLockY(locky)
            {
                if (typeof locky === 'boolean')
                    _LockY = locky;
            },
        },
        LockZ:
        {
            get: function getLockZ() { return _LockZ; },
            set: function setLockZ(lockz)
            {
                if (typeof lockz === 'boolean')
                    _LockZ = lockz;
            },
        }
    });
}