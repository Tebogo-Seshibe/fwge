import { RenderTarget, Shader } from "../../base"

export interface IShadowRenderable
{
    ShadowRenderTarget: RenderTarget
    ShadowShadow: Shader

    BindForShadow(): void
    UnbindForShadow(): void
}
