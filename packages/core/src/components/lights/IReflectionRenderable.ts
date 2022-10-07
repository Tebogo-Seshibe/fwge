import { RenderTarget, Shader } from "../../base"

export interface IReflectionRenderable
{
    ReflectionRenderTarget: RenderTarget
    ReflectionShadow: Shader

    BindForReflection(): void
    UnbindForReflection(): void
}
