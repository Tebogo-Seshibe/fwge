import { GLWrapper } from "./GLWrapper"

export let GL: WebGL2RenderingContext | GLWrapper

export let GLCall: Function

export function createContext(canvas: HTMLCanvasElement, debug: boolean = true): WebGL2RenderingContext
{
    const context = canvas.getContext('webgl2',
    {
        alpha: true,
        antialias: true,
        depth: true,
        stencil: true
    });

    if (!context)
    {
        throw new Error('Could not initialize context')
    }
            
    context.getExtension('EXT_color_buffer_float')
    // context.getExtension('OES_texture_float')
    context.getExtension('OES_texture_float_linear')

    GL = debug ? new GLWrapper(context) : context
    GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);

    return context;
}

export function glClearErrors(): void
{
    while (GL.getError() !== GL.NO_ERROR) {}
}

export function glCheckError(functionName: string, ...args: any[]): boolean
{
    const errorCode = GL.getError()

    switch (errorCode)
    {
        case GL.INVALID_ENUM:
            console.error(`[WEBGL Error]: "INVALID_ENUM" error created from "${functionName}(${args.join(', ')})"`)
            return false
        case GL.INVALID_VALUE:
            console.error(`[WEBGL Error]: "INVALID_VALUE" error created from "${functionName}(${args.join(', ')})"`)
            return false
        case GL.INVALID_OPERATION:
            console.error(`[WEBGL Error]: "INVALID_OPERATION" error created from "${functionName}(${args.join(', ')})"`)
            return false
        case GL.OUT_OF_MEMORY:
            console.error(`[WEBGL Error]: "OUT_OF_MEMORY" error created from "${functionName}(${args.join(', ')})"`)
            return false
        case GL.INVALID_FRAMEBUFFER_OPERATION:
            console.error(`[WEBGL Error]: "INVALID_FRAMEBUFFER_OPERATION" error created from "${functionName}(${args.join(', ')})"`)
            return false
        case GL.CONTEXT_LOST_WEBGL:
            console.error(`[WEBGL Error]: "CONTEXT_LOST_WEBGL" error created from "${functionName}(${args.join(', ')})"`)
            return false
    }
    
    return true
}

function assert(arg0: boolean) {
    throw new Error("Function not implemented.")
}
