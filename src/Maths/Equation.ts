export type Equation = (...x: number[]) => number

export enum UnaryExpressionType
{
    NONE,
    INVERSE,
    NEGATION,
    SIN,
    COSINE,
    TANGENT
}

export enum BinaryExpressionType
{
    ADDITION,
    SUBTRACTION,
    DIVISION,
    MULTIPLICATION,
    POWER,
    ROOT,
    LOGARITHMIC
}

export function Var(variable: number): Equation | undefined
{
    return (...x: number[]) => x[variable]
}

export function Unary(type: UnaryExpressionType, arg: Equation | number): Equation | undefined
{
    switch (type)
    {
        case UnaryExpressionType.NONE:
            return (...x: number[]) => typeof arg === 'number' ? arg : arg(...x)

        case UnaryExpressionType.INVERSE:
            return (...x: number[]) => 1 / (typeof arg === 'number' ? arg : arg(...x))

        case UnaryExpressionType.NEGATION:
            return (...x: number[]) => -(typeof arg === 'number' ? arg : arg(...x))

        case UnaryExpressionType.SIN:
            return (...x: number[]) => Math.sin(typeof arg === 'number' ? arg : arg(...x))
                
        case UnaryExpressionType.COSINE:
            return (...x: number[]) => Math.cos(typeof arg === 'number' ? arg : arg(...x))
                
        case UnaryExpressionType.TANGENT:
            return (...x: number[]) => Math.tan(typeof arg === 'number' ? arg : arg(...x))
                
        default:
            return undefined
    }
}

export function Binary(type: BinaryExpressionType, left: Equation | number, right: Equation | number): Equation | undefined
{
    switch (type)
    {
        case BinaryExpressionType.ADDITION:
            return (...x: number[]) => (typeof left === 'number' ? left : left(...x)) + (typeof right === 'number' ? right : right(...x))
            
        case BinaryExpressionType.SUBTRACTION:
            return (...x: number[]) => (typeof left === 'number' ? left : left(...x)) - (typeof right === 'number' ? right : right(...x))
                            
        case BinaryExpressionType.MULTIPLICATION:
            return (...x: number[]) => (typeof left === 'number' ? left : left(...x)) * (typeof right === 'number' ? right : right(...x))
                            
        case BinaryExpressionType.DIVISION:
            return (...x: number[]) => (typeof left === 'number' ? left : left(...x)) / (typeof right === 'number' ? right : right(...x))
            
        case BinaryExpressionType.POWER:
            return (...x: number[]) => (typeof left === 'number' ? left : left(...x)) ** (typeof right === 'number' ? right : right(...x))
        
        case BinaryExpressionType.ROOT:
            return (...x: number[]) => (typeof left === 'number' ? left : left(...x)) ** (1 / (typeof right === 'number' ? right : right(...x)))

        default: 
            return undefined
    }
}
