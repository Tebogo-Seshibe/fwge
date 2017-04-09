/**
 * @name Maths
 * @description This module contains the methods required for matrix and vector
 *              operations.
 * @module      FWGE.Game
 */
function Maths()
{
    Object.defineProperties(this,
    {
        /**
         * @property    Matrix2: {Matrix2} [read]
         * @description Operations for 2x2 matrices.
         * @see         FWGE.Maths.Matrix2
         */
        Matrix2:      { value: new Matrix2() },
        
        /**
         * @property    Matrix3: {Matrix3} [read]
         * @description Operations for 3x3 matrices.
         * @see         FWGE.Maths.Matrix3
         */
        Matrix3:      { value: new Matrix3() },
        
        /**
         * @property    Matrix4: {Matrix4} [read]
         * @description Operations for 4x4 matrices.
         * @see         FWGE.Maths.Matrix4
         */
        Matrix4:      { value: new Matrix4() },
        
        /**
         * @property    Vector2: {Vector2} [read]
         * @description Operations for 2 component veectors.
         * @see         FWGE.Maths.Vector2
         */
        Vector2:      { value: new Vector2() },
        
        /**
         * @property    Vector3: {Vector3} [read]
         * @description Operations for 3 component veectors.
         * @see         FWGE.Maths.Vector3
         */
        Vector3:      { value: new Vector3() },
        
        /**
         * @property    Vector4: {Vector4} [read]
         * @description Operations for 4 component veectors.
         * @see         FWGE.Maths.Vector4
         */
        Vector4:      { value: new Vector4() },
        
        /**
         * @property    Quaternion: {Quaternion} [read]
         * @description Operations for 4 component quaternions.
         * @see         FWGE.Maths.Quaternion
         */
        Quaternion:   { value: new Quaternion() }
    });
};

