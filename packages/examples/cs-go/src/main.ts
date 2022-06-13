import { Matrix4, Vector4 } from '@fwge/common'
import { CSGO } from './game'
import { Test } from './scenes/Test'

declare global
{
    interface Window
    {
        game: CSGO
    }
}

const game = new CSGO()
game.Start()
game.SetScene(Test)

document.onpointerlockchange = console.log
document.onpointerlockerror = console.log
document.onfullscreenchange = console.log
document.onfullscreenerror = console.log

window.game = game;

// const cube = new CubeGeometry()
// console.log(Matrix4.MultiplyVector(Matrix4.Identity, 1))
// console.log(cube.Vertices)
// console.log(cube.TransformedVertices(Matrix4.Identity))
// console.log(cube.TransformedVertices(Matrix4.TransformationMatrix(
//     [0,1,2],
//     [0,0,0],
//     [1,1,1]
// )))


(window as any)['Matrix4'] = Matrix4;
(window as any)['Vector4'] = Vector4;