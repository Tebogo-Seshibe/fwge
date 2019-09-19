import CircleCollider from "../Logic/Collision/CircleCollider";
import CubeCollider from "../Logic/Collision/CubeCollider";
import SphereCollider from "../Logic/Collision/SphereCollider";
import SquareCollider from "../Logic/Collision/SquareCollider";
import Vector2 from "../Logic/Maths/Vector2";
import Vector3 from "../Logic/Maths/Vector3";

export function CircleCircle(first: CircleCollider, second: CircleCollider): boolean
{
    return Vector2.Length(Vector2.Diff(first.Position, second.Position)) > first.Radius + second.Radius
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
    return Vector3.Length(Vector3.Diff(first.Position, second.Position)) < first.Radius + second.Radius
}

export function SphereCube(first: SphereCollider, second: CubeCollider): boolean
{
    return false
}

export function CubeCube(first: CubeCollider, second: CubeCollider): boolean
{
    return false
}
