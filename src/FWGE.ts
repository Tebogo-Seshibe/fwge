import Input from './Input/Input';
import Control from './Utility/Control';

export let GL: WebGLRenderingContext

export class  IFWGE
{
    canvas: HTMLCanvasElement
    renderupdate?: number
    physcisupdate?: number
    clear?: Float32Array | number[]
}

export default class FWGE
{
    static get GL()
    {
        return GL
    }
            
    static Init({ canvas, renderupdate = 60, physcisupdate = 30, clear = [0, 0, 0, 1] }: IFWGE): void
    {
        if (!canvas)
        {
            throw new Error('Field {canvas: HTMLCanvasElement} is required')
        }

        GL = canvas.getContext('webgl2') as WebGLRenderingContext

        if (!GL)
        {
            throw new Error('Webgl context could not be initialized.')
        }
        
        GL.clearColor(clear[0], clear[1], clear[2], clear[3])

        Control.Init(renderupdate, physcisupdate)
        Input.Init(canvas)
    }
}