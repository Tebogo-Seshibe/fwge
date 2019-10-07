import CircleCollider from "../Logic/Collision/CircleCollider";
import { Colliders } from "../Logic/Collision/Collider";
import CubeCollider from "../Logic/Collision/CubeCollider";
import SphereCollider from "../Logic/Collision/SphereCollider";
import SquareCollider from "../Logic/Collision/SquareCollider";
import { 
    CircleCircle,
    CircleCube,
    CircleSphere,
    CircleSquare,
    CubeCube,
    SphereCube,
    SphereSphere,
    SquareCube,
    SquareSphere,
    SquareSquare
} from "./CollisionDetection";
import { Equation } from "../Logic/Maths/Equation";

export const GRAVITY: number = 9.81

export const Force: Equation = (mass) => GRAVITY * mass 

export function UpdatePhysics(): void
{
    let colliders = [...Colliders]
    
    colliders.forEach((curr, _, arr) =>
    {
        let others = arr.filter(c => c !== curr)
        
        others.forEach(other =>
        {
            if (curr instanceof CircleCollider)
            {
                if (other instanceof CircleCollider)
                {
                    CircleCircle(curr, other)
                }
                else if (other instanceof SquareCollider)
                {
                    CircleSquare(curr, other)
                }
                else if (other instanceof SphereCollider)
                {
                    CircleSphere(curr, other)
                }
                else if (other instanceof CubeCollider)
                {
                    CircleCube(curr, other)
                }
            }
            else if (curr instanceof SquareCollider)
            {
                if (other instanceof CircleCollider)
                {
                    CircleSquare(other, curr)
                }
                else if (other instanceof SquareCollider)
                {
                    SquareSquare(curr, other)
                }
                else if (other instanceof SphereCollider)
                {
                    SquareSphere(curr, other)
                }
                else if (other instanceof CubeCollider)
                {
                    SquareCube(curr, other)
                }
            }
            else if (curr instanceof SphereCollider)
            {
                if (other instanceof CircleCollider)
                {
                    CircleSphere(other, curr)
                }
                else if (other instanceof SquareCollider)
                {
                    SquareSphere(other, curr)
                }
                else if (other instanceof SphereCollider)
                {
                    SphereSphere(curr, other)
                }
                else if (other instanceof CubeCollider)
                {
                    SphereCube(curr, other)
                }
            }
            else if (curr instanceof CubeCollider)
            {
                if (other instanceof CircleCollider)
                {
                    CircleCube(other, curr)
                }
                else if (other instanceof SquareCollider)
                {
                    SquareCube(other, curr)
                }
                else if (other instanceof SphereCollider)
                {
                    SphereCube(other, curr)
                }
                else if (other instanceof CubeCollider)
                {
                    CubeCube(curr, other)
                }
            }
        })
    })
}