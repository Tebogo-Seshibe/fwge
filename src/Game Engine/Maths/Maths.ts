import { Matrix2 } from './Matrix2';
import { Matrix3 } from './Matrix3';
import { Matrix4 } from './Matrix4';
import { Vector2 } from './Vector2';
import { Vector3 } from './Vector3';
import { Vector4 } from './Vector4';
import { Quaternion } from './Quaternion';

/**
 * @name Maths
 * @description This module contains the methods required for matrix and vector
 *              operations.
 * @module      FWGE.Game
 */
export class Maths
{
    
    public static Radian(degree: number) { return Math.PI / 180 * degree; }
    public static Cot(angle: number) { return 1 / Math.tan(angle)}
    public static Clamp(value: number, min: number, max: number)  { return Math.max(Math.min(value, max), min); }
    
    /**
     * @property    Matrix2: {Matrix2} [read]
     * @description Operations for 2x2 matrices.
     * @see         FWGE.Maths.Matrix2
     */
    public Matrix2(...args: any[]): Matrix2
    {
        return new Matrix2().Set(args);
    }
    
    /**
     * @property    Matrix3: {Matrix3} [read]
     * @description Operations for 3x3 matrices.
     * @see         FWGE.Maths.Matrix3
     */
    public Matrix3(...args: any[]): Matrix3
    {
        return new Matrix3().Set(args);
    }
    
    /**
     * @property    Matrix4: {Matrix4} [read]
     * @description Operations for 4x4 matrices.
     * @see         FWGE.Maths.Matrix4
     */
    public Matrix4(...args: any[]): Matrix4
    {
        return new Matrix4().Set(args);
    }
    
    /**
     * @property    Vector2: {Vector2} [read]
     * @description Operations for 2 component veectors.
     * @see         FWGE.Maths.Vector2
     */
    public Vector2(...args: any[]): Vector2
    {
        return new Vector2().Set(args);
    }
    
    /**
     * @property    Vector3: {Vector3} [read]
     * @description Operations for 3 component veectors.
     * @see         FWGE.Maths.Vector3
     */
    public Vector3(...args: any[]): Vector3
    {
        return new Vector3().Set(args);
    }
    
    /**
     * @property    Vector4: {Vector4} [read]
     * @description Operations for 4 component veectors.
     * @see         FWGE.Maths.Vector4
     */
    public Vector4(...args: any[]): Vector4
    {
        return new Vector4().Set(args);
    }
    
    /**
     * @property    Quaternion: {Quaternion} [read]
     * @description Operations for 4 component quaternions.
     * @see         FWGE.Maths.Quaternion
     */
    public Quaternion()
    {
        return new Quaternion();
    }  
}
