import { CSGO } from './game'

const game = new CSGO()
game.Start()

{
    (window as any).game = game
}
