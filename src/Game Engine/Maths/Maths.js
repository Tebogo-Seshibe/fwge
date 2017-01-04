/*!
 * @constructor Maths
 * @description This module contains the methods required for matrix and vector
 *              operations.
 * @module      FWGE.Game
 */
function Maths()
{
    Object.defineProperties(this,
    {
        /*!
         * @property    Matrix2
         *              > get
         * @description Operations for 2x2 matrices.
         */
        Matrix2:      { value: new Matrix2() },
        
        /*!
         * @property    Matrix3
         *              > get
         * @description Operations for 3x3 matrices.
         */
        Matrix3:      { value: new Matrix3() },
        
        /*!
         * @property    Matrix4
         *              > get
         * @description Operations for 4x4 matrices.
         */
        Matrix4:      { value: new Matrix4() },
        
        /*!
         * @property    Vector2
         *              > get
         * @description Operations for 2 component veectors.
         */
        Vector2:      { value: new Vector2() },
        
        /*!
         * @property    Vector3
         *              > get
         * @description Operations for 3 component veectors.
         */
        Vector3:      { value: new Vector3() },
        
        /*!
         * @property    Vector4
         *              > get
         * @description Operations for 4 component veectors.
         */
        Vector4:      { value: new Vector4() },
        
        /*!
         * @property    Quaternion
         *              > get
         * @description Operations for 4 component quaternions.
         */
        Quaternion:   { value: new Quaternion() }
    });
};

