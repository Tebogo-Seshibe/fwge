function ModelView()
{
    var $ = this;
    var _Stack = [];
    
    Object.defineProperties($,
    {
        PushMatrix:
        {
            value: function PushMatrix()
            {
                var peek = $.PeekMatrix();
                _Stack.push(FWGE.Maths.Matrix4.Create
                (
                    peek.M11, peek.M12, peek.M13, peek.M14,
                    peek.M21, peek.M22, peek.M23, peek.M24,
                    peek.M31, peek.M32, peek.M33, peek.M34,
                    peek.M41, peek.M42, peek.M43, peek.M44
                ));
            }
        },
        PeekMatrix:
        {
            value: function PeekMatrix()
            {
                if (_Stack.length === 0)
                    return FWGE.Maths.Matrix4.Identity();
                else
                    return _Stack[_Stack.length - 1];
            }
        },
        PopMatrix:
        {
            value: function PopMatrix()
            {
                return _Stack.pop();
            }
        },
        Transform:
        {
            value: function Transform(transform)
            {
                FWGE.Maths.Matrix4.Set
                (
                    this.PeekMatrix(),
                    this.Shear
                    (
                        this.Scale
                        (
                            this.Rotate
                            (
                                this.Translate
                                (
                                    this.PeekMatrix(),
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
        Translate:
        {
            value: function Translate(matrix, translation)
            {
                return FWGE.Maths.Matrix4.Create
                (
                    matrix[0],  matrix[1],  matrix[2],  matrix[3],
                    matrix[4],  matrix[5],  matrix[6],  matrix[7],
                    matrix[8],  matrix[9], matrix[10], matrix[11],

                    matrix[0] * translation[0] + matrix[4] * translation[1] +  matrix[8] * translation[2] + matrix[12],
                    matrix[1] * translation[0] + matrix[5] * translation[1] +  matrix[9] * translation[2] + matrix[13],
                    matrix[2] * translation[0] + matrix[6] * translation[1] + matrix[10] * translation[2] + matrix[14],
                    matrix[3] * translation[0] + matrix[7] * translation[1] + matrix[11] * translation[2] + matrix[15]
                );
            }
        },
        RotateAround:
        {
            value: function RotateAround()
            {
                /* TODO */   
            }
        },
        Rotate:
        {
            value: function Rotate(matrix, rotation)
            {                    
                return FWGE.Maths.Matrix4.Mult
                (
                    FWGE.Maths.Matrix4.Create
                    (
                        1.0,                   0.0,                    0.0, 0.0,
                        0.0, Math.cos(rotation[0]), -Math.sin(rotation[0]), 0.0,
                        0.0, Math.sin(rotation[0]),  Math.cos(rotation[0]), 0.0,
                        0.0,                   0.0,                    0.0, 1.0
                    ),
                    FWGE.Maths.Matrix4.Mult
                    (
                        FWGE.Maths.Matrix4.Create
                        (
                             Math.cos(rotation[1]), 0.0, Math.sin(rotation[1]), 0.0,
                                               0.0, 1.0,                   0.0, 0.0,
                            -Math.sin(rotation[1]), 0.0, Math.cos(rotation[1]), 0.0,
                                               0.0, 0.0,                   0.0, 1.0
                        ),
                        FWGE.Maths.Matrix4.Mult
                        (
                            FWGE.Maths.Matrix4.Create
                            (
                                 Math.cos(rotation[2]), -Math.sin(rotation[2]), 0.0, 0.0,
                                 Math.sin(rotation[2]),  Math.cos(rotation[2]), 0.0, 0.0,
                                                   0.0,                    0.0, 1.0, 0.0,
                                                   0.0,                    0.0, 0.0, 1.0
                            ),
                            matrix
                        )
                    )
                );
            }
        },
        Scale:
        {
            value: function Scale(matrix, scalers)
            {                    
                return FWGE.Maths.Matrix4.Create
                (
                     matrix[0] * scalers[0],  matrix[1] * scalers[0],  matrix[2] * scalers[0],  matrix[3] * scalers[0],
                     matrix[4] * scalers[1],  matrix[5] * scalers[1],  matrix[6] * scalers[1],  matrix[7] * scalers[1],
                     matrix[8] * scalers[2],  matrix[9] * scalers[2], matrix[10] * scalers[2], matrix[11] * scalers[2],
                                 matrix[12],              matrix[13],              matrix[14],              matrix[15],
                                 matrix[12],              matrix[13],              matrix[14],              matrix[15]
                );
            }
        },
        Shear:
        {
            value: function Shear(matrix, angles)
            {
                var phi   = Math.radian(angles[0]);
                var theta = Math.radian(angles[1]);
                var rho   = Math.radian(angles[2]);

                return FWGE.Maths.Matrix4.Mult
                (
                    FWGE.Maths.Matrix4.Create
                    (
                                  1.0, 			   0.0, Math.tan(rho), 0.0,
                        Math.tan(phi), 			   1.0, 		  0.0, 0.0,
                                  0.0, Math.tan(theta), 		  1.0, 0.0,
                                  0.0, 			   0.0, 		  0.0, 1.0
                    ),
                    matrix
                );
            }
        }
    });
}

