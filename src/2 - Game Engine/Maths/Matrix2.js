/**
 * @name        Matrix2
 * @module      FWGE.Game.Maths 
 * @description This library contains the methods for 2x2 matrix operations.
 *              2x2 matrices are represented as a Matrix2 of length 4.
 */

window.Matrix2 = (function()
{
    /**
     * @param   {number} m11
     * @param   {number} m12
     * @param   {number} m21
     * @param   {number} m22
     */
    function Matrix2(m11 = 0, m12 = 0, m21 = 0, m22 = 0)
    {
        BufferedArray.call(this, 4, Matrix2);
        this.Set(m11, m12, m21, m22);

        Object.seal(this);
    }
    Object.defineProperties(Matrix2,
    {
        /**
         * @property    {Identity}
         * @type        {Matrix2}
         */
        Identity:
        {
            get: function get() { return new Matrix2(1, 0, 0, 1); },
            configurable: false, enumerable: true
        },

        /**
         * @function    Set
         * @param       {number} m11
         * @param       {number} m12
         * @param       {number} m21
         * @param       {number} m22
         * @return      {Matrix2}
         */
        Set:
        {
            value: function Set(matrix, m11, m12, m21, m22)
            {
                matrix.M11 = m11;
                matrix.M12 = m12;
                matrix.M21 = m21;
                matrix.M22 = m22;

                return matrix;
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Transpose
         * @param       {Matrix2} array
         * @return      {Matrix2}
         */
        Transpose:
        {
            value: function Transpose(matrix)
            {
                return new Matrix2(matrix.M11, matrix.M21, matrix.M12, matrix.M22);
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Determinant
         * @param       {Matrix2}  array
         * @return      {number}
         */
        Determinant:
        {
            value: function Determinant(m11, m12, m21, m22)
            {
                return m11 * m22 - m21 * m12;
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Inverse
         * @param       {Matrix2}  array
         * @return      {Matrix2}
         */
        Inverse:
        {
            value: function Inverse(matrix)
            {
                let det = matrix.Determinant;

                if (det === 0)
                    det = 1;

                return new Matrix2(matrix.M22 / det, -matrix.M12 / det, -matrix.M21 / det,  matrix.M11 / det);
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Sum
         * @param       {number} m11
         * @param       {number} m12
         * @param       {number} m21
         * @param       {number} m22
         * @return      {Matrix2} 
         */
        Sum:
        {
            value: function Sum(matrix, m11, m12, m21, m22)
            {
                return new Matrix2(matrix.M11 + m11, matrix.M12 + m12, matrix.M21 + m21, matrix.M22 + m22);
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Mult
         * @param       {number} m11
         * @param       {number} m12
         * @param       {number} m21
         * @param       {number} m22
         * @return      {Matrix2}
         */
        Mult:
        {
            value: function Mult(matrix, m11, m12, m21, m22)
            {
                return new Matrix2
                (
                    matrix.M11 * m11 + matrix.M12 * m21,
                    matrix.M11 * m12 + matrix.M12 * m22,                
                    matrix.M21 * m11 + matrix.M22 * m21,
                    matrix.M21 * m12 + matrix.M22 * m22
                );
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Scale
         * @param       {number}   scalar
         * @return      {Matrix2}
         */
        Scale:
        {
            value: function Scale(matrix, scaler)
            {
                return Matrix2.Mult(matrix, scaler, scaler, scaler, scaler);
            },
            configurable: false, enumerable: true, writable: false
        }    
    });

    Matrix2.prototype = Object.create(null);
    Object.defineProperties(Matrix2.prototype,
    {
        constructor: { value: Matrix2 },

        /**
         * @property    {M11}
         * @type        {number}
         */
        M11:
        {
            get: function get() { return this.Buffer[0]; },
            set: function set(m11) { this.Buffer[0] = m11; },
            configurable: false, enumerable: true
        },

        /**
         * @property    {M12}
         * @type        {number}
         */
        M12:
        {
            get: function get() { return this.Buffer[1]; },
            set: function set(m12) { this.Buffer[1] = m12; },
            configurable: false, enumerable: true
        },

        /**
         * @property    {M21}
         * @type        {number}
         */
        M21:
        {
            get: function get() { return this.Buffer[2]; },
            set: function set(m21) { this.Buffer[2] = m21; },
            configurable: false, enumerable: true
        },

        /**
         * @property    {M22}
         * @type        {number}
         */
        M22:
        {
            get: function get() { return this.Buffer[3]; },
            set: function set(m22) { this.Buffer[3] = m22; },
            configurable: false, enumerable: true
        },


        /**
         * @function    Set
         * @param       {number} m11
         * @param       {number} m12
         * @param       {number} m21
         * @param       {number} m22
         * @return      {Matrix2}
         */
        Set:
        {
            value: function Set(m11, m12, m21, m22)
            {
                return Matrix2.Set(this, m11, m12, m21, m22);
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Transpose
         * @param       {Matrix2} array
         * @return      {Matrix2}
         */
        Transpose:
        {
            value: function Transpose()
            {
                return Matrix2.Set(this, this.M11, this.M21, this.M12, this.M22);
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Identity
         * @param       {Matrix2} array
         * @return      {Matrix2}
         */
        Identity:
        {
            value: function Identity()
            {
                return Matrix2.Set(this, 1, 0, 0, 1);
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Determinant
         * @param       {Matrix2}  array
         * @return      {number}
         */
        Determinant:
        {
            get: function Determinant()
            {
                return Matrix2.Determinant(this.M11, this.M12, this.M21, this.M22);
            },
            configurable: false, enumerable: true
        },
        
        /**
         * @function    Inverse
         * @param       {Matrix2}  array
         * @return      {Matrix2}
         */
        Inverse:
        {
            value: function Inverse()
            {
                let det = matrix.Determinant;

                if (det === 0)
                    det = 1;

                return Matrix2.Set
                (
                    this,
                    this.M22 / det,
                    -this.M12 / det,
                    -this.M21 / det,
                    this.M11 / det
                );
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Sum
         * @param       {number} m11
         * @param       {number} m12
         * @param       {number} m21
         * @param       {number} m22
         * @return      {Matrix2} 
         */
        Sum:
        {
            value: function Sum(m11, m12, m21, m22)
            {
                return Matrix2.Set
                (
                    this,
                    this.M11 + m11,
                    this.M12 + m12,
                    this.M21 + m21,
                    this.M22 + m22
                );
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Mult
         * @param       {number} m11
         * @param       {number} m12
         * @param       {number} m21
         * @param       {number} m22
         * @return      {Matrix2}
         */
        Mult:
        {
            value: function Mult(m11, m12, m21, m22)
            {
                return Matrix2.Set
                (
                    this,
                    this.M11 * m11 + this.M12 * m21,
                    this.M11 * m12 + this.M12 * m22,                
                    this.M21 * m11 + this.M22 * m21,
                    this.M21 * m12 + this.M22 * m22
                );
            },
            configurable: false, enumerable: true, writable: false
        },
        
        /**
         * @function    Scale
         * @param       {number}   scalar
         * @return      {Matrix2}
         */
        Scale:
        {
            value: function Scale(scaler)
            {
                return this.Mult(scaler, scaler, scaler, scaler);
            },
            configurable: false, enumerable: true, writable: false
        }
    });
    Object.seal(Matrix2.prototype);

    return Matrix2;
})();
Object.seal(Matrix2);
