function Vector2()
{
    var $ = this;
    
    Object.defineProperties($,
    {
        Create:
        {
            value: function Create()
            {
                var $ = new Float32Array(2);
                
                $[0] = typeof arguments[0] === 'number' ? arguments[0] : arguments[0] instanceof Array && typeof arguments[0][0] === 'number' ? arguments[0][0] : 0;
                $[1] = typeof arguments[1] === 'number' ? arguments[1] : arguments[0] instanceof Array && typeof arguments[0][1] === 'number' ? arguments[0][1] : 0;
                
                Object.defineProperties($,
                {
                    Type: { value: "VECTOR2" },
                    X:
                    {
                        get: function getX(){ return $[0]; },
                        set: function setX()
                        {
                            if (typeof arguments[0] === 'number')
                                $[0] = arguments[0];
                        }
                    },
                    Y:
                    {
                        get: function getY(){ return $[1]; },
                        set: function setY()
                        {
                            if (typeof arguments[0] === 'number')
                                $[1] = arguments[0];
                        }
                    }
                });
                
                return $;
            }
        },
        Set:
        {
            value: function Set()
            {
                var $, x, y;

                $ = arguments[0];
                if (arguments[1] instanceof Float32Array && arguments[0].length === 2)
                {
                    x = arguments[1][0];
                    y = arguments[1][1];
                }
                else
                {
                    x = arguments[1];
                    y = arguments[2];
                }
                
                if ($ instanceof Float32Array && $.length === 2 && typeof x === 'number' && typeof y === 'number' && typeof z === 'number')
                {
                    $[0] = x;
                    $[1] = y;

                    return $;
                }
            }
        },
        Length:
        {
            value: function Length()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 2)
                    return Math.sqrt(arguments[0][0] * arguments[0][0] + arguments[0][1] * arguments[0][1]);
            }
        },
        Sum:
        {
            value: function Sum()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 2 && arguments[1] instanceof Float32Array && arguments[1].length === 2)
                    return this.Set(arguments[0], arguments[0][0] + arguments[1][0], arguments[0][1] + arguments[1][1]);
            }
        },
        Diff:
        {
            value: function Diff()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 2 && arguments[1] instanceof Float32Array && arguments[1].length === 2)
                    return this.Create(arguments[1][0] - arguments[0][0], arguments[1][1] - arguments[0][1]);
            }
        },
        Mult:
        {
            value: function Mult()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 2)
                {
                    if (arguments[1] instanceof Float32Array && arguments[1].length === 2)
                        return this.Set(arguments[0], arguments[0][0] * arguments[1][0], arguments[0][1] * arguments[1][1]);
                    else if (typeof arguments[1] === 'number')
                        return this.Set(arguments[0], arguments[0][0] * arguments[1], arguments[0][1] * arguments[1]);
                }
            }
        },
        Dot:
        {
            value: function Dot()
            {
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 2 && arguments[1] instanceof Float32Array && arguments[1].length === 2)
                        return arguments[0][0] * arguments[1][0] + arguments[0][1] * arguments[1][1];
            }
        },
        Unit:
        {
            value: function Unit()
            {
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 2)
                {
                    var length = this.Length(arguments[0]);
                    if (length !== 0)
                        return this.Mult(arguments[0], 1 / length);
                }
            }
        },
        Cross:
        {
            value: function Cross()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 2 && arguments[1] instanceof Float32Array && arguments[1].length === 2)
                    return this.Create(arguments[0][1] * arguments[1][2] + arguments[0][2] * arguments[1][1], arguments[0][2] * arguments[1][0] - arguments[0][0] * arguments[1][2], arguments[0][0] * arguments[1][1] + arguments[0][1] * arguments[1][0]);
            }
        }
    });
}

