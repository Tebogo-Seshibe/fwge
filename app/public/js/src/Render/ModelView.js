import Maths from '../Maths/Maths';
import Matrix4 from '../Maths/Matrix4';
export default class ModelView {
    static Push(transform) {
        ModelView.Stack.push(this.Transform(transform));
        return ModelView.Peek();
    }
    static Peek() {
        if (ModelView.Stack.length === 0) {
            return Matrix4.IDENTITY;
        }
        else {
            return ModelView.Stack[ModelView.Stack.length - 1];
        }
    }
    static Pop() {
        if (ModelView.Stack.length === 0) {
            return Matrix4.IDENTITY;
        }
        else {
            return ModelView.Stack.pop();
        }
    }
    static Transform({ Position, Rotation, Scale, Shear }) {
        return this.Shear(this.Scale(this.Rotate(this.Translate(this.Peek(), Position), Rotation), Scale), Shear);
    }
    static Translate(matrix, translation) {
        return new Matrix4(matrix.M11, matrix.M12, matrix.M13, matrix.M14, matrix.M21, matrix.M22, matrix.M23, matrix.M24, matrix.M31, matrix.M32, matrix.M33, matrix.M34, matrix.M11 * translation.X + matrix.M21 * translation.Y + matrix.M31 * translation.Z + matrix.M41, matrix.M12 * translation.X + matrix.M22 * translation.Y + matrix.M32 * translation.Z + matrix.M42, matrix.M13 * translation.X + matrix.M23 * translation.Y + matrix.M33 * translation.Z + matrix.M43, matrix.M14 * translation.X + matrix.M24 * translation.Y + matrix.M34 * translation.Z + matrix.M44);
    }
    static Rotate(matrix, rotation) {
        let x = Maths.Radian(rotation.X);
        let y = Maths.Radian(rotation.Y);
        let z = Maths.Radian(rotation.Z);
        return new Matrix4(Math.cos(z), -Math.sin(z), 0.0, 0.0, Math.sin(z), Math.cos(z), 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0).Mult(Math.cos(y), 0.0, Math.sin(y), 0.0, 0.0, 1.0, 0.0, 0.0, -Math.sin(y), 0.0, Math.cos(y), 0.0, 0.0, 0.0, 0.0, 1.0).Mult(1.0, 0.0, 0.0, 0.0, 0.0, Math.cos(x), -Math.sin(x), 0.0, 0.0, Math.sin(x), Math.cos(x), 0.0, 0.0, 0.0, 0.0, 1.0).Mult(matrix);
    }
    static Scale(matrix, scalers) {
        return new Matrix4(matrix.M11 * scalers.X, matrix.M12 * scalers.X, matrix.M13 * scalers.X, matrix.M14 * scalers.X, matrix.M21 * scalers.Y, matrix.M22 * scalers.Y, matrix.M23 * scalers.Y, matrix.M24 * scalers.Y, matrix.M31 * scalers.Z, matrix.M32 * scalers.Z, matrix.M33 * scalers.Z, matrix.M34 * scalers.Z, matrix.M41, matrix.M42, matrix.M43, matrix.M44);
    }
    static Shear(matrix, angles) {
        var phi = Maths.Radian(angles.X);
        var theta = Maths.Radian(angles.Y);
        var rho = Maths.Radian(angles.Z);
        return new Matrix4(1.0, 0.0, Math.tan(rho), 0.0, Math.tan(phi), 1.0, 0.0, 0.0, 0.0, Math.tan(theta), 1.0, 0.0, 0.0, 0.0, 0.0, 1.0).Mult(matrix);
    }
}
ModelView.Stack = new Array();
//# sourceMappingURL=ModelView.js.map