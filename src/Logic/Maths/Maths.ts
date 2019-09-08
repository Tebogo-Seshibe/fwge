const SIGNIFICANT_FIGURES = Math.pow(10, 6)

export { }

declare global
{
    interface Math
    {
        radian: (degree: number) => number
        cot: (degree: number) => number
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

Math.cot = (angle: number): number =>
{
    return 1 / Math.tan(angle)
}

Math.clamp = (value: number, min: number, max: number): number =>
{
    return Math.max(Math.min(value, max), min)
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
