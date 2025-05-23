import { Game } from "@fwge/core";
import { CubeMesh } from "./assets/CubeMesh";
import { GridMesh } from "./assets/GridMesh";
import { Scene1 } from "./scenes";

export class Project extends Game
{
    UseAssets = [
        CubeMesh,
        GridMesh,
    ];
    UseScenes = [
        Scene1,
    ];
    
    constructor() {
        super({
            height: 1080,
            width: 1920,
            canvas() {
                return document.getElementsByTagName('canvas')[0];
            }
        })
    }
}