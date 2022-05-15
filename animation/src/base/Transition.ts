export type ValueGetter<T> = () => T
export type Setter<T> = 
    ((this: T, other: T) => any) | 
    ((target: T, source: T) => any)
export type Transition<T> = (t: number, start: T, end: T, curr: T) => void