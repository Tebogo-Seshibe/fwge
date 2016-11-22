function Colour()
{
    var $ = this;
    
    Object.defineProperties($,
    {
        Create:
        {
            value: function Create()
            {
                var $ = new Float32Array(3);

                $[0] = typeof arguments[0] === 'number' ? arguments[0] : arguments[0] instanceof Array && typeof arguments[0][0] === 'number' ? arguments[0][0] : 0;
                $[1] = typeof arguments[1] === 'number' ? arguments[1] : arguments[0] instanceof Array && typeof arguments[0][1] === 'number' ? arguments[0][1] : 0;
                $[2] = typeof arguments[2] === 'number' ? arguments[2] : arguments[0] instanceof Array && typeof arguments[0][2] === 'number' ? arguments[0][2] : 0;
                
                Object.defineProperties($,
                {
                	Type: { value: "COLOUR" },
                    R:
                    {
                        get: function getR(){ return $[0]; },
                        set: function setR()
                        {
                            if (typeof arguments[0] === 'number')
                                $[0] = Math.clamp(arguments[0], 0, 1);
                        },
                    },
                    G:
                    {
                        get: function getG(){ return $[1]; },
                        set: function setG()
                        {
                            if (typeof arguments[1] === 'number')
                                $[1] = Math.clamp(arguments[0], 0, 1);
                        },
                    },
                    B:
                    {
                        get: function getB(){ return $[2]; },
                        set: function setB()
                        {
                            if (typeof arguments[0] === 'number')
                                $[2] = Math.clamp(arguments[0], 0, 1);
                        },
                    }
                });
                
                return $;
            }
        }
    });
}

