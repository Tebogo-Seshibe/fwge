export const DECIMAL_PLACES: number = 6
export const SIGNIFICANT_FIGURES: number = Math.pow(10, DECIMAL_PLACES)

export class Maths implements Math
{
    [Symbol.toStringTag](): string {
        return Math[Symbol.toStringTag]
    }

    static readonly E: number = Math.E
    static readonly LN10: number = Math.LN10
    static readonly LN2: number = Math.LN2
    static readonly LOG2E: number = Math.LOG2E
    static readonly LOG10E: number = Math.LOG10E
    static readonly PI: number = Math.PI
    static readonly SQRT1_2: number = Math.SQRT1_2
    static readonly SQRT2: number = Math.SQRT2

    static abs: (x: number) => number = Math.abs
    static acos: (x: number) => number = Math.acos
    static asin: (x: number) => number = Math.asin
    static atan: (x: number) => number = Math.atan
    static atan2: (y: number, x: number) => number = Math.atan2
    static ceil: (x: number) => number = Math.ceil
    static cos: (x: number) => number = Math.cos
    static exp: (x: number) => number = Math.exp
    static floor: (x: number) => number = Math.floor
    static log: (x: number) => number = Math.log
    static max: (...values: number[]) => number = Math.max
    static min: (...values: number[]) => number = Math.min
    static pow: (x: number, y: number) => number = Math.pow
    static random: () => number = Math.random
    static round: (x: number) => number = Math.round
    static sin: (x: number) => number = Math.sin
    static sqrt: (x: number) => number = Math.sqrt
    static tan: (x: number) => number = Math.tan
    static clz32: (x: number) => number = Math.clz32
    static imul: (x: number, y: number) => number = Math.imul
    static sign: (x: number) => number = Math.sign
    static log10: (x: number) => number = Math.log10
    static log2: (x: number) => number = Math.log2
    static log1p: (x: number) => number = Math.log1p
    static expm1: (x: number) => number = Math.expm1
    static cosh: (x: number) => number = Math.cosh
    static sinh: (x: number) => number = Math.sinh
    static tanh: (x: number) => number = Math.tanh
    static acosh: (x: number) => number = Math.acosh
    static asinh: (x: number) => number = Math.asinh
    static atanh: (x: number) => number = Math.atanh
    static hypot: (...values: number[]) => number = Math.hypot
    static trunc: (x: number) => number = Math.trunc
    static fround: (x: number) => number = Math.fround
    static cbrt: (x: number) => number = Math.cbrt
    
    static radian: (degree: number) => number = (degree: number) =>
    {
        return Math.PI / 180 * degree
    }

    static cot: (radian: number) => number = (radian: number) =>
    {
        return 1 / Math.tan(radian)
    }

    static clamp: (value: number, min: number, max: number) => number = (value: number, min: number, max: number) =>
    {
        if (value < min)
        {
            return min
        }
        else if (value > max)
        {
            return max
        }
        else
        {
            return value
        }
    }

    static randBetween: (min: number, max: number) => number = (min: number, max: number) =>
    {
        return Math.random() * (max - min + 1) + min
    }

    static clean: (value: number) => number = (value: number) =>
    {
        return Math.round(value * SIGNIFICANT_FIGURES) / SIGNIFICANT_FIGURES
    }

    static isPowerOf2: (value: number) => boolean = (value: number) =>
    {
        return (value & (value - 1)) === 0
    }

    static lerp: (t: number, p0: number, p1: number) => number = (t: number, p0: number, p1: number) =>
    {
        return p0 + (t * (p1 - p0))
    }

    static lerpSquared: (t: number, p0: number, p1: number) => number = (t: number, p0: number, p1: number) =>
    {
        return p0 + ((t**2) * (p1 - p0))
    }

    static readonly lerpSqrt: (t: number, p0: number, p1: number) => number = (t: number, p0: number, p1: number) =>
    {
        return p0 + (Math.sqrt(t) * (p1 - p0))
    }

    static smoothstep: (t: number, p0: number, p1: number) => number = (t: number, p0: number, p1: number) =>
    {
        if (t < 0)
        {
            return 0
        }
        else if (t > 1)
        {
            return 1
        }
        else
        {
            t = (t - p0) / (p1 - p0)
            return t * t * (3 - 2 * t)
        }
    }

    static smootherstep: (t: number, p0: number, p1: number) => number = (t: number, p0: number, p1: number) =>
    {
        t = clamp((t - p0) / (p1 - p0), 0, 1)
        return t * t * t * (t * (t * 6 - 15) + 10)
    }

    static inverseLerp: (p: number, p0: number, p1: number) => number = (p: number, p0: number, p1: number) =>
    {
        return (p - p0) / (p1 - p0)
    }

    static remap: (p: number, p0: number, p1: number, q0: number, q1: number) => number = (p: number, p0: number, p1: number, q0: number, q1: number) =>
    {
        return lerp(inverseLerp(p, p0, p1), q0, q1)
    }

    static quadraticBezier: (t: number, p0: number, p1: number, p2: number) => number = (t: number, p0: number, p1: number, p2: number) =>
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

    static cubicBezier: (t: number, p0: number, p1: number, p2: number, p3: number) => number = (t: number, p0: number, p1: number, p2: number, p3: number): number =>
    {
        const t2 = t * t
        const t3 = t2 * t
        
        p0 *= -t3 + (3 * t2) - (3 * t) + 1
        p1 *= (3 * t3) - (6 * t2) + (3 * t)
        p2 *= (-3 * t3) + (3 * t2)
        p3 *= t3

        return p0 + p1 + p2 + p3
    }

    static factorial: (n: number) => number = (n: number): number =>
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

    static combination: (from: number, choose: number) => number = (from: number, choose: number): number =>
    {
        if (choose > from)
        {
            throw new Error('Choosing more than the maximum provided')
        }

        return factorial(from) / (factorial(choose) * factorial(from - choose))
    }

    static permutation: (from: number, permute: number) => number = (from: number, permute: number): number =>
    {
        if (permute > from)
        {
            throw new Error('Permuting more than the maximum provided')
        }

        return factorial(from) / factorial(from - permute)
    }

}


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
    if (value < min)
    {
        return min
    }
    else if (value > max)
    {
        return max
    }
    else
    {
        return value
    }
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

export function lerpSquared(t: number, p0: number, p1: number): number
{
    return p0 + ((t**2) * (p1 - p0))
}

export function lerpSqrt(t: number, p0: number, p1: number): number
{
    return p0 + (Math.sqrt(t) * (p1 - p0))
}

export function smoothstep(t: number, p0: number, p1: number): number
{
    if (t < 0)
    {
        return 0
    }
    else if (t > 1)
    {
        return 1
    }
    else
    {
        t = (t - p0) / (p1 - p0)
        return t * t * (3 - 2 * t)
    }
}

export function smootherstep(t: number, p0: number, p1: number): number
{
    t = clamp((t - p0) / (p1 - p0), 0, 1)
    return t * t * t * (t * (t * 6 - 15) + 10)
}

export function inverseLerp(p: number, p0: number, p1: number): number
{
    return (p - p0) / (p1 - p0)
}

export function remap(p: number, p0: number, p1: number, q0: number, q1: number): number
{
    return lerp(inverseLerp(p, p0, p1), q0, q1)
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

Maths.cos