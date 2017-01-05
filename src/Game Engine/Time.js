/**
 * @constructor Time
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
        Delta:      { get: function(){ return (_Now - _Then) / 60; } },
        DeltaTime:  { get: function(){ return _Now - _Then; } },
        Now:        { get: function(){ return new Date(Date.now()); } },
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

