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
                    console.log(CircleCircle(curr, other))
                }
                else if (other instanceof SquareCollider)
                {
                    console.log(CircleSquare(curr, other))
                }
                else if (other instanceof SphereCollider)
                {
                    console.log(CircleSphere(curr, other))
                }
                else if (other instanceof CubeCollider)
                {
                    console.log(CircleCube(curr, other))
                }
            }
            else if (curr instanceof SquareCollider)
            {
                if (other instanceof CircleCollider)
                {
                    console.log(CircleSquare(other, curr))
                }
                else if (other instanceof SquareCollider)
                {
                    console.log(SquareSquare(curr, other))
                }
                else if (other instanceof SphereCollider)
                {
                    console.log(SquareSphere(curr, other))
                }
                else if (other instanceof CubeCollider)
                {
                    console.log(SquareCube(curr, other))
                }
            }
            else if (curr instanceof SphereCollider)
            {
                if (other instanceof CircleCollider)
                {
                    console.log(CircleSphere(other, curr))
                }
                else if (other instanceof SquareCollider)
                {
                    console.log(SquareSphere(other, curr))
                }
                else if (other instanceof SphereCollider)
                {
                    console.log(SphereSphere(curr, other))
                }
                else if (other instanceof CubeCollider)
                {
                    console.log(SphereCube(curr, other))
                }
            }
            else if (curr instanceof CubeCollider)
            {
                if (other instanceof CircleCollider)
                {
                    console.log(CircleCube(other, curr))
                }
                else if (other instanceof SquareCollider)
                {
                    console.log(SquareCube(other, curr))
                }
                else if (other instanceof SphereCollider)
                {
                    console.log(SphereCube(other, curr))
                }
                else if (other instanceof CubeCollider)
                {
                    console.log(CubeCube(curr, other))
                }
            }
        })
    })
}