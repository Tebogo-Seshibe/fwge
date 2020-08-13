export const DECIMAL_PLACES: number = 5
export const SIGNIFICANT_FIGURES: number = Math.pow(10, DECIMAL_PLACES)

export const radian = (degree: number): number =>
{
    return Math.PI / 180 * degree
}

export const cot = (radian: number): number =>
{
    return 1 / Math.tan(radian)
}

export const clamp = (value: number, min: number, max: number): number =>
{
    return Math.min(max, Math.max(min, value))
}

export const randBetween = (min: number, max: number): number =>
{
    return (Math.random() * max) + min
}

export const clean = (value: number): number =>
{
    return Math.round(value * SIGNIFICANT_FIGURES) / SIGNIFICANT_FIGURES
}

export const isPowerOf2 = (value: number): boolean =>
{
    return (value & (value - 1)) === 0
}

export const lerp = (from: number, to: number, time: number): number =>
{
    return from * (1 - time) + to * time
}
