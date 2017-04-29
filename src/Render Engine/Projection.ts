export interface ICameraUpdate
{
    FOV?:       number;
    Aspect?:    number;
    Left?:      number;
    Right?:     number;
    Top?:       number;
    Bottom?:    number;
    Near?:      number;
    Far?:       number;
    Theta?:     number;
    Phi?:       number;
}

/**
 * @name Projection
 * @description This module handles the matrices regarding the camera's current
 *              view mode, and its orientation within the scene.
 * @module      FWGE.Render
 */
export class Projection
{
    public readonly ViewerMatrix: Matrix4;

    constructor()
    {
        this.ViewerMatrix = Matrix4.Identity;
    }
    
    private Orthographic(left: number, right: number, top: number, bottom: number, near: number, far: number, theta: number, phi: number): void
    {
        theta   = Maths.Cot(Maths.Radian(theta));
        phi     = Maths.Cot(Maths.Radian(phi));

        left    -= near * theta;
        right   -= near * theta;
        top     -= near * phi;
        bottom  -= near * phi;

        this.ViewerMatrix.Set
        (

                          2 / (right - left),                                0,                            0, 0,
                                           0,               2 / (top - bottom),                            0, 0,
                                       theta,                              phi,            -2 / (far - near), 0,
            -(left + right) / (right - left), -(top + bottom) / (top - bottom), -(far + near) / (far - near), 1
        );
        
    }
    
    private Perspective(field_of_view: number, aspect_ratio: number, near: number, far: number): void
    {
        var top     = near * Math.tan(Maths.Radian(field_of_view));
        var right   = top * aspect_ratio;
        
        var left    = -right;
        var bottom  = -top;
        var width   = right - left;
        var height  = top - bottom;
        var depth   = far - near;

        this.ViewerMatrix.Set
        (

                  2 * near / width,                       0,                         0,  0,
                                 0,       2 * near / height,                         0,  0,
            (right + left) / width, (top + bottom) / height,     -(far + near) / depth, -1,
                                 0,                       0, -(2 * far * near) / depth,  1
        );
    }
    
    public Update(mode: CameraMode, request: ICameraUpdate): void
    {                            
        switch (mode)
        {
            case CameraMode.PERSPECTIVE:
                this.Perspective
                (
                    request.FOV     ||  45,
                    request.Aspect  ||  16 / 9,
                    request.Near    ||  0.1,
                    request.Far     ||  1000.1
                );
            break;

            case CameraMode.ORTHOGRAPHIC:
                this.Orthographic
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
