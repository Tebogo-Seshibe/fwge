/*!
 *  @param  {Object: request}
 *    @param  {Array: position}
 *    @param  {Array: rotation}
 *    @param  {Array: scale}
 *    @param  {Array: shear}
 */
function Transform(request)
{
    var $ = this;
    if (!request) request = {};
    GameItem.call($, request.gameobject, "TRANSFORM");
    
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

        return item;
    }
    
    var _Position = FWGE.Maths.Vector3.Create(setup(request.position));
    var _Rotation = FWGE.Maths.Vector3.Create(setup(request.rotation));
    var _Scale = FWGE.Maths.Vector3.Create(setup(request.scale));
    var _Shear = FWGE.Maths.Vector3.Create(setup(request.shear));
    
    var _Up = FWGE.Maths.Vector3.Create(0, 1, 0);
    var _Forward = FWGE.Maths.Vector3.Create(0, 0, 1);
    var _Right = FWGE.Maths.Vector3.Create(1, 0, 0);
    
    Object.defineProperties($,
    {
        Position:
        {
            get: function getPosition() { return _Position; },
            set: function setPosition()
            {
                if (arguments[0].Type === "VECTOR3")
                    FWGE.Maths.Vector3.Set(_Position, arguments[0]);
            }
        },            
        Rotation:
        {
            get: function getRotation() { return _Rotation; },
            set: function setRotation()
            {
                if (arguments[0].Type === "VECTOR3")
                    FWGE.Maths.Vector3.Set(_Rotation, arguments[0]);
            }
        },
        Scale:
        {
            get: function getScale() { return _Scale; },
            set: function setScale()
            {
                if (arguments[0].Type === "VECTOR3")
                    FWGE.Maths.Vector3.Set(_Scale, arguments[0]);
            }
        },            
        Shear:
        {
            get: function getShear() { return _Shear; },
            set: function setShear()
            {
                if (arguments[0].Type === "VECTOR3")
                    FWGE.Maths.Vector3.Set(_Shear, arguments[0]);
            }
        },
        Up:         { get: function() { return _Up; } },
        Forward:    { get: function() { return _Forward; } },
        Right:      { get: function() { return _Right; } },
        
        TransformUpdate:
        {
            value: function TransformUpdate()
            {
                // TODO
                // UPDATE: UP, FORWARD, AND RIGHT
            }
        }
    });
    
    this.TransformUpdate();
}

