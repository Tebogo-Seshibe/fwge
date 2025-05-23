import { IMesh } from "@fwge/core";

export const tetrominoO: IMesh =
{
    name: 'O',

    position:
    [

        [-1.0,  1.0,  0.0],
        [-1.0,  0.0,  0.0],
        [-1.0, -1.0,  0.0],

        [ 0.0,  1.0,  0.0],
        [ 0.0,  0.0,  0.0],
        [ 0.0, -1.0,  0.0],

        [ 1.0,  1.0,  0.0],
        [ 1.0,  0.0,  0.0],
        [ 1.0, -1.0,  0.0],
    ],
    index:
    [
        0,1,4,
        0,4,3,

        1,2,5,
        1,4,5,

        3,4,7,
        3,6,7,

        4,5,8,
        4,7,8,
    ]
};

export const tetrominoT: IMesh =
{
    name: 'T',
    
    position:
    [

        [-1.0,  1.0,  0.0],
        [-1.0,  0.0,  0.0],

        [ 0.0,  1.0,  0.0],
        [ 0.0,  0.0,  0.0],
        [ 0.0, -1.0,  0.0],

        [ 1.0,  1.0,  0.0],
        [ 1.0,  0.0,  0.0],
        [ 1.0, -1.0,  0.0],

        [ 2.0,  1.0,  0.0],
        [ 2.0,  0.0,  0.0],
    ],
    index:
    [
        0,1,3,
        0,3,2,

        2,3,6,
        2,6,5,

        3,4,7,
        3,6,7,

        5,6,9,
        5,9,8,
    ]
};

export const tetrominoZ: IMesh =
{
    name: 'Z',
    
    position:
    [

        [-1.0,  1.0,  0.0],
        [-1.0,  0.0,  0.0],

        [ 0.0,  1.0,  0.0],
        [ 0.0,  0.0,  0.0],
        [ 0.0, -1.0,  0.0],

        [ 1.0,  1.0,  0.0],
        [ 1.0,  0.0,  0.0],
        [ 1.0, -1.0,  0.0],

        [ 2.0,  0.0,  0.0],
        [ 2.0, -1.0,  0.0],
    ],
    index:
    [
        0,1,3,
        0,3,2,

        2,3,6,
        2,6,5,

        3,4,7,
        3,6,7,

        6,7,9,
        6,9,8,
    ]
};

export const tetrominoS: IMesh =
{
    name: 'S',
    
    position:
    [

        [-1.0,  0.0,  0.0],
        [-1.0, -1.0,  0.0],

        [ 0.0,  1.0,  0.0],
        [ 0.0,  0.0,  0.0],
        [ 0.0, -1.0,  0.0],

        [ 1.0,  1.0,  0.0],
        [ 1.0,  0.0,  0.0],
        [ 1.0, -1.0,  0.0],

        [ 2.0,  1.0,  0.0],
        [ 2.0,  0.0,  0.0],
    ],
    index:
    [
        0,1,4,
        0,4,3,

        2,3,6,
        2,6,5,

        3,4,7,
        3,6,7,

        5,6,9,
        5,9,8,
    ]
};

export const tetrominoJ: IMesh =
{
    name: 'J',
    
    position:
    [

        [-1.0,  0.0,  0.0],
        [-1.0, -1.0,  0.0],

        [ 0.0,  2.0,  0.0],
        [ 0.0,  1.0,  0.0],
        [ 0.0,  0.0,  0.0],
        [ 0.0, -1.0,  0.0],

        [ 1.0,  2.0,  0.0],
        [ 1.0,  1.0,  0.0],
        [ 1.0,  0.0,  0.0],
        [ 1.0, -1.0,  0.0],
    ],
    index:
    [
        0,1,5,
        0,5,4,

        2,3,7,
        2,7,6,

        3,4,8,
        3,8,7,

        4,5,9,
        4,9,8,
    ]
};

export const tetrominoL: IMesh =
{
    name: 'L',
    
    position:
    [
        [-1.0,  2.0,  0.0],
        [-1.0,  1.0,  0.0],
        [-1.0,  0.0,  0.0],
        [-1.0, -1.0,  0.0],

        [ 0.0,  2.0,  0.0],
        [ 0.0,  1.0,  0.0],
        [ 0.0,  0.0,  0.0],
        [ 0.0, -1.0,  0.0],

        [ 1.0,  0.0,  0.0],
        [ 1.0, -1.0,  0.0],
    ],
    index:
    [
        0,1,5,
        0,5,4,

        1,2,6,
        1,6,5,

        2,3,7,
        2,7,6,

        6,7,9,
        6,9,8,
    ]
};

export const tetrominoI: IMesh =
{
    name: 'I',
    
    position:
    [
        [ 0.0,  2.0,  0.0],
        [ 0.0,  1.0,  0.0],
        [ 0.0,  0.0,  0.0],
        [ 0.0, -1.0,  0.0],
        [ 0.0, -2.0,  0.0],

        [ 1.0,  2.0,  0.0],
        [ 1.0,  1.0,  0.0],
        [ 1.0,  0.0,  0.0],
        [ 1.0, -1.0,  0.0],
        [ 1.0, -2.0,  0.0],
    ],
    index:
    [
        0,1,6,
        0,6,5,

        1,2,7,
        1,7,6,

        2,3,8,
        2,8,7,

        3,4,9,
        3,9,8,
    ]
};

