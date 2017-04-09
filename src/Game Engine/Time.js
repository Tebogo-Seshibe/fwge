/**
 * @name        Time
 * @description This is the running clock that keeps track of elapsed time
 *              between render frames.
 * @module      FWGE.Game
 */
function Time()
{
    var _Now  = undefined,
        _Then = undefined;
    
    Object.defineProperties(this,
    {
        /**
         * @property    Delta: {Number} [read]
         * @description Some description
         */
        Delta:      { get: function(){ return (_Now - _Then) / 60; } },

        /**
         * @property    DeltaTime: {Number} [read]
         * @description Some description
         */
        DeltaTime:  { get: function(){ return _Now - _Then; } },

        /**
         * @property    Now: {Number} [read]
         * @description Some description
         */
        Now:        { get: function(){ return new Date(Date.now()); } },

        /**
         * @property    TimeUpdate: {undefined}
         * @description Some description
         */
        TimeUpdate:        
        {
            value: function TimeUpdate()
            {
                if (_Now === undefined && _Then === undefined)
                    _Now = _Then = Date.now();
                else
                {
                    _Then = _Now;
                    _Now = Date.now();
                }
            }
        }
    });
}

