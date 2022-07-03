import { SceneModel } from "./Scene"

export interface GameModel
{
    config:
    {
        height?: number
        width?: number
    }
    scenes: SceneModel[]
}
