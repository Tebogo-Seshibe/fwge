import { Camera } from "../components"
import { RenderTarget } from "./RenderTarget"

export class Window
{
    constructor(
        public readonly Height: number,
        public readonly Width: number,
        public readonly Target: RenderTarget[],
        public Camera: Camera,
    ) { }
}