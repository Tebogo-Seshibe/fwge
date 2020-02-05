import CircleCollider from "./Collision/CircleCollider";
import { Colliders } from "./Collision/Collider";
import CubeCollider from "./Collision/CubeCollider";
import SphereCollider from "./Collision/SphereCollider";
import SquareCollider from "./Collision/SquareCollider";
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
    SquareSquare,
    IsColission
} from "./CollisionDetection";
import { Equation } from "../Logic/Maths/Equation";
import IEngine from '../IEngine'

export default class PhysicsEngine implements IEngine
{
    public Init(): void 
    {
        throw new Error("Method not implemented.");
    }

    public Update(): void
    {
        throw new Error("Method not implemented.");
    }

    public Reset(): void
    {
        throw new Error("Method not implemented.");
    }
}


export const GRAVITY: number = 9.81

export const Force: Equation = (mass) => GRAVITY * mass 

export function UpdatePhysics(delta: number): void
{
    let colliders = [...Colliders]
    
    colliders.forEach((curr, _, arr) =>
    {
        let others = arr.filter(c => c !== curr)
        
        others.forEach(other => IsColission(curr, other))
    })
}