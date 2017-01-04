/*!
 *  @constructor    Transform
 *  @description    Hello
 *  @param          {Object: request}
 *                  {Array: position}
 *                  {Array: rotation}
 *                  {Array: scale}
 *                  {Array: shear}
 */
function Transform(request)
{
    if (!request) request = {};
    request.type ="TRANSFORM";
    GameItem.call(this, request);
    
    function setup(item)
    {
        if (!item || !(item instanceof Array)) item = [0,0,0];
        if (item.length < 3)
        {
            switch (item.length)
            {
                case 0: item.position[0] = 0;
                case 1: item.position[1] = 0;
                case 2: item.position[2] = 0;
            }
        }

        return FWGE.Game.Maths.Vector3.Create(item);
    }
    
    var $           = this;
    var _Position   = setup(request.position);
    var _Rotation   = setup(request.rotation);
    var _Scale      = setup(request.scale);
    var _Shear      = setup(request.shear);
    
    var _Up         = FWGE.Game.Maths.Vector3.Create(0, 1, 0);
    var _Forward    = FWGE.Game.Maths.Vector3.Create(0, 0, 1);
    var _Right      = FWGE.Game.Maths.Vector3.Create(1, 0, 0);
    
    Object.defineProperties($,
    {
        /*!
         *  @property       {Float32Array: Position}
         *  @description    Hello
         */
        Position:
        {
            get: function getPosition() { return _Position; },
            set: function setPosition()
            {
                if (arguments[0].Type === "VECTOR3")
                    FWGE.Game.Maths.Vector3.Set(_Position, arguments[0]);
            }
        },

        /*!
         *  @property       {Float32Array: Rotation}
         *  @description    Hello
         */           
        Rotation:
        {
            get: function getRotation() { return _Rotation; },
            set: function setRotation()
            {
                if (arguments[0].Type === "VECTOR3")
                    FWGE.Game.Maths.Vector3.Set(_Rotation, arguments[0]);
            }
        },

        /*!
         *  @property       {Float32Array: Scale}
         *  @description    Hello
         */
        Scale:
        {
            get: function getScale() { return _Scale; },
            set: function setScale()
            {
                if (arguments[0].Type === "VECTOR3")
                    FWGE.Game.Maths.Vector3.Set(_Scale, arguments[0]);
            }
        },

        /*!
         *  @property       {Float32Array: Shear}
         *  @description    Hello
         */
        Shear:
        {
            get: function getShear() { return _Shear; },
            set: function setShear()
            {
                if (arguments[0].Type === "VECTOR3")
                    FWGE.Game.Maths.Vector3.Set(_Shear, arguments[0]);
            }
        },

        /*!
         *  @property       {Float32Array: Up}
         *  @description    Hello
         */
        Up:         { get: function() { return _Up; } },
        
        /*!
         *  @property       {Float32Array: Forward}
         *  @description    Hello
         */
        Forward:    { get: function() { return _Forward; } },
        
        /*!
         *  @property       {Float32Array: Right}
         *  @description    Hello
         */
        Right:      { get: function() { return _Right; } },
    });
    
    $.TransformUpdate();
}
Object.defineProperties(Transform.prototype,
{
    constructor: {value: Transform},

    /*!
     *  @property       {Float32Array: Position}
     *  @description    Hello
     */
    TransformUpdate:
    {
        value: function TransformUpdate()
        {
            // TODO
            // UPDATE: UP, FORWARD, AND RIGHT
        }
    }
});
