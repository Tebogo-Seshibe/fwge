function Transform(request)
{
    var $ = this;
    
    if (!request) request = {};

    console.log(FWGE);
    
    if (!request.position) request.position = FWGE.Maths.Vector3.Create();
    if (!(request.position instanceof Float32Array) || request.length !== 3) request.position = FWGE.Maths.Vector3.Create(request.position);
    if (!request.rotation) request.rotation = FWGE.Maths.Vector3.Create();
    if (!(request.rotation instanceof Float32Array) || request.length !== 3) request.rotation = FWGE.Maths.Vector3.Create(request.rotation);
    if (!request.scale) request.scale = FWGE.Maths.Vector3.Create();
    if (!(request.scale instanceof Float32Array) || request.length !== 3) request.scale = FWGE.Maths.Vector3.Create(1.0,1.0,1.0);
    if (!request.shear) request.shear = FWGE.Maths.Vector3.Create();
    if (!(request.shear instanceof Float32Array) || request.length !== 3) request.shear = FWGE.Maths.Vector3.Create(request.shear);
    
    GameItem.call($, request.gameobject, "TRANSFORM");
    
    var _Position = request.position;
    var _Rotation = request.rotation;
    var _Scale = request.scale;
    var _Shear = request.shear;
    
    var _Up = FWGE.Maths.Vector3.Create(0, 1, 0);
    var _Forward = FWGE.Maths.Vector3.Create(0, 0, 1);
    var _Right = FWGE.Maths.Vector3.Create(1, 0, 0);
    
    Object.defineProperties($,
    {
        Position:
        {
            get: function getPosition(){ return _Position; },
            set: function setPosition()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Maths.Vector3.Set(_Position, arguments[0]);
            }
        },            
        Rotation:
        {
            get: function getRotation(){ return _Rotation; },
            set: function setRotation()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Maths.Vector3.Set(_Rotation, arguments[0]);
            }
        },
        Scale:
        {
            get: function getScale(){ return _Scale; },
            set: function setScale()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Maths.Vector3.Set(_Scale, arguments[0]);
            }
        },            
        Shear:
        {
            get: function getShear(){ return _Shear; },
            set: function setShear()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 3)
                    FWGE.Maths.Vector3.Set(_Shear, arguments[0]);
            }
        },
        Up:         { get: function(){ return _Up; } },
        Forward:    { get: function(){ return _Forward; } },
        Right:      { get: function(){ return _Right; } },
        
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

