import { Vector2, Vector3 } from "@fwge/common"
import { Game } from "@fwge/core"
import { Colour4, Mesh } from "@fwge/render"


export function configureMeshes(game: Game): void
{
    const meshLibrary = game.GetLibrary(Mesh)

    meshLibrary.Add(
        'Vertex Square',
        new Mesh(
        {
            dynamic: false,
            position:
            [
                new Vector3(-0.5, 0.5, 0.0),
                new Vector3(-0.5,-0.5, 0.0),
                new Vector3( 0.5,-0.5, 0.0),
                new Vector3(-0.5, 0.5, 0.0),
                new Vector3( 0.5,-0.5, 0.0),
                new Vector3( 0.5, 0.5, 0.0),
            ],
            colour: 
            [
                new Colour4(1.0),
                new Colour4(1.0),
                new Colour4(1.0),
                new Colour4(1.0),
                new Colour4(1.0),
                new Colour4(1.0),
            ],
            uv:
            [
                new Vector2(0.0, 1.0),
                new Vector2(0.0, 0.0),
                new Vector2(1.0, 0.0),
                new Vector2(0.0, 1.0),
                new Vector2(1.0, 0.0),
                new Vector2(1.0, 1.0),
            ],
            normal:
            [
                new Vector3(0.0, 0.0, 1.0),
                new Vector3(0.0, 0.0, 1.0),
                new Vector3(0.0, 0.0, 1.0),
                new Vector3(0.0, 0.0, 1.0),
                new Vector3(0.0, 0.0, 1.0),
                new Vector3(0.0, 0.0, 1.0),
            ],
        })
    )

    meshLibrary.Add(
        'Indexed Square',
        new Mesh(
        {
            dynamic: false,
            position:
            [
                new Vector3(-0.5,  0.5,  0.0),
                new Vector3(-0.5, -0.5,  0.0),
                new Vector3( 0.5, -0.5,  0.0),
                new Vector3( 0.5,  0.5,  0.0),
            ],
            colour:
            [
                new Colour4(1.0, 0.0, 0.0, 1.0),
                new Colour4(0.0, 1.0, 0.0, 1.0),
                new Colour4(0.0, 0.0, 1.0, 1.0),
                new Colour4(0.0, 1.0, 1.0, 1.0)
            ],
            normal:
            [
                new Vector3(0.0, 0.0, 1.0),
                new Vector3(0.0, 0.0, 1.0),
                new Vector3(0.0, 0.0, 1.0),
                new Vector3(0.0, 0.0, 1.0)
            ],
            uv:
            [
                new Vector2(0.0, 1.0),
                new Vector2(0.0, 0.0),
                new Vector2(1.0, 0.0),
                new Vector2(1.0, 1.0)
            ],
            index:
            [
                0, 1, 2,
                0, 2, 3
            ],
            wireframe:
            [
                0, 1,
                1, 2,
                2, 3,
                3, 0
            ]
        })
    )

    meshLibrary.Add(
        'Indexed Cube',
        new Mesh(
        {
            dynamic: false,
            position:
            [
                new Vector3(-0.5,  0.5,  0.5),
                new Vector3(-0.5, -0.5,  0.5),
                new Vector3( 0.5, -0.5,  0.5),
                new Vector3( 0.5,  0.5,  0.5),
                
                new Vector3( 0.5,  0.5,  0.5),
                new Vector3( 0.5, -0.5,  0.5),
                new Vector3( 0.5, -0.5, -0.5),
                new Vector3( 0.5,  0.5, -0.5),
                
                new Vector3( 0.5,  0.5, -0.5),
                new Vector3( 0.5, -0.5, -0.5),
                new Vector3(-0.5, -0.5, -0.5),
                new Vector3(-0.5,  0.5, -0.5),
                
                new Vector3(-0.5,  0.5, -0.5),
                new Vector3(-0.5, -0.5, -0.5),
                new Vector3(-0.5, -0.5,  0.5),
                new Vector3(-0.5,  0.5,  0.5),
                
                new Vector3(-0.5,  0.5, -0.5),
                new Vector3(-0.5,  0.5,  0.5),
                new Vector3( 0.5,  0.5,  0.5),
                new Vector3( 0.5,  0.5, -0.5),
                
                new Vector3(-0.5, -0.5,  0.5),
                new Vector3(-0.5, -0.5, -0.5),
                new Vector3( 0.5, -0.5, -0.5),
                new Vector3( 0.5, -0.5,  0.5),
            ],
            normal:
            [
                new Vector3( 0.0,  0.0, -1.0),
                new Vector3( 0.0,  0.0, -1.0),
                new Vector3( 0.0,  0.0, -1.0),
                new Vector3( 0.0,  0.0, -1.0),
                
                new Vector3( 1.0,  0.0,  0.0),
                new Vector3( 1.0,  0.0,  0.0),
                new Vector3( 1.0,  0.0,  0.0),
                new Vector3( 1.0,  0.0,  0.0),
                
                new Vector3( 0.0,  0.0,  1.0),
                new Vector3( 0.0,  0.0,  1.0),
                new Vector3( 0.0,  0.0,  1.0),
                new Vector3( 0.0,  0.0,  1.0),
                
                new Vector3(-1.0,  0.0,  0.0),
                new Vector3(-1.0,  0.0,  0.0),
                new Vector3(-1.0,  0.0,  0.0),
                new Vector3(-1.0,  0.0,  0.0),
                
                new Vector3( 0.0,  1.0,  0.0),
                new Vector3( 0.0,  1.0,  0.0),
                new Vector3( 0.0,  1.0,  0.0),
                new Vector3( 0.0,  1.0,  0.0),
                
                new Vector3( 0.0, -1.0,  0.0),
                new Vector3( 0.0, -1.0,  0.0),
                new Vector3( 0.0, -1.0,  0.0),
                new Vector3( 0.0, -1.0,  0.0),
            ],
            colour:
            [
                new Colour4(1.0, 0.0, 0.0, 1.0),
                new Colour4(1.0, 0.0, 0.0, 1.0),
                new Colour4(1.0, 0.0, 0.0, 1.0),
                new Colour4(1.0, 0.0, 0.0, 1.0),
                
                new Colour4(0.0, 1.0, 0.0, 1.0),
                new Colour4(0.0, 1.0, 0.0, 1.0),
                new Colour4(0.0, 1.0, 0.0, 1.0),
                new Colour4(0.0, 1.0, 0.0, 1.0),

                new Colour4(0.0, 0.0, 1.0, 1.0),
                new Colour4(0.0, 0.0, 1.0, 1.0),
                new Colour4(0.0, 0.0, 1.0, 1.0),
                new Colour4(0.0, 0.0, 1.0, 1.0),

                new Colour4(1.0, 1.0, 0.0, 1.0),
                new Colour4(1.0, 1.0, 0.0, 1.0),
                new Colour4(1.0, 1.0, 0.0, 1.0),
                new Colour4(1.0, 1.0, 0.0, 1.0),

                new Colour4(0.0, 1.0, 1.0, 1.0),
                new Colour4(0.0, 1.0, 1.0, 1.0),
                new Colour4(0.0, 1.0, 1.0, 1.0),
                new Colour4(0.0, 1.0, 1.0, 1.0),

                new Colour4(1.0, 0.0, 1.0, 1.0),
                new Colour4(1.0, 0.0, 1.0, 1.0),
                new Colour4(1.0, 0.0, 1.0, 1.0),
                new Colour4(1.0, 0.0, 1.0, 1.0),
            ],
            uv:
            [                
                new Vector2(0.0, 1.0),
                new Vector2(0.0, 0.0),
                new Vector2(1.0, 0.0),
                new Vector2(1.0, 1.0),

                new Vector2(0.0, 1.0),
                new Vector2(0.0, 0.0),
                new Vector2(1.0, 0.0),
                new Vector2(1.0, 1.0),

                new Vector2(0.0, 1.0),
                new Vector2(0.0, 0.0),
                new Vector2(1.0, 0.0),
                new Vector2(1.0, 1.0),

                new Vector2(0.0, 1.0),
                new Vector2(0.0, 0.0),
                new Vector2(1.0, 0.0),
                new Vector2(1.0, 1.0),

                new Vector2(0.0, 1.0),
                new Vector2(0.0, 0.0),
                new Vector2(1.0, 0.0),
                new Vector2(1.0, 1.0),

                new Vector2(0.0, 1.0),
                new Vector2(0.0, 0.0),
                new Vector2(1.0, 0.0),
                new Vector2(1.0, 1.0),
            ],
            index:
            [
                 0,  1,  2,  0,  2,  3,
                 4,  5,  6,  4,  6,  7,
                 8,  9, 10,  8, 10, 11,
                12, 13, 14, 12, 14, 15,
                16, 17, 18, 16, 18, 19,
                20, 21, 22, 20, 22, 23,
            ],
            wireframe:
            [
                 0,  1,  1,  2,  2,  3,  3,  0,
                 4,  5,  5,  6,  6,  7,  7,  4,
                 8,  9,  9, 10, 10, 11, 11,  8,
                12, 13, 13, 14, 14, 15, 15, 12,
                16, 17, 17, 18, 18, 19, 19, 16,
                20, 21, 21, 22, 22, 23, 23, 20,
            ]
        })
    )
}
