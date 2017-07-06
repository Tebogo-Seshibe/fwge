/**
 * @name        Time
 * @module      FWGE.Game
 * @description This is the running clock that keeps track of elapsed time
 *              between render frames.
 */

window.Time = (function()
{
    function Time()
    {
        var _now = undefined;
        var _then = undefined;

        Object.defineProperties(this,
        {    
            /**
             * @property    {Delta}
             * @type        {number}
             */
            Delta:
            {
                get: function get()
                {
                    if (_now && _then)
                        return (_now - _then) / 60;
                    return 0;
                },
                configurable: false, enumerable: true
            },

            /**
             * @property    {DeltaTime}
             * @type        {number}
             */
            DeltaTime:
            {
                get: function get()
                {
                    if (_now && _then)
                        return _now - _then;
                    return 0;
                },
                configurable: false, enumerable: true
            },

            /**
             * @property    {Now}
             * @type        {Date}
             */
            Now:
            {
                get: function get()
                {
                    return new Date(Date.now());
                },
                configurable: false, enumerable: true
            },

            /**
             * @property    {TimeUpdate}
             * @return      {undefined}
             */
            Update:
            {
                value: function Update()
                {
                    if (!_now && !_then)
                        _now = _then = Date.now();
                    else
                    {
                        _then = _now;
                        _now = Date.now();
                    }
                },
                configurable: false, enumerable: false, writable: false
            },

            /**
             * @property    {Reset}
             * @return      {undefined}
             */
            Reset:
            {
                value: function Reset()
                {
                    _now = _then = undefined;
                },
                configurable: false, enumerable: false, writable: false
            }
        });
        
        Object.seal(this);
    }

    Time.prototype = Object.create(null);
    Object.seal(Time.prototype);

    return new Time();
})();
Object.seal(Time);
