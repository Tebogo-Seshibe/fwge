/**
 * @name        CameraMode
 * @description ...
 */

window.CameraMode = (function()
{
    function CameraMode()
    {
        Object.defineProperties(this,
        {
            PERSPECTIVE:    { value: 0, configurable: false, enumerable: true, writable: false },
            ORTHOGRAPHIC:   { value: 1, configurable: false, enumerable: true, writable: false },
            '0': { value: 'PERSPECTIVE', configurable: false, enumerable: true, writable: false },
            '1': { value: 'ORTHOGRAPHIC', configurable: false, enumerable: true, writable: false }
        });

        Object.seal(this);
    }

    CameraMode.prototype = Object.create(null);
    Object.seal(CameraMode.prototype);

    return new CameraMode();
})();
Object.seal(CameraMode);