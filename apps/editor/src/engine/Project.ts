import { Game } from "@fwge/core";
import { EditorScene } from "./scenes/Editor";
import { CubeMesh } from "./assets/CubeMesh";
import { GridMesh } from "./assets/GridMesh";

export class Project extends Game {
    UseAssets = [
        CubeMesh,
        GridMesh,
    ];
    UseScenes = [
        EditorScene,
    ];

    constructor() {
        super({
            height: 1080,
            width: 1920,
        })
    }
}