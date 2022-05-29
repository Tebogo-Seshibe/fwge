import { CSGO } from './game'
import { Round } from './scenes'
import './style.css'

declare global
{
    interface Window
    {
        game: CSGO
    }
}

const game = new CSGO()
game.Start()
game.SetScene(Round)

document.onpointerlockchange = console.log
document.onpointerlockerror = console.log
document.onfullscreenchange = console.log
document.onfullscreenerror = console.log

window.game = game
