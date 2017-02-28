/**
 * @name Matrix3
 * @description This library contains the methods for 3x3 matrix operations.
 *              3x3 matrices are represented as a Float32Array of length 9.
 * @module      FWGE.Game.Maths 
 */
function Matrix3()
{    
    Object.defineProperties(this,
    {
        /**
         * @function    Create: {Float32Array}
         * @description Creates an new Float32Array with the Type set to "MATRIX3".
         *              It also has the appropriate value indexers:
         *              M11, M12, M13,
         *              M21, M22, M23,
         *              M31, M32, M33.
         * @param       {Float32Array}  [nullable, override: 1]
         * @param       {Number}        [nullable, override: 2]
         * @param       {Number}        [nullable, override: 2]
         * @param       {Number}        [nullable, override: 2]
         * @param       {Number}        [nullable, override: 2]
         * @param       {Number}        [nullable, override: 2]
         * @param       {Number}        [nullable, override: 2]
         * @param       {Number}        [nullable, override: 2]
         * @param       {Number}        [nullable, override: 2]
         * @param       {Number}        [nullable, override: 2]
         */
        Create:
        {
            value: function Create()
            {                    
                var $ = new Float32Array(9);
                
                $[0] = typeof arguments[0] === 'number' ? arguments[0] : arguments[0] instanceof Array && typeof arguments[0][0] === 'number' ? arguments[0][0] : 0;
                $[1] = typeof arguments[1] === 'number' ? arguments[1] : arguments[0] instanceof Array && typeof arguments[0][1] === 'number' ? arguments[0][1] : 0;
                $[2] = typeof arguments[2] === 'number' ? arguments[2] : arguments[0] instanceof Array && typeof arguments[0][2] === 'number' ? arguments[0][2] : 0;
                $[3] = typeof arguments[3] === 'number' ? arguments[3] : arguments[0] instanceof Array && typeof arguments[0][3] === 'number' ? arguments[0][3] : 0;
                $[4] = typeof arguments[4] === 'number' ? arguments[4] : arguments[0] instanceof Array && typeof arguments[0][4] === 'number' ? arguments[0][4] : 0;
                $[5] = typeof arguments[5] === 'number' ? arguments[5] : arguments[0] instanceof Array && typeof arguments[0][5] === 'number' ? arguments[0][5] : 0;
                $[6] = typeof arguments[6] === 'number' ? arguments[6] : arguments[0] instanceof Array && typeof arguments[0][6] === 'number' ? arguments[0][6] : 0;
                $[7] = typeof arguments[7] === 'number' ? arguments[7] : arguments[0] instanceof Array && typeof arguments[0][7] === 'number' ? arguments[0][7] : 0;
                $[8] = typeof arguments[8] === 'number' ? arguments[8] : arguments[0] instanceof Array && typeof arguments[0][8] === 'number' ? arguments[0][8] : 0;
                
                Object.defineProperties($,
                {
                    Type: { value: "MATRIX3" },
                    M11:
                    {
                        get: function getM11(){ return $[0]; },
                        set: function setM11(){ if (typeof arguments[0] === 'number') $[0] = arguments[0]; }
                    },
                    M12: 
                    {
                        get: function getM12(){ return $[1]; },
                        set: function setM12(){ if (typeof arguments[0] === 'number') $[1] = arguments[0]; }
                    },
                    M13:
                    {
                        get: function getM13(){ return $[2]; },
                        set: function setM13(){ if (typeof arguments[0] === 'number') $[2] = arguments[0]; }
                    },
                    M21: 
                    {
                        get: function getM21(){ return $[3]; },
                        set: function setM21(){ if (typeof arguments[0] === 'number') $[3] = arguments[0]; }
                    },
                    M22:
                    {
                        get: function getM22(){ return $[4]; },
                        set: function setM22(){ if (typeof arguments[0] === 'number') $[4] = arguments[0]; }
                    },
                    M23: 
                    {
                        get: function getM23(){ return $[5]; },
                        set: function setM23(){ if (typeof arguments[0] === 'number') $[5] = arguments[0]; }
                    },
                    M31:
                    {
                        get: function getM31(){ return $[6]; },
                        set: function setM31(){ if (typeof arguments[0] === 'number') $[6] = arguments[0]; }
                    },
                    M32: 
                    {
                        get: function getM32(){ return $[7]; },
                        set: function setM32(){ if (typeof arguments[0] === 'number') $[7] = arguments[0]; }
                    },
                    M33: 
                    {
                        get: function getM33(){ return $[8]; },
                        set: function setM33(){ if (typeof arguments[0] === 'number') $[8] = arguments[0]; }
                    }
                });
                
                return $;
            }
        },
        
        /**
         * @function    Set: {Float32Array}
         * @description Assigns new to the a given Float32Array.
         * @param       {Float32Array}  [override: 1]
         * @param       {Float32Array}  [override: 1]
         * @param       {Float32Array}  [override: 2]
         * @param       {Number}        [override: 2]
         * @param       {Number}        [override: 2]
         * @param       {Number}        [override: 2]
         * @param       {Number}        [override: 2]
         * @param       {Number}        [override: 2]
         * @param       {Number}        [override: 2]
         * @param       {Number}        [override: 2]
         * @param       {Number}        [override: 2]
         * @param       {Number}        [override: 2]
         */
        Set:
        {
            value: function Set()
            {         
                var $, a, b, c, d, e, f, g, h, i;

                $ = arguments[0];
                if (arguments[1] instanceof Float32Array && arguments[0].length === 9)
                {
                    a = arguments[1][0]; b = arguments[1][1]; c = arguments[1][2];
                    d = arguments[1][3]; e = arguments[1][4]; f = arguments[1][5];
                    g = arguments[1][6]; h = arguments[1][7]; i = arguments[1][8];
                }
                else
                {
                    a = arguments[1]; b = arguments[2]; c = arguments[3];
                    d = arguments[4]; e = arguments[5]; f = arguments[6];
                    g = arguments[7]; h = arguments[8]; i = arguments[9];
                }
                
                if ($ instanceof Float32Array && arguments[0].length === 9 && typeof a === 'number' && typeof b === 'number' && typeof c === 'number' && typeof d === 'number' && typeof e === 'number' && typeof f === 'number' && typeof g === 'number' && typeof h === 'number' && typeof i === 'number')
                {
                    $[0] = a; $[1] = b; $[2] = c;                        
                    $[3] = d; $[4] = e; $[5] = f;                        
                    $[6] = g; $[7] = h; $[8] = i;

                    return $;
                }                  
            }
        },
        
        /**
         * @function    Transpose: {Float32Array}
         * @description Transposes a matrix.
         * @param       {Float32Array}
         */
        Transpose:
        {
            value: function Transpose()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9)
                    return this.Set(arguments[0],
                                    arguments[0][0], arguments[0][3], arguments[0][6],
                                    arguments[0][1], arguments[0][4], arguments[0][7],
                                    arguments[0][2], arguments[0][5], arguments[0][8]);
            }
        },
        
        /**
         * @function    Identity: {Float32Array}
         * @description If given a Float32Array, it resets it to an identity matrix.
         *              If not, it simply returns a new identity matrix.
         * @param       {Float32Array}
         */
        Identity:
        {
            value: function Identiy()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9)
                    return this.Set(arguments[0],
                                    1, 0, 0,
                                    0, 1, 0,
                                    0, 0, 1);
                else
                    return this.Create(1, 0, 0,
                                       0, 1, 0,
                                       0, 0, 1);
            }
        },
        
        /**
         * @function    Determinant: {Number}
         * @description Calculates the determinant of a given Float32Array.
         * @param       {Float32Array}
         */
        Determinant:
        {
            value: function Determinant()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9)
                    return arguments[0][0] * (arguments[0][4] * arguments[0][8] - arguments[0][5] * arguments[0][7]) -
                            arguments[0][1] * (arguments[0][3] * arguments[0][8] - arguments[0][5] * arguments[0][6]) + 
                            arguments[0][2] * (arguments[0][3] * arguments[0][7] - arguments[0][4] * arguments[0][6]);
            }
        },
        
        /**
         * @function    Inverse: {Float32Array}
         * @description Inverts a given Float32Array when possible i.e. the determinant
         *              is not 0.
         * @param       {Float32Array}
         */
        Inverse:
        {
            value: function Inverse()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9)
                {
                    var det = this.Determinant(arguments[0]);
                    if (det !== 0)
                        return this.Set(arguments[0],
                                         (arguments[0][4] * arguments[0][8] - arguments[0][7] * arguments[0][5]) / det,
                                        -(arguments[0][1] * arguments[0][8] - arguments[0][7] * arguments[0][2]) / det,
                                         (arguments[0][1] * arguments[0][5] - arguments[0][4] * arguments[0][2]) / det,
                                        
                                        -(arguments[0][3] * arguments[0][8] - arguments[0][6] * arguments[0][5]) / det,
                                         (arguments[0][0] * arguments[0][8] - arguments[0][6] * arguments[0][2]) / det,
                                        -(arguments[0][0] * arguments[0][5] - arguments[0][3] * arguments[0][2]) / det,
                                        
                                         (arguments[0][3] * arguments[0][7] - arguments[0][6] * arguments[0][4]) / det,
                                        -(arguments[0][0] * arguments[0][7] - arguments[0][6] * arguments[0][1]) / det,
                                         (arguments[0][0] * arguments[0][4] - arguments[0][3] * arguments[0][1]) / det);
                    else
                        return arguments[0];
                }
            }
        },
        
        /**
         * @function    Sum: {Float32Array}
         * @description Adds two Float32Array component-wise.
         * @param       {Float32Array}
         * @param       {Float32Array}
         */
        Sum:
        {
            value: function Sum()
            {
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9 && arguments[1] instanceof Float32Array && arguments[1].length === 9)
                    return this.Set(arguments[0],
                                    arguments[0][0] + arguments[1][0], arguments[0][1] + arguments[1][1], arguments[0][2] + arguments[1][2],
                                    arguments[0][3] + arguments[1][3], arguments[0][4] + arguments[1][4], arguments[0][5] + arguments[1][5],
                                    arguments[0][6] + arguments[1][6], arguments[0][7] + arguments[1][7], arguments[0][8] + arguments[1][8]);
            }
        },
        
        /**
         * @function    Mult: {Float32Array}
         * @description Performs a matrix multiplication on two Float32Array or
         *              multiply a Float32Array with a scalar value.
         * @param       {Float32Array}  [override 1]
         * @param       {Float32Array}  [override 1]
         * @param       {Float32Array}  [override 2]
         * @param       {Number}        [override 2]
         */
        Mult:
        {
            value: function Mult()
            {
                
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9)
                {
                    if (arguments[1] instanceof Float32Array && arguments[1].length === 9)
                    {
                        return this.Set
                        (
                            arguments[0],
                            arguments[0][0] * arguments[1][0] + arguments[0][1] * arguments[1][3] + arguments[0][2] * arguments[1][6],
                            arguments[0][0] * arguments[1][1] + arguments[0][1] * arguments[1][4] + arguments[0][2] * arguments[1][7],
                            arguments[0][0] * arguments[1][2] + arguments[0][1] * arguments[1][5] + arguments[0][2] * arguments[1][8],
                            
                            arguments[0][3] * arguments[1][0] + arguments[0][4] * arguments[1][3] + arguments[0][5] * arguments[1][6],
                            arguments[0][3] * arguments[1][1] + arguments[0][4] * arguments[1][4] + arguments[0][5] * arguments[1][7],
                            arguments[0][3] * arguments[1][2] + arguments[0][4] * arguments[1][5] + arguments[0][5] * arguments[1][8],
                            
                            arguments[0][6] * arguments[1][0] + arguments[0][7] * arguments[1][3] + arguments[0][8] * arguments[1][6],
                            arguments[0][6] * arguments[1][1] + arguments[0][7] * arguments[1][4] + arguments[0][8] * arguments[1][7],
                            arguments[0][6] * arguments[1][2] + arguments[0][7] * arguments[1][5] + arguments[0][8] * arguments[1][8]
                        ); 
                    }
                    else if (typeof arguments[1] === 'number')
                    {
                        return this.Set(arguments[0],
                                        arguments[0][0] * arguments[1], arguments[0][1] * arguments[1], arguments[0][2] * arguments[1],
                                        arguments[0][3] * arguments[1], arguments[0][4] * arguments[1], arguments[0][5] * arguments[1],
                                        arguments[0][6] * arguments[1], arguments[0][7] * arguments[1], arguments[0][8] * arguments[1]);
                    }
                }
            }
        },
        
        /**
         * @function    RevMult: {Float32Array}
         * @description Performs a matrix multiplication on two Float32Array but
         *              assigns the result to the second Float32Array.
         * @param       {Float32Array}
         * @param       {Float32Array}
         */
        RevMult:
        {
            value: function RevMult()
            {
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9 && arguments[1] instanceof Float32Array && arguments[1].length === 9)
                {
                    return this.Set
                    (
                        arguments[1],
                        arguments[0][0] * arguments[1][0] + arguments[0][1] * arguments[1][3] + arguments[0][2] * arguments[1][6],
                        arguments[0][0] * arguments[1][1] + arguments[0][1] * arguments[1][4] + arguments[0][2] * arguments[1][7],
                        arguments[0][0] * arguments[1][2] + arguments[0][1] * arguments[1][5] + arguments[0][2] * arguments[1][8],
                        
                        arguments[0][3] * arguments[1][0] + arguments[0][4] * arguments[1][3] + arguments[0][5] * arguments[1][6],
                        arguments[0][3] * arguments[1][1] + arguments[0][4] * arguments[1][4] + arguments[0][5] * arguments[1][7],
                        arguments[0][3] * arguments[1][2] + arguments[0][4] * arguments[1][5] + arguments[0][5] * arguments[1][8],
                        
                        arguments[0][6] * arguments[1][0] + arguments[0][7] * arguments[1][3] + arguments[0][8] * arguments[1][6],
                        arguments[0][6] * arguments[1][1] + arguments[0][7] * arguments[1][4] + arguments[0][8] * arguments[1][7],
                        arguments[0][6] * arguments[1][2] + arguments[0][7] * arguments[1][5] + arguments[0][8] * arguments[1][8]
                    );
                }                
            }
        } 
    });
}

