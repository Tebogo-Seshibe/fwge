import { Game } from '@fwge/core';
import { De_Dust2, MainMenu, Test } from './scenes';

type Resolution = { Height: number, Width: number; };
const ResolutionMap =
{
    R_720p: { Height: 720, Width: 1280 } as Resolution,
    R_1080p: { Height: 1080, Width: 1920 } as Resolution,
    R_1440p: { Height: 1440, Width: 2560 } as Resolution,
    R_4K: { Height: 2160, Width: 3840 } as Resolution,
} as const;

const CurrentResolution: Resolution = ResolutionMap.R_720p;

export class CSGO extends Game
{
    constructor()
    {
        super(
        {
            canvas: document.querySelector<HTMLCanvasElement>('#canvas')!,
            height: CurrentResolution.Height,
            width: CurrentResolution.Width,
            startupScene: 0,
            scenes: [ Test, MainMenu, De_Dust2 ],
            assets: [],
            prefabs: []
        });
    }
}
