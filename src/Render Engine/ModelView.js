export default class ModelView
{
    var _Stack = new Array();

    Object.defineProperties(this,
    {
        /**
         * @function    PushMatrix
         * @return      {undefined}
         */
        Push: 
        {
            value: function Push()
            {
                _Stack.push(this.Peek());
            }
        },

        /**
         * @function    Peek
         * @return      {Matrix4}
         */
        Peek:
        {
            value: function Peek()
            {
                if (_Stack.length === 0)
                    return Matrix4.Identity;
                else
                    return _Stack[_Stack.length - 1];
            }
        },

        /**
         * @function    Pop
         * @return      {Matrix4}
         */
        Pop:
        {
            value: function Pop()
            {
                if (_Stack.length === 0)
                    return Matrix4.Identity;
                else
                    return _Stack.pop();
            }
        },

        /**
         * @function    Transform
         * @param       {transform}
         * @return      {undefined}
         */
        Transform:
        {
            value: function Transform(transform)
            {
                this.Peek().Set
                (
                    this.Shear
                    (
                        this.Scale
                        (
                            this.Rotate
                            (
                                this.Translate
                                (
                                    this.Peek(),
                                    transform.Position
                                ),
                                transform.Rotation
                            ),
                            transform.Scale
                        ),
                        transform.Shear
                    )
                );
            }
        },

        /**
         * @function    Translate: {Float32Array}
         * @description Returns a translation matrix.
         * @param       matrix:         {Float32Array}
         * @param       translation:    {Float32Array}
         */
        Translate:
        {
            value: function Translate(matrix, translation)
            {
                return new Matrix4
                (
                    matrix.M11, matrix.M12, matrix.M13, matrix.M14,
                    matrix.M21, matrix.M22, matrix.M23, matrix.M24,
                    matrix.M31, matrix.M32, matrix.M33, matrix.M34,

                    matrix.M11 * translation.X + matrix.M21 * translation.Y + matrix.M31 * translation.Z + matrix.M41,
                    matrix.M12 * translation.X + matrix.M22 * translation.Y + matrix.M32 * translation.Z + matrix.M42,
                    matrix.M13 * translation.X + matrix.M23 * translation.Y + matrix.M33 * translation.Z + matrix.M43,
                    matrix.M14 * translation.X + matrix.M24 * translation.Y + matrix.M34 * translation.Z + matrix.M44
                );
            }
        },

        /**
         * @function    Rotate: {Float32Array}
         * @description Returns a rotation matrix.
         * @param       matrix:     {Float32Array}
         * @param       rotation:   {Float32Array}
         */
        Rotate:
        {
            value: function Rotate(matrix, rotation)
            {    
                var rot = Matrix4.Identity;
                let x = Maths.Radian(rotation.X);
                let y = Maths.Radian(rotation.Y);
                let z = Maths.Radian(rotation.Z);

                return new Matrix4
                (
                    Matrix4.Mult
                    (
                        Matrix4.Identity,
                        Math.cos(z), -Math.sin(z), 0.0, 0.0,
                        Math.sin(z),  Math.cos(z), 0.0, 0.0,
                                0.0,          0.0, 1.0, 0.0,
                                0.0,          0.0, 0.0, 1.0
                    ).Mult
                    (
                        Math.cos(y), 0.0, Math.sin(y), 0.0,
                                0.0, 1.0,         0.0, 0.0,
                        -Math.sin(y), 0.0, Math.cos(y), 0.0,
                                0.0, 0.0,         0.0, 1.0

                    ).Mult
                    (
                    
                        1.0,         0.0,          0.0, 0.0,
                        0.0, Math.cos(x), -Math.sin(x), 0.0,
                        0.0, Math.sin(x),  Math.cos(x), 0.0,
                        0.0,         0.0,          0.0, 1.0
                    ).Mult(matrix)
                );
            }
        },

        /**
         * @function    Scale: {Float32Array}
         * @description Returns a scaler matrix.
         * @param       matrix:     {Float32Array}
         * @param       scalers:    {Float32Array}
         */
        Scale:
        {
            value: function Scale(matrix, scalers)
            {                    
                return new Matrix4
                (
                    matrix.M11 * scalers.X, matrix.M12 * scalers.X, matrix.M13 * scalers.X, matrix.M14 * scalers.X,
                    matrix.M21 * scalers.Y, matrix.M22 * scalers.Y, matrix.M23 * scalers.Y, matrix.M24 * scalers.Y,
                    matrix.M31 * scalers.Z, matrix.M32 * scalers.Z, matrix.M33 * scalers.Z, matrix.M34 * scalers.Z,
                                matrix.M41,             matrix.M42,             matrix.M43,             matrix.M44
                );
            }
        },

        /**
         * @function    Shear: {Float32Array}
         * @description Returns a shearing matrix.
         * @param       matrix:    {Float32Array}
         * @param       angles:    {Float32Array}
         */
        Shear:
        {
            value: function Shear(matrix, angles)
            {
                var phi   = Maths.Radian(angles.X);
                var theta = Maths.Radian(angles.Y);
                var rho   = Maths.Radian(angles.Z);

                return new Matrix4
                (
                                1.0,             0.0, Math.tan(rho), 0.0,
                    Math.tan(phi),             1.0,           0.0, 0.0,
                                0.0, Math.tan(theta),           1.0, 0.0,
                                0.0,             0.0,           0.0, 1.0
                ).Mult(matrix);
            }
        }
    });
}