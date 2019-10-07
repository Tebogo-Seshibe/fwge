const SIGNIFICANT_FIGURES = Math.pow(10, 5)

export { }

declare global
{
    interface Math
    {
        radian: (degree: number) => number
        cot: (radian: number) => number
        clamp: (value: number, min: number, max: number) => number
        randBetween: (min: number, max: number) => number
        clean: (value: number) => number
        isPowerOf2: (value: number) => boolean
        lerp: (from: number, to: number, time: number) => number
    }
}

Math.radian = (degree: number): number =>
{
    return Math.PI / 180 * degree
}

Math.cot = (radian: number): number =>
{
    return 1 / Math.tan(radian)
}

Math.clamp = (value: number, min: number, max: number): number =>
{
    return Math.min(max, Math.max(min, value))
}

Math.randBetween = (min: number, max: number): number =>
{
    return (Math.random() * max) + min
}

Math.clean = (value: number): number =>
{
    return Math.round(value * SIGNIFICANT_FIGURES) / SIGNIFICANT_FIGURES
}

Math.isPowerOf2 = (value: number): boolean =>
{
    return (value & (value - 1)) === 0
}

Math.lerp = (from: number, to: number, time: number) =>
{
    return from * (1 - time) + to * time
}
