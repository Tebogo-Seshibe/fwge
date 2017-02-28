/**
 * @name Transform
 * @description This object contains all the transformations that 
 *              are to be applied to the parent gameobject.
 * @param       request:    {Object}
 *              > position: {Array}     [nullable]
 *              > rotation: {Array}     [nullable]
 *              > scale:    {Array}     [nullable]
 *              > shear:    {Array}     [nullable]
 */
function Transform(request)
{
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type ="TRANSFORM ";
    
    GameItem.call(this, request);
    
    function setup(item, one)
    {
        if (!item || !(item instanceof Array))
            item = !!one ? [1,1,1] : [0,0,0];

        switch (item.length)
        {
            case 0: item[0] = 0;
            case 1: item[1] = 0;
            case 2: item[2] = 0;
        }

        return FWGE.Game.Maths.Vector3.Create(item);
    }
    
    var _Position   = setup(request.position);
    var _Rotation   = setup(request.rotation);
    var _Scale      = setup(request.scale, true);
    var _Shear      = setup(request.shear);
    
    var _Up         = FWGE.Game.Maths.Vector3.Create(0, 1, 0);
    var _Forward    = FWGE.Game.Maths.Vector3.Create(0, 0, 1);
    var _Right      = FWGE.Game.Maths.Vector3.Create(1, 0, 0);
    
    Object.defineProperties(this,
    {
        /**
         * @property    Position: {Float32Array}
         * @description The current position of the parent of gameobject
         */
        Position:
        {
            get: function getPosition() { return _Position; },
            set: function setPosition()
            {
                if (arguments[0].Type[0] === "VECTOR3")
                    FWGE.Game.Maths.Vector3.Set(_Position, arguments[0]);
            }
        },

        /**
         * @property    Rotation: {Float32Array}
         * @description The current rotation of the parent of gameobject
         */           
        Rotation:
        {
            get: function getRotation() { return _Rotation; },
            set: function setRotation()
            {
                if (arguments[0].Type[0] === "VECTOR3")
                    FWGE.Game.Maths.Vector3.Set(_Rotation, arguments[0]);
            }
        },

        /**
         * @property    Scale: {Float32Array}
         * @description The current scaling of the parent of gameobject
         */
        Scale:
        {
            get: function getScale() { return _Scale; },
            set: function setScale()
            {
                if (arguments[0].Type[0] === "VECTOR3")
                    FWGE.Game.Maths.Vector3.Set(_Scale, arguments[0]);
            }
        },

        /**
         * @property    Shear: {Float32Array}
         * @description The current shearing of the parent of gameobject
         */
        Shear:
        {
            get: function getShear() { return _Shear; },
            set: function setShear()
            {
                if (arguments[0].Type[0] === "VECTOR3")
                    FWGE.Game.Maths.Vector3.Set(_Shear, arguments[0]);
            }
        },

        /**
         * @property    Up: {Float32Array}
         * @description The parent gameobject's up vector
         */
        Up:         { get: function() { return _Up; } },
        
        /**
         * @property    Forward: {Float32Array}
         * @description The parent gameobject's forward vector
         */
        Forward:    { get: function() { return _Forward; } },
        
        /**
         * @property    Right: {Float32Array}
         * @description The parent gameobject's right vector
         */
        Right:      { get: function() { return _Right; } },
    });
    
    this.TransformUpdate();
}
Object.defineProperties(Transform.prototype,
{
    constructor: {value: Transform},

    /**
     * @property    TransformUpdate: void
     * @description Updates the transformations
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

