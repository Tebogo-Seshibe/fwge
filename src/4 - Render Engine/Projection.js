/**
 * @name Projection
 * @description This module handles the matrices regarding the camera's current
 *              view mode, and its orientation within the scene.
 * @module      FWGE.Render
 */

let Projection = (function()
{
    function Projection()
    {
        let self = this;

        function _Orthographic(left, right, top, bottom, near, far, theta, phi)
        {
            theta   = Maths.Cot(Maths.Radian(theta));
            phi     = Maths.Cot(Maths.Radian(phi));

            left    -= near * theta;
            right   -= near * theta;
            top     -= near * phi;
            bottom  -= near * phi;

            self.ViewerMatrix.Set
            (

                            2 / (right - left),                                0,                            0, 0,
                                            0,               2 / (top - bottom),                            0, 0,
                                        theta,                              phi,            -2 / (far - near), 0,
                -(left + right) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1
            );
            
        }
        
        function _Perspective(field_of_view, aspect_ratio, near, far)
        {
            var top     = near * Math.tan(Maths.Radian(field_of_view));
            var right   = top * aspect_ratio;
            
            var left    = -right;
            var bottom  = -top;
            var width   = right - left;
            var height  = top - bottom;
            var depth   = far - near;

            self.ViewerMatrix.Set
            (

                    2 * near / width,                       0,                         0,  0,
                                    0,       2 * near / height,                         0,  0,
                (right + left) / width, (top + bottom) / height,     -(far + near) / depth, -1,
                                    0,                       0, -(2 * far * near) / depth,  1
            );
        }
        Object.defineProperties(this,
        {
            ViewerMatrix: { value: Matrix4.Identity, configurable: false, enumerable: true, writable: true },
            
            
            Update:
            {
                value: function Update(mode, request)
                {                            
                    switch (mode)
                    {
                        case CameraMode.PERSPECTIVE:
                            _Perspective
                            (
                                request.FOV     ||  45,
                                request.Aspect  ||  16 / 9,
                                request.Near    ||  0.1,
                                request.Far     ||  1000.1
                            );
                        break;

                        case CameraMode.ORTHOGRAPHIC:
                            _Orthographic
                            (
                                request.Left    || -10,
                                request.Right   ||  10,
                                request.Top     ||  10,
                                request.Bottom  || -10,
                                request.Near    ||  0,
                                request.Far     ||  20,
                                request.Theta   ||  90,
                                request.Phi     ||  90
                            );
                        break;
                    }
                }
            }
        });
    }

    Projection.prototype = Object.create(null);

    return new Projection();
})();
Object.seal(Projection);