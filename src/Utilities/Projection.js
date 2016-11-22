function Projection()
{
    var $ = this;
    var _Camera = FWGE.Maths.Matrix4.Identity();
    
    function Orthographic(left, right, top, bottom, near, far, theta, phi)
    {
        theta = Math.cot(Math.radian(theta));
        phi = Math.cot(Math.radian(phi));

        left -= near * theta;
        right -= near * theta;
        top -= near * phi;
        bottom -= near * phi;

        FWGE.Maths.Matrix4.Set
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

        FWGE.Maths.Matrix4.Set
        (
            _Camera,

                  2 * near / width,                       0,                         0,  0,
                                 0,       2 * near / height,                         0,  0,
            (right + left) / width, (top + bottom) / height,     -(far + near) / depth, -1,
                                 0,                       0, -(2 * far * near) / depth,  1
        );
    }
    
    Object.defineProperties($,
    {
        ProjectionUpdate:
        {
            value: function ProjectionUpdate()
            {                            
                switch (FWGE.Render.Camera.Mode)
                {
                    case FWGE.Render.Camera.PERSPECTIVE:
                        Perspective
                        (
                            FWGE.Render.Camera.FOV,
                            FWGE.Render.Camera.Aspect,
                            FWGE.Render.Camera.Near,
                            FWGE.Render.Camera.Far
                        );
                    break;

                    case FWGE.Render.Camera.ORTHOGRAPHIC:
                        Orthographic
                        (
                            FWGE.Render.Camera.Left,
                            FWGE.Render.Camera.Right,
                            FWGE.Render.Camera.Top,
                            FWGE.Render.Camera.Bottom,
                            FWGE.Render.Camera.Near,
                            FWGE.Render.Camera.Far,
                            FWGE.Render.Camera.Theta,
                            FWGE.Render.Camera.Phi
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

