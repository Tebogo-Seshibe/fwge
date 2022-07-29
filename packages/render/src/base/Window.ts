import { Camera } from "../components"
import { RenderTarget } from "./RenderTarget"

export class Window
{
    RenderPipeline: RenderTarget | undefined
    constructor(
        public readonly Height: number,
        public readonly Width: number,
        public readonly Target: RenderTarget[],
        public Camera: Camera,
    ) { }
}