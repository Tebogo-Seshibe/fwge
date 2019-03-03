const SIGNIFICANT_FIGURES = Math.pow(10, 6)

export default class Maths
{
    static Radian(degree: number): number 
    {
        return Math.PI / 180 * degree
    }

    static Cot(angle: number): number 
    {
        return 1 / Math.tan(angle)
    }

    static Clamp(value: number, min: number, max: number): number 
    {
        return Math.max(Math.min(value, max), min)
    }

    static CleanFloat(value: number): number
    {
        return (Math.round(value * SIGNIFICANT_FIGURES) / SIGNIFICANT_FIGURES)
    }
}