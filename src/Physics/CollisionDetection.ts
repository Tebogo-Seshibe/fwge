import CircleCollider from "./Collision/CircleCollider";
import Collider from "./Collision/Collider";
import CubeCollider from "./Collision/CubeCollider";
import SphereCollider from "./Collision/SphereCollider";
import SquareCollider from "./Collision/SquareCollider";

export function IsColission(first: Collider, second: Collider): boolean
{
    if (first instanceof CircleCollider)
    {
        if (second instanceof CircleCollider)
        {
            return CircleCircle(first, second)
        }

        if (second instanceof SquareCollider)
        {
            return CircleSquare(first, second)
        }
        
        if (second instanceof SphereCollider)
        {
            return CircleSphere(first, second)
        }
        
        if (second instanceof CubeCollider)
        {
            return CircleCube(first, second)
        }
    }

    if (first instanceof SquareCollider)
    {
        if (second instanceof CircleCollider)
        {
            return CircleSquare(second, first)
        }
        
        if (second instanceof SquareCollider)
        {
            return SquareSquare(first, second)
        }

        if (second instanceof SphereCollider)
        {
            return SquareSphere(first, second)
        }
        
        if (second instanceof CubeCollider)
        {
            return SquareCube(first, second)
        }
    }

    if (first instanceof SphereCollider)
    {
        if (second instanceof CircleCollider)
        {
            return CircleSphere(second, first)
        }
        
        if (second instanceof SquareCollider)
        {
            return SquareSphere(second, first)
        }
        
        if (second instanceof SphereCollider)
        {
            return SphereSphere(first, second)
        }
        
        if (second instanceof CubeCollider)
        {
            return SphereCube(first, second)
        }
    }

    if (first instanceof CubeCollider)
    {
        if (second instanceof CircleCollider)
        {
            return CircleCube(second, first)
        }
        
        if (second instanceof SquareCollider)
        {
            return SquareCube(second, first)
        }
        
        if (second instanceof SphereCollider)
        {
            return SphereCube(second, first)
        }
        
        if (second instanceof CubeCollider)
        {
            return CubeCube(first, second)
        }
    }

    return false
}

export function CircleCircle(first: CircleCollider, second: CircleCollider): boolean
{
    return first.Position.Clone().Diff(second.Position).Length < first.Radius + second.Radius
}

export function CircleSquare(first: CircleCollider, second: SquareCollider): boolean
{
    return false
}

export function CircleSphere(first: CircleCollider, second: SphereCollider): boolean
{
    return false
}

export function CircleCube(first: CircleCollider, second: CubeCollider): boolean
{
    return false
}

export function SquareSquare(first: SquareCollider, second: SquareCollider): boolean
{
    return false
}

export function SquareSphere(first: SquareCollider, second: SphereCollider): boolean
{
    return false
}

export function SquareCube(first: SquareCollider, second: CubeCollider): boolean
{
    return false
}

export function SphereSphere(first: SphereCollider, second: SphereCollider): boolean
{
    return first.Position.Clone().Diff(second.Position).Length < first.Radius + second.Radius
}

export function SphereCube(first: SphereCollider, second: CubeCollider): boolean
{
    return false
}

export function CubeCube(first: CubeCollider, second: CubeCollider): boolean
{
    return false
}
