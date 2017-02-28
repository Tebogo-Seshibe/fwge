/**
 * @name        Matrix4
 * @description This library contains the methods for 2x2 matrix operations.
 *              4x4 matrices are represented as a Float32Array of length 16.
 * @module      FWGE.Game.Maths 
 */
function Matrix4()
{
    Object.defineProperties(this,
    {
        /**
         * @function    Create: {Float32Array}
         * @description Creates an new Float32Array with the Type set to "MATRIX4".
         *              It also has the appropriate value indexers:
         *              M11, M12, M13, M14,
         *              M21, M22, M23, M24,
         *              M31, M32, M33, M34,
         *              M41, M42, M43, M44.
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
                var $ = new Float32Array(16);
                
                $[0] = typeof arguments[0] === 'number' ? arguments[0] : arguments[0] instanceof Array && typeof arguments[0][0] === 'number' ? arguments[0][0] : 0;
                $[1] = typeof arguments[1] === 'number' ? arguments[1] : arguments[0] instanceof Array && typeof arguments[0][1] === 'number' ? arguments[0][1] : 0;
                $[2] = typeof arguments[2] === 'number' ? arguments[2] : arguments[0] instanceof Array && typeof arguments[0][2] === 'number' ? arguments[0][2] : 0;
                $[3] = typeof arguments[3] === 'number' ? arguments[3] : arguments[0] instanceof Array && typeof arguments[0][3] === 'number' ? arguments[0][3] : 0;
                $[4] = typeof arguments[4] === 'number' ? arguments[4] : arguments[0] instanceof Array && typeof arguments[0][4] === 'number' ? arguments[0][4] : 0;
                $[5] = typeof arguments[5] === 'number' ? arguments[5] : arguments[0] instanceof Array && typeof arguments[0][5] === 'number' ? arguments[0][5] : 0;
                $[6] = typeof arguments[6] === 'number' ? arguments[6] : arguments[0] instanceof Array && typeof arguments[0][6] === 'number' ? arguments[0][6] : 0;
                $[7] = typeof arguments[7] === 'number' ? arguments[7] : arguments[0] instanceof Array && typeof arguments[0][7] === 'number' ? arguments[0][7] : 0;
                $[8] = typeof arguments[8] === 'number' ? arguments[8] : arguments[0] instanceof Array && typeof arguments[0][8] === 'number' ? arguments[0][8] : 0;
                $[9] = typeof arguments[9] === 'number' ? arguments[9] : arguments[0] instanceof Array && typeof arguments[0][9] === 'number' ? arguments[0][9] : 0;
                $[10] = typeof arguments[10] === 'number' ? arguments[10] : arguments[0] instanceof Array && typeof arguments[0][10] === 'number' ? arguments[0][10] : 0;
                $[11] = typeof arguments[11] === 'number' ? arguments[11] : arguments[0] instanceof Array && typeof arguments[0][11] === 'number' ? arguments[0][11] : 0;
                $[12] = typeof arguments[12] === 'number' ? arguments[12] : arguments[0] instanceof Array && typeof arguments[0][12] === 'number' ? arguments[0][12] : 0;
                $[13] = typeof arguments[13] === 'number' ? arguments[13] : arguments[0] instanceof Array && typeof arguments[0][13] === 'number' ? arguments[0][13] : 0;
                $[14] = typeof arguments[14] === 'number' ? arguments[14] : arguments[0] instanceof Array && typeof arguments[0][14] === 'number' ? arguments[0][14] : 0;
                $[15] = typeof arguments[15] === 'number' ? arguments[15] : arguments[0] instanceof Array && typeof arguments[0][15] === 'number' ? arguments[0][15] : 0;
                
                Object.defineProperties($,
                {
                    Type: { value: "MATRIX4" },
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
                    M14:
                    {
                        get: function getM14(){ return $[3]; },
                        set: function setM14(){ if (typeof arguments[0] === 'number') $[3] = arguments[0]; }
                    },
                    M21: 
                    {
                        get: function getM21(){ return $[4]; },
                        set: function setM21(){ if (typeof arguments[0] === 'number') $[4] = arguments[0]; }
                    },
                    M22:
                    {
                        get: function getM22(){ return $[5]; },
                        set: function setM22(){ if (typeof arguments[0] === 'number') $[5] = arguments[0]; }
                    },
                    M23: 
                    {
                        get: function getM23(){ return $[6]; },
                        set: function setM23(){ if (typeof arguments[0] === 'number') $[6] = arguments[0]; }
                    },
                    M24: 
                    {
                        get: function getM24(){ return $[7]; },
                        set: function setM24(){ if (typeof arguments[0] === 'number') $[7] = arguments[0]; }
                    },
                    M31:
                    {
                        get: function getM31(){ return $[8]; },
                        set: function setM31(){ if (typeof arguments[0] === 'number') $[8] = arguments[0]; }
                    },
                    M32: 
                    {
                        get: function getM32(){ return $[9]; },
                        set: function setM32(){ if (typeof arguments[0] === 'number') $[9] = arguments[0]; }
                    },
                    M33: 
                    {
                        get: function getM33(){ return $[10]; },
                        set: function setM33(){ if (typeof arguments[0] === 'number') $[10] = arguments[0]; }
                    },
                    M34: 
                    {
                        get: function getM34(){ return $[11]; },
                        set: function setM34(){ if (typeof arguments[0] === 'number') $[11] = arguments[0]; }
                    },
                    M41:
                    {
                        get: function getM31(){ return $[12]; },
                        set: function setM31(){ if (typeof arguments[0] === 'number') $[12] = arguments[0]; }
                    },
                    M42: 
                    {
                        get: function getM32(){ return $[13]; },
                        set: function setM32(){ if (typeof arguments[0] === 'number') $[13] = arguments[0]; }
                    },
                    M43: 
                    {
                        get: function getM33(){ return $[14]; },
                        set: function setM33(){ if (typeof arguments[0] === 'number') $[14] = arguments[0]; }
                    },
                    M44: 
                    {
                        get: function getM34(){ return $[15]; },
                        set: function setM34(){ if (typeof arguments[0] === 'number') $[15] = arguments[0]; }
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
                var $, a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p;

                $ = arguments[0];
                if (arguments[1] instanceof Float32Array && arguments[0].length === 16)
                {
                    a = arguments[1][0];  b = arguments[1][1];  c = arguments[1][2];  d = arguments[1][3];
                    e = arguments[1][4];  f = arguments[1][5];  g = arguments[1][6];  h = arguments[1][7];
                    i = arguments[1][8];  j = arguments[1][9];  k = arguments[1][10]; l = arguments[1][11];
                    m = arguments[1][12]; n = arguments[1][13]; o = arguments[1][14]; p = arguments[1][15];
                }
                else
                {
                    a = arguments[1];  b = arguments[2];  c = arguments[3];  d = arguments[4];
                    e = arguments[5];  f = arguments[6];  g = arguments[7];  h = arguments[8];
                    i = arguments[9];  j = arguments[10]; k = arguments[11]; l = arguments[12];
                    m = arguments[13]; n = arguments[14]; o = arguments[15]; p = arguments[16];
                }
                
                if ($ instanceof Float32Array && arguments[0].length === 16 && typeof a === 'number' && typeof b === 'number' && typeof c === 'number' && typeof d === 'number' && typeof e === 'number' && typeof f === 'number' && typeof g === 'number' && typeof h === 'number' && typeof i === 'number' && typeof j === 'number' && typeof k === 'number' && typeof l === 'number' && typeof m === 'number' && typeof n === 'number' && typeof o === 'number' && typeof p === 'number')
                {
                    $[0] = a;  $[1] = b;  $[2] = c;  $[3] = d;                        
                    $[4] = e;  $[5] = f;  $[6] = g;  $[7] = h;                        
                    $[8] = i;  $[9] = j;  $[10] = k; $[11] = l;                        
                    $[12] = m; $[13] = n; $[14] = o; $[15] = p;

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
                if (arguments[0] instanceof Float32Array && arguments[0].length === 16)
                    return this.Set(arguments[0],
                                    arguments[0][0], arguments[0][4], arguments[0][8], arguments[0][12],
                                    arguments[0][1], arguments[0][5], arguments[0][9], arguments[0][13],
                                    arguments[0][2], arguments[0][6], arguments[0][10], arguments[0][14],
                                    arguments[0][3], arguments[0][7], arguments[0][11], arguments[0][15]);
                
                Error("TRANSPOSE", arguments);
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
                if (arguments[0] instanceof Float32Array && arguments[0].length === 16)
                    return this.Set(arguments[0],
                                    1, 0, 0, 0,
                                    0, 1, 0, 0,
                                    0, 0, 1, 0,
                                    0, 0, 0, 1);
                else
                    return this.Create(1, 0, 0, 0,
                                       0, 1, 0, 0,
                                       0, 0, 1, 0,
                                       0, 0, 0, 1);
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
                if (arguments[0] instanceof Float32Array && arguments[0].length === 16)
                    return arguments[0][0] * arguments[0][5] * arguments[0][10] * arguments[0][15] +
                        arguments[0][0] * arguments[0][6] * arguments[0][11] * arguments[0][13] +
                        arguments[0][0] * arguments[0][7] *  arguments[0][9] * arguments[0][14] +
                        arguments[0][1] * arguments[0][4] * arguments[0][11] * arguments[0][14] +
                        arguments[0][1] * arguments[0][6] *  arguments[0][8] * arguments[0][15] +
                        arguments[0][1] * arguments[0][7] * arguments[0][10] * arguments[0][12] +
                        arguments[0][2] * arguments[0][4] *  arguments[0][9] * arguments[0][15] +
                        arguments[0][2] * arguments[0][5] * arguments[0][11] * arguments[0][12] +
                        arguments[0][2] * arguments[0][7] *  arguments[0][8] * arguments[0][13] +
                        arguments[0][3] * arguments[0][4] * arguments[0][10] * arguments[0][13] +
                        arguments[0][3] * arguments[0][5] *  arguments[0][8] * arguments[0][14] +
                        arguments[0][3] * arguments[0][6] *  arguments[0][9] * arguments[0][12] -
                        arguments[0][0] * arguments[0][5] * arguments[0][11] * arguments[0][14] -
                        arguments[0][0] * arguments[0][6] *  arguments[0][9] * arguments[0][15] -
                        arguments[0][0] * arguments[0][7] * arguments[0][10] * arguments[0][13] -
                        arguments[0][1] * arguments[0][4] * arguments[0][10] * arguments[0][15] -
                        arguments[0][1] * arguments[0][6] * arguments[0][11] * arguments[0][12] -
                        arguments[0][1] * arguments[0][7] *  arguments[0][8] * arguments[0][14] -
                        arguments[0][2] * arguments[0][4] * arguments[0][11] * arguments[0][13] -
                        arguments[0][2] * arguments[0][5] *  arguments[0][8] * arguments[0][15] -
                        arguments[0][2] * arguments[0][7] *  arguments[0][9] * arguments[0][12] -
                        arguments[0][3] * arguments[0][4] *  arguments[0][9] * arguments[0][14] -
                        arguments[0][3] * arguments[0][5] * arguments[0][10] * arguments[0][12] -
                        arguments[0][3] * arguments[0][6] *  arguments[0][8] * arguments[0][13];
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
                if (arguments[0] instanceof Float32Array && arguments[0].length === 16)
                {
                    var det = this.Determinant(arguments[0]);
                    if (det !== 0)
                        return this.Set(arguments[0],
                                        (arguments[0][5] * arguments[0][10] * arguments[0][15] +
                                         arguments[0][6] * arguments[0][11] * arguments[0][13] +
                                         arguments[0][7] *  arguments[0][9] * arguments[0][14] -
                                         arguments[0][5] * arguments[0][11] * arguments[0][14] -
                                         arguments[0][6] *  arguments[0][9] * arguments[0][15] -
                                         arguments[0][7] * arguments[0][10] * arguments[0][13]) / det,
                                        (arguments[0][1] * arguments[0][11] * arguments[0][14] +
                                         arguments[0][2] *  arguments[0][9] * arguments[0][15] +
                                         arguments[0][3] * arguments[0][10] * arguments[0][13] -
                                         arguments[0][1] * arguments[0][10] * arguments[0][15] -
                                         arguments[0][2] * arguments[0][11] * arguments[0][13] -
                                         arguments[0][3] *  arguments[0][9] * arguments[0][14]) / det,
                                        (arguments[0][1] * arguments[0][6] * arguments[0][15] +
                                         arguments[0][2] * arguments[0][7] * arguments[0][13] +
                                         arguments[0][3] * arguments[0][5] * arguments[0][14] -
                                         arguments[0][1] * arguments[0][7] * arguments[0][14] -
                                         arguments[0][2] * arguments[0][5] * arguments[0][15] -
                                         arguments[0][3] * arguments[0][6] * arguments[0][13]) / det,
                                        (arguments[0][1] * arguments[0][7] * arguments[0][10] +
                                         arguments[0][2] * arguments[0][5] * arguments[0][11] +
                                         arguments[0][3] * arguments[0][6] *  arguments[0][9] -
                                         arguments[0][1] * arguments[0][6] * arguments[0][11] -
                                         arguments[0][2] * arguments[0][7] *  arguments[0][9] -
                                         arguments[0][3] * arguments[0][5] * arguments[0][10]) / det,
                                        
                                        (arguments[0][4] * arguments[0][11] * arguments[0][14] +
                                         arguments[0][6] *  arguments[0][8] * arguments[0][15] +
                                         arguments[0][7] * arguments[0][10] * arguments[0][12] -
                                         arguments[0][4] * arguments[0][10] * arguments[0][15] -
                                         arguments[0][6] * arguments[0][11] * arguments[0][12] -
                                         arguments[0][7] *  arguments[0][8] * arguments[0][14]) / det,
                                        (arguments[0][0] * arguments[0][10] * arguments[0][15] +
                                         arguments[0][2] * arguments[0][11] * arguments[0][12] +
                                         arguments[0][3] *  arguments[0][8] * arguments[0][14] -
                                         arguments[0][0] * arguments[0][11] * arguments[0][14] -
                                         arguments[0][2] *  arguments[0][8] * arguments[0][15] -
                                         arguments[0][3] * arguments[0][10] * arguments[0][12]) / det,
                                        (arguments[0][0] * arguments[0][7] * arguments[0][14] +
                                         arguments[0][2] * arguments[0][4] * arguments[0][15] +
                                         arguments[0][3] * arguments[0][6] * arguments[0][12] -
                                         arguments[0][0] * arguments[0][6] * arguments[0][15] -
                                         arguments[0][2] * arguments[0][7] * arguments[0][12] -
                                         arguments[0][3] * arguments[0][4] * arguments[0][14]) / det,
                                        (arguments[0][0] * arguments[0][6] * arguments[0][11] +
                                         arguments[0][2] * arguments[0][7] *  arguments[0][8] +
                                         arguments[0][3] * arguments[0][4] * arguments[0][10] -
                                         arguments[0][0] * arguments[0][7] * arguments[0][10] -
                                         arguments[0][2] * arguments[0][4] * arguments[0][11] -
                                         arguments[0][3] * arguments[0][6] * arguments[0][8]) / det,
                                        
                                        (arguments[0][4] *  arguments[0][9] * arguments[0][15] +
                                         arguments[0][5] * arguments[0][11] * arguments[0][12] +
                                         arguments[0][7] *  arguments[0][8] * arguments[0][13] -
                                         arguments[0][4] * arguments[0][11] * arguments[0][13] -
                                         arguments[0][5] *  arguments[0][8] * arguments[0][15] -
                                         arguments[0][7] *  arguments[0][9] * arguments[0][12]) / det,
                                        (arguments[0][0] * arguments[0][11] * arguments[0][13] +
                                         arguments[0][1] *  arguments[0][8] * arguments[0][15] +
                                         arguments[0][3] *  arguments[0][9] * arguments[0][12] -
                                         arguments[0][0] *  arguments[0][9] * arguments[0][15] -
                                         arguments[0][1] * arguments[0][11] * arguments[0][12] -
                                         arguments[0][3] *  arguments[0][8] * arguments[0][13]) / det,
                                        (arguments[0][0] * arguments[0][5] * arguments[0][15] +
                                         arguments[0][1] * arguments[0][7] * arguments[0][12] +
                                         arguments[0][3] * arguments[0][4] * arguments[0][13] -
                                         arguments[0][0] * arguments[0][7] * arguments[0][13] -
                                         arguments[0][1] * arguments[0][4] * arguments[0][15] -
                                         arguments[0][3] * arguments[0][5] * arguments[0][12]) / det,
                                        (arguments[0][0] * arguments[0][7] *  arguments[0][9] +
                                         arguments[0][1] * arguments[0][4] * arguments[0][11] +
                                         arguments[0][3] * arguments[0][5] *  arguments[0][8] -
                                         arguments[0][0] * arguments[0][5] * arguments[0][11] -
                                         arguments[0][1] * arguments[0][7] *  arguments[0][8] -
                                         arguments[0][3] * arguments[0][4] *  arguments[0][9]) / det,
                                        
                                        (arguments[0][4] * arguments[0][10] * arguments[0][13] +
                                         arguments[0][5] *  arguments[0][8] * arguments[0][14] +
                                         arguments[0][6] *  arguments[0][9] * arguments[0][12] -
                                         arguments[0][4] *  arguments[0][9] * arguments[0][14] -
                                         arguments[0][5] * arguments[0][10] * arguments[0][12] -
                                         arguments[0][6] *  arguments[0][8] * arguments[0][13]) / det,
                                        (arguments[0][0] *  arguments[0][9] * arguments[0][14] +
                                         arguments[0][1] * arguments[0][10] * arguments[0][12] +
                                         arguments[0][2] *  arguments[0][8] * arguments[0][13] -
                                         arguments[0][0] * arguments[0][10] * arguments[0][13] -
                                         arguments[0][1] *  arguments[0][8] * arguments[0][14] -
                                         arguments[0][2] *  arguments[0][9] * arguments[0][12]) / det,
                                        (arguments[0][0] * arguments[0][6] * arguments[0][13] +
                                         arguments[0][1] * arguments[0][4] * arguments[0][14] +
                                         arguments[0][2] * arguments[0][5] * arguments[0][12] -
                                         arguments[0][0] * arguments[0][5] * arguments[0][14] -
                                         arguments[0][1] * arguments[0][6] * arguments[0][12] -
                                         arguments[0][2] * arguments[0][4] * arguments[0][13]) / det,
                                        (arguments[0][0] * arguments[0][5] * arguments[0][10] +
                                         arguments[0][1] * arguments[0][6] * arguments[0][8] +
                                         arguments[0][2] * arguments[0][4] * arguments[0][9] -
                                         arguments[0][0] * arguments[0][6] * arguments[0][9] -
                                         arguments[0][1] * arguments[0][4] * arguments[0][10] -
                                         arguments[0][2] * arguments[0][5] * arguments[0][8]) / det);
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
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 16 && arguments[1] instanceof Float32Array && arguments[1].length === 16)
                    return this.Set(arguments[0],
                                    arguments[0][0]  + arguments[1][0], arguments[0][1]  + arguments[1][1],
                                    arguments[0][2]  + arguments[1][2], arguments[0][3]  + arguments[1][3],
                                    
                                    arguments[0][4]  + arguments[1][4], arguments[0][5]  + arguments[1][5],
                                    arguments[0][6]  + arguments[1][6], arguments[0][7]  + arguments[1][7],
                                    
                                    arguments[0][8]  + arguments[1][8], arguments[0][9]  + arguments[1][9],
                                    arguments[0][10] + arguments[1][10], arguments[0][11] + arguments[1][11],
                                    
                                    arguments[0][12] + arguments[1][12], arguments[0][13] + arguments[1][13],
                                    arguments[0][14] + arguments[1][14], arguments[0][15] + arguments[1][15]);
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
                
                
                if (arguments[0] instanceof Float32Array && arguments[0].length === 16)
                {
                    if (arguments[1] instanceof Float32Array && arguments[1].length === 16)
                    {
                        return this.Set
                        (
                            arguments[0],
                            arguments[0][0]  * arguments[1][0] + arguments[0][1]  * arguments[1][4] + arguments[0][2]  * arguments[1][8]  + arguments[0][3]  * arguments[1][12],
                            arguments[0][0]  * arguments[1][1] + arguments[0][1]  * arguments[1][5] + arguments[0][2]  * arguments[1][9]  + arguments[0][3]  * arguments[1][13],
                            arguments[0][0]  * arguments[1][2] + arguments[0][1]  * arguments[1][6] + arguments[0][2]  * arguments[1][10] + arguments[0][3]  * arguments[1][14],
                            arguments[0][0]  * arguments[1][3] + arguments[0][1]  * arguments[1][7] + arguments[0][2]  * arguments[1][11] + arguments[0][3]  * arguments[1][15],
                            
                            arguments[0][4]  * arguments[1][0] + arguments[0][5]  * arguments[1][4] + arguments[0][6]  * arguments[1][8]  + arguments[0][7]  * arguments[1][12],
                            arguments[0][4]  * arguments[1][1] + arguments[0][5]  * arguments[1][5] + arguments[0][6]  * arguments[1][9]  + arguments[0][7]  * arguments[1][13],
                            arguments[0][4]  * arguments[1][2] + arguments[0][5]  * arguments[1][6] + arguments[0][6]  * arguments[1][10] + arguments[0][7]  * arguments[1][14],
                            arguments[0][4]  * arguments[1][3] + arguments[0][5]  * arguments[1][7] + arguments[0][6]  * arguments[1][11] + arguments[0][7]  * arguments[1][15],
                            
                            arguments[0][8]  * arguments[1][0] + arguments[0][9]  * arguments[1][4] + arguments[0][10] * arguments[1][8]  + arguments[0][11] * arguments[1][12],
                            arguments[0][8]  * arguments[1][1] + arguments[0][9]  * arguments[1][5] + arguments[0][10] * arguments[1][9]  + arguments[0][11] * arguments[1][13],
                            arguments[0][8]  * arguments[1][2] + arguments[0][9]  * arguments[1][6] + arguments[0][10] * arguments[1][10] + arguments[0][11] * arguments[1][14],
                            arguments[0][8]  * arguments[1][3] + arguments[0][9]  * arguments[1][7] + arguments[0][10] * arguments[1][11] + arguments[0][11] * arguments[1][15],
                            
                            arguments[0][12] * arguments[1][0] + arguments[0][13] * arguments[1][4] + arguments[0][14] * arguments[1][8]  + arguments[0][15] * arguments[1][12],
                            arguments[0][12] * arguments[1][1] + arguments[0][13] * arguments[1][5] + arguments[0][14] * arguments[1][9]  + arguments[0][15] * arguments[1][13],
                            arguments[0][12] * arguments[1][2] + arguments[0][13] * arguments[1][6] + arguments[0][14] * arguments[1][10] + arguments[0][15] * arguments[1][14],
                            arguments[0][12] * arguments[1][3] + arguments[0][13] * arguments[1][7] + arguments[0][14] * arguments[1][11] + arguments[0][15] * arguments[1][15]
                        ); 
                    }
                    else if (typeof arguments[1] === 'number')
                    {
                        return this.Set(arguments[0],
                                        arguments[0][0] * arguments[1], arguments[0][1] * arguments[1], arguments[0][2] * arguments[1], arguments[0][3] * arguments[1],
                                        arguments[0][4] * arguments[1], arguments[0][5] * arguments[1], arguments[0][6] * arguments[1], arguments[0][7] * arguments[1],
                                        arguments[0][8] * arguments[1], arguments[0][9] * arguments[1], arguments[0][10] * arguments[1], arguments[0][11] * arguments[1],
                                        arguments[0][12] * arguments[1], arguments[0][13] * arguments[1], arguments[0][14] * arguments[1], arguments[0][15] * arguments[1]);
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
                if (arguments[0] instanceof Float32Array && arguments[0].length === 9 && arguments[1] instanceof Float32Array && arguments[1].length === 16)
                {
                    return this.Set
                    (
                        arguments[1],
                        arguments[0][0]  * arguments[1][0] + arguments[0][1]  * arguments[1][4] + arguments[0][2]  * arguments[1][8]  + arguments[0][3]  * arguments[1][12],
                        arguments[0][0]  * arguments[1][1] + arguments[0][1]  * arguments[1][5] + arguments[0][2]  * arguments[1][9]  + arguments[0][3]  * arguments[1][13],
                        arguments[0][0]  * arguments[1][2] + arguments[0][1]  * arguments[1][6] + arguments[0][2]  * arguments[1][10] + arguments[0][3]  * arguments[1][14],
                        arguments[0][0]  * arguments[1][3] + arguments[0][1]  * arguments[1][7] + arguments[0][2]  * arguments[1][11] + arguments[0][3]  * arguments[1][15],

                        arguments[0][4]  * arguments[1][0] + arguments[0][5]  * arguments[1][4] + arguments[0][6]  * arguments[1][8]  + arguments[0][7]  * arguments[1][12],
                        arguments[0][4]  * arguments[1][1] + arguments[0][5]  * arguments[1][5] + arguments[0][6]  * arguments[1][9]  + arguments[0][7]  * arguments[1][13],
                        arguments[0][4]  * arguments[1][2] + arguments[0][5]  * arguments[1][6] + arguments[0][6]  * arguments[1][10] + arguments[0][7]  * arguments[1][14],
                        arguments[0][4]  * arguments[1][3] + arguments[0][5]  * arguments[1][7] + arguments[0][6]  * arguments[1][11] + arguments[0][7]  * arguments[1][15],

                        arguments[0][8]  * arguments[1][0] + arguments[0][9]  * arguments[1][4] + arguments[0][10] * arguments[1][8]  + arguments[0][11] * arguments[1][12],
                        arguments[0][8]  * arguments[1][1] + arguments[0][9]  * arguments[1][5] + arguments[0][10] * arguments[1][9]  + arguments[0][11] * arguments[1][13],
                        arguments[0][8]  * arguments[1][2] + arguments[0][9]  * arguments[1][6] + arguments[0][10] * arguments[1][10] + arguments[0][11] * arguments[1][14],
                        arguments[0][8]  * arguments[1][3] + arguments[0][9]  * arguments[1][7] + arguments[0][10] * arguments[1][11] + arguments[0][11] * arguments[1][15],

                        arguments[0][12] * arguments[1][0] + arguments[0][13] * arguments[1][4] + arguments[0][14] * arguments[1][8]  + arguments[0][15] * arguments[1][12],
                        arguments[0][12] * arguments[1][1] + arguments[0][13] * arguments[1][5] + arguments[0][14] * arguments[1][9]  + arguments[0][15] * arguments[1][13],
                        arguments[0][12] * arguments[1][2] + arguments[0][13] * arguments[1][6] + arguments[0][14] * arguments[1][10] + arguments[0][15] * arguments[1][14],
                        arguments[0][12] * arguments[1][3] + arguments[0][13] * arguments[1][7] + arguments[0][14] * arguments[1][11] + arguments[0][15] * arguments[1][15]
                    );
                }
            }
        } 
    });
}

