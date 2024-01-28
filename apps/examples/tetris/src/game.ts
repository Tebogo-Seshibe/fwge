import { Game } from '@fwge/core';
import { Level, MainMenu, Test } from './scenes';

export class Tetris extends Game
{
    constructor()
    {
        super(
        {
            canvas: document.querySelector<HTMLCanvasElement>('#canvas')!,
            height: 720,
            width: 1280,
            startupScene: 0,
            scenes: [ Test, MainMenu, Level ],
            assets: [],
            prefabs: []
        });
    }
}
