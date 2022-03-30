export interface IDelay
{
    hours?: number
    minutes?: number
    seconds?: number
    milliseconds?: number
}

export function CalcuateDelay(delay:  IDelay): number
{
    return (delay.hours ?? 0) * 3_600_000
    + (delay.minutes ?? 0) * 60_000
    + (delay.seconds ?? 0) * 1_000
    + (delay.milliseconds ?? 0)
}