/**
 * @name        Viewer
 * @module      FWGE.Game.Camera
 * @description This represnent an eye within the scene. Rendeering to the screen is
 *              based on what any viewer in the scene "sees"."
 */

window.Viewer = (function()
{
    /**
     * @param {Object}  request 
     * @param {Array}   request.position
     * @param {Array}   request.target
     */
    function Viewer({position = Vector3.Zero.Buffer, target = Vector3.Zero.Buffer} = {})
    {
        var _Direction = Vector3.Zero;
        var _Up = Vector3.Zero;
        var _Right = Vector3.Zero;
            
        Object.defineProperties(this,
        {
            /**
             * @property    {Position}
             * @type        {Vector3}
             */
            Position: { value: new Vector3(position), configurable: false, enumerable: true, writable: false },

            /**
             * @property    {Target}
             * @type        {Vector3}
             */
            Target: { value: new Vector3(target), configurable: false, enumerable: true, writable: false },

            /**
             * @property    {Matrix}
             * @type        {Matrix4}
             */
            Matrix: { value: Matrix4.Identity, configurable: false, enumerable: false, writable: false },

            /**
             * @function    Update
             * @return      {undefined}
             */
            Update:
            {
                value: function Update()
                {
                    _Direction.Set(_Position).Diff(this.Target).Unit();
                    _Right.Set(_Up).Cross(_Direction).Unit();
                    _Up.Set(_Direction).Cross(_Right).Unit();

                    this.Matrix.Set(
                    [
                        _Right.X,       _Right.Y,       _Right.Z,       0,
                        _Up.X,          _Up.Y,          _Up.Z,          0,
                        _Direction.X,   _Direction.Y,   _Direction.Z,   0,
                        0,                  0,                  0,                  1
                    ]).Mult(
                    [
                        1,                  0,                  0,                  0,
                        0,                  1,                  0,                  0,
                        0,                  0,                  1,                  0,
                        _Position.X,    _Position.Y,    this.Position.Z,    1
                    ]);
                },
                configurable: false, enumerable: false, writable: false
            }
        });
        
        Object.seal(this);
    }

    Viewer.prototype = Object.create(null);
    Object.seal(Viewer.prototype);

    return Viewer;
})();
Object.seal(Viewer);
