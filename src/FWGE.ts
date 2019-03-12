
let GL: WebGLRenderingContext
export class  IFWGE
{
    canvas: HTMLCanvasElement
    renderUpdate = 60
    physcisUpdate = 30
    clear: Float32Array | Array<number> = [0, 0, 0, 1]
}
export default class FWGE
{
    static get GL()
    {
        return GL
    }
            
    static Init({canvas, renderUpdate, physcisUpdate, clear}: IFWGE): void
    {
        if (!canvas)
        {
            throw new Error('Field {canvas: HTMLCanvasElement} is required')
        }

        GL = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

        if (!GL)
        {
            throw new Error('Webgl context could not be initialized.')
        }
        GL.clearColor(clear[0], clear[1], clear[2], clear[3])
    }
    
    Start(): void
    {
        // GameEngine.Start();
    }
    
    Pause(): void
    {
        // GameEngine.Pause();
    }
    
    Stop(): void
    {
        // GameEngine.Stop();
    }
}