function Maths()
{
    Object.defineProperties(this,
    {
        Matrix2:      { value: new Matrix2() },
        Matrix3:      { value: new Matrix3() },
        Matrix4:      { value: new Matrix4() },
        Vector2:      { value: new Vector2() },
        Vector3:      { value: new Vector3() },
        Vector4:      { value: new Vector4() },
        Quaternion:   { value: new Quaternion() }
    });
};

