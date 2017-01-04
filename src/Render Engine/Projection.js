function Projection()
{
    var _Camera = FWGE.Game.Maths.Matrix4.Identity();
    
    function Orthographic(left, right, top, bottom, near, far, theta, phi)
    {
        theta = Math.cot(Math.radian(theta));
        phi = Math.cot(Math.radian(phi));

        left -= near * theta;
        right -= near * theta;
        top -= near * phi;
        bottom -= near * phi;

        FWGE.Game.Maths.Matrix4.Set
        (
            _Camera,

                          2 / (right - left), 								 0, 		 			       0, 0,
                                           0, 				2 / (top - bottom), 		 			 	   0, 0,
                                        theta, 							   phi, 		   -2 / (far - near), 0,
            -(left + right) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1
        );
        
    }
    
    function Perspective(field_of_view, aspect_ratio, near, far)
    {
        var top = near * Math.tan(Math.radian(field_of_view));
        var right = top * aspect_ratio;
        
        var left = -right;
        var bottom = -top;
        var width = right - left;
        var height = top - bottom;
        var depth = far - near;

        console.log(left, right, top, bottom, height, depth);

        FWGE.Game.Maths.Matrix4.Set
        (
            _Camera,

                  2 * near / width,                       0,                         0,  0,
                                 0,       2 * near / height,                         0,  0,
            (right + left) / width, (top + bottom) / height,     -(far + near) / depth, -1,
                                 0,                       0, -(2 * far * near) / depth,  1
        );
    }
    
    Object.defineProperties(this,
    {
        ProjectionUpdate:
        {
            value: function ProjectionUpdate()
            {                            
                switch (FWGE.Game.Camera.Mode)
                {
                    case FWGE.Game.Camera.PERSPECTIVE:
                        Perspective
                        (
                            FWGE.Game.Camera.FOV,
                            FWGE.Game.Camera.Aspect,
                            FWGE.Game.Camera.Near,
                            FWGE.Game.Camera.Far
                        );
                    break;

                    case FWGE.Game.Camera.ORTHOGRAPHIC:
                        Orthographic
                        (
                            FWGE.Game.Camera.Left,
                            FWGE.Game.Camera.Right,
                            FWGE.Game.Camera.Top,
                            FWGE.Game.Camera.Bottom,
                            FWGE.Game.Camera.Near,
                            FWGE.Game.Camera.Far,
                            FWGE.Game.Camera.Theta,
                            FWGE.Game.Camera.Phi
                        );
                    break;
                }
            }
        },
        GetViewer:
        {
            value: function GetViewer()
            {
                return _Camera;
            }
        }
    });
}

