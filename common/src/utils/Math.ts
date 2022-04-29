export const DECIMAL_PLACES: number = 6
export const SIGNIFICANT_FIGURES: number = Math.pow(10, DECIMAL_PLACES)

export function radian(degree: number): number
{
    return Math.PI / 180 * degree
}

export function cot(radian: number): number
{
    return 1 / Math.tan(radian)
}

export function clamp(value: number, min: number, max: number): number
{
    return Math.min(max, Math.max(min, value))
}

export function randBetween(min: number, max: number): number
{
    return Math.random() * (max - min + 1) + min
}

export function clean(value: number): number
{
    return Math.round(value * SIGNIFICANT_FIGURES) / SIGNIFICANT_FIGURES
}

export function isPowerOf2(value: number): boolean
{
    return (value & (value - 1)) === 0
}

export function lerp(t: number, p0: number, p1: number): number
{
    return p0 + (t * (p1 - p0))
}

export function inverseLerp(min: number, max: number, value: number): number
{
    return (value - min) / (max - min)
}

export function remap(inputMin: number, inputMax: number, outputMin: number, outputMax: number, inputVal: number): number
{
    return lerp(outputMin, outputMax, inverseLerp(inputMin, inputMax, inputVal))
}

export function quadraticBezier(t: number, p0: number, p1: number, p2: number): number
{
    const a = lerp(p0, p1, t)
    const b = lerp(p1, p2, t)
    return lerp(a, b, t)
    // const t2 = t * t

    // p0 *= 
    // p1 *= 
    // p2 *= 

    // return p0 + p1 + p2
}

export function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number
{
    const t2 = t * t
    const t3 = t2 * t
    
    p0 *= -t3 + (3 * t2) - (3 * t) + 1
    p1 *= (3 * t3) - (6 * t2) + (3 * t)
    p2 *= (-3 * t3) + (3 * t2)
    p3 *= t3

    return p0 + p1 + p2 + p3
}

export function factorial(n: number): number
{
    if (n <= 1)
    {
        return 1
    }

    let value = n

    while (--n > 1)
    {
        value *= n
    }

    return value
}

export function combination(from: number, choose: number): number
{
    if (choose > from)
    {
        throw new Error('Choosing more than the maximum provided')
    }

    return factorial(from) / (factorial(choose) * factorial(from - choose))
}

export function permutation(from: number, permute: number): number
{
    if (permute > from)
    {
        throw new Error('Permuting more than the maximum provided')
    }

    return factorial(from) / factorial(from - permute)
}
