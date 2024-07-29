import { Game } from '@fwge/core';
import { Level, MainMenu } from './scenes';

export class Tetris extends Game
{
    constructor()
    {
        super();
        
        this.Init(
        {
            canvas: document.querySelector<HTMLCanvasElement>('#canvas')!,
            height: 720,
            width: 1280,
            startupScene: 0,
            scenes: [ Level, MainMenu,  ],
            assets: [],
            prefabs: []
        });
    }
}
