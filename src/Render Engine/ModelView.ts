/**
 * @name        ModelView
 * @description This module handles the model view matrices of the
 *              objects within the scene by applying the appropriate
 *              transformations.
 */
export class ModelView
{
    private Stack: Array<Matrix4>;

    constructor()
    {
        this.Stack = new Array<Matrix4>();
    }
    
    /**
     * @function    PushMatrix: void
     * @description Pushes a copy of the last matrix onto the stack. If the stack is
     *              currently empty, an identity matrix is pushed.
     */
    public Push(): Matrix4
    {
        let matrix = this.Peek();
        this.Stack.push(matrix/*.Identity()*/);
        return matrix;
    }

    /**
     * @function    PeekMatrix: {Float32Array}
     * @description Returns the matrix on the top of the stack. If the stack
     *              is empty, an identity matrix is returned.
     */
    public Peek(): Matrix4
    {
        if (this.Stack.length === 0)
            return (new Matrix4()).Set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);
        else
            return this.Stack[this.Stack.length - 1];
    }

    /**
     * @function    PopMatrix: {Float32Array}
     * @description Returns and removes the matrix on the top os the stack.
     */
    public Pop(): Matrix4 | undefined
    {
        if (this.Stack.length === 0)
            return new Matrix4().Identity();
        else
            return this.Stack.pop();
    }

    /**
     * @function    Transform: void
     * @description Performs the appropriate matrix operations for the different
     *              transformations on the the top matrix.
     * @param       transform: {Transform}
     */
    public Transform(transform: Transform): void
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

    /**
     * @function    Translate: {Float32Array}
     * @description Returns a translation matrix.
     * @param       matrix:         {Float32Array}
     * @param       translation:    {Float32Array}
     */
    private Translate(matrix: Matrix4, translation: Vector3): Matrix4
    {
        return matrix.Set
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

    /**
     * @function    Translate: {Float32Array}
     * @description Returns a rotation matrix.
     * @param       matrix:     {Float32Array}
     * @param       rotation:   {Float32Array}
     */
    private Rotate(matrix: Matrix4, rotation: Vector3): Matrix4
    {    
        var rot: Matrix4 = new Matrix4().Identity();
        let x = Maths.Radian(rotation.X);
        let y = Maths.Radian(rotation.Y);
        let z = Maths.Radian(rotation.Z);

        matrix.Set
        (
            rot.Mult(
                Math.cos(z), -Math.sin(z), 0.0, 0.0,
                Math.sin(z),  Math.cos(z), 0.0, 0.0,
                                0.0,                    0.0, 1.0, 0.0,
                                0.0,                    0.0, 0.0, 1.0
            ).Mult(
                Math.cos(y), 0.0, Math.sin(y), 0.0,
                                0.0, 1.0,                   0.0, 0.0,
            -Math.sin(y), 0.0, Math.cos(y), 0.0,
                                0.0, 0.0,                   0.0, 1.0

            ).Mult(
            
                1.0,                   0.0,                    0.0, 0.0,
                0.0, Math.cos(x), -Math.sin(x), 0.0,
                0.0, Math.sin(x),  Math.cos(x), 0.0,
                0.0,                   0.0,                    0.0, 1.0
            ).Mult(matrix)
        );

        return matrix;
    }

    /**
     * @function    Translate: {Float32Array}
     * @description Returns a scaler matrix.
     * @param       matrix:     {Float32Array}
     * @param       scalers:    {Float32Array}
     */
    private Scale(matrix: Matrix4, scalers: Vector3): Matrix4
    {                    
        return matrix.Set
        (
            matrix.M11 * scalers.X, matrix.M12 * scalers.X, matrix.M13 * scalers.X, matrix.M14 * scalers.X,
            matrix.M21 * scalers.Y, matrix.M22 * scalers.Y, matrix.M23 * scalers.Y, matrix.M24 * scalers.Y,
            matrix.M31 * scalers.Z, matrix.M32 * scalers.Z, matrix.M33 * scalers.Z, matrix.M34 * scalers.Z,
                        matrix.M41,             matrix.M42,             matrix.M43,             matrix.M44
        );
    }

    /**
     * @function    Shear: {Float32Array}
     * @description Returns a shearing matrix.
     * @param       matrix:    {Float32Array}
     * @param       angles:    {Float32Array}
     */
    private Shear(matrix: Matrix4, angles: Vector3): Matrix4
    {
        var phi   = Maths.Radian(angles.X);
        var theta = Maths.Radian(angles.Y);
        var rho   = Maths.Radian(angles.Z);

        return new Matrix4().Set
        (
                      1.0,             0.0, Math.tan(rho), 0.0,
            Math.tan(phi),             1.0,           0.0, 0.0,
                      0.0, Math.tan(theta),           1.0, 0.0,
                      0.0,             0.0,           0.0, 1.0
        ).Mult(matrix);
    }
}
