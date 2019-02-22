/**
 * @name Maths
 * @description This module contains the methods required for matrix and vector
 *              operations.
 * @module      FWGE.Game
 */

export default class Maths
{
    Radian(degree: number): number 
    {
        return Math.PI / 180 * degree
    }

    Cot(angle: number): number 
    {
        return 1 / Math.tan(angle)
    }

    Clamp(value: number, min, max): number 
    {
        return Math.max(Math.min(value, max), min)
    }
}