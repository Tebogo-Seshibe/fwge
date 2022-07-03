import { Vector3 } from "@fwge/common";
import { MeshCollider } from "@fwge/physics";

export const cubeCollier = () => new MeshCollider(
{
    vertices: [
        new Vector3(-0.5,  0.5,  0.5 ),
        new Vector3(-0.5, -0.5,  0.5 ),
        new Vector3( 0.5, -0.5,  0.5 ),
        new Vector3( 0.5,  0.5,  0.5 ),
    
        new Vector3(-0.5,  0.5,  -0.5 ),
        new Vector3(-0.5, -0.5,  -0.5 ),
        new Vector3( 0.5, -0.5,  -0.5 ),
        new Vector3( 0.5,  0.5,  -0.5 ),
    ],
    outline: [
        0,1, 1,2, 2,3, 3,0, // FRONT
        4,5, 5,6, 6,7, 7,4, // BACK
        4,0, 0,3, 3,7, 7,4, // TOP
        1,5, 5,6, 6,2, 2,1, // BOTTOM
        4,5, 5,1, 1,0, 0,4, // LEFT
        3,2, 2,6, 6,7, 7,3, // RIGHT
    ],
    isStatic: false,
    position: Vector3.Zero
})

