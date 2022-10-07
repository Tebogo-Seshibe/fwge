import { GLWrapper } from "./GLWrapper"

export let GL: WebGL2RenderingContext | GLWrapper

let mainGL: WebGL2RenderingContext

export let GLCall: Function
// export function setContext(gl: WebGL2RenderingContext)
// {
//     GL = gl
//     GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
// }

export function createContext(canvas: HTMLCanvasElement, debug: boolean = true): void
{
    const context = canvas.getContext('webgl2', { alpha: true, antialias: true })

    if (!context)
    {
        throw new Error('Could not initialize context')
    }

    GL = debug ? new GLWrapper(context) : context

    // if (debug)
    // {
    //     wrapperGL = Object.create(null)
        
    //     const ignore = [
    //         'canvas',
    //         'getError',
    //         'pixelStorei',
    //         'drawingBufferColorSpace',
    //         'drawingBufferHeight',
    //         'drawingBufferWidth',
    //         'unpackColorSpace',
    //     ]
    //     const prototype = Object.getPrototypeOf(mainGL)
    //     const keys = Object.keys(prototype) as (keyof WebGL2RenderingContext)[]

    //     for (const key of keys)
    //     {
    //         const props = Object.getOwnPropertyDescriptor(prototype, key)
    //         // debugger
    //         if (!props) continue

    //         (wrapperGL as any)[key] = (...args:any[]) => typeof mainGL[key] === 'number' ?  mainGL[key] : prototype[key](...args);

    //         // if (ignore.includes(key) || typeof prototype[key] !== 'function')
    //         // {
    //         //     Object.defineProperty(wrapperGL, key, props)
    //         // }
    //         // else
    //         // {
    //         //     Object.defineProperty(wrapperGL, key,
    //         //     {
    //         //         value: (...args: any[]) =>
    //         //         {    
    //         //             glClearErrors();
    //         //             const func = (mainGL as any)[key];
    //         //             const result = func.call(mainGL, ...args);
    //         //             assert(glCheckError(key, ...args));
    //         //             return result;
    //         //         }
    //         //     })
    //         // }
    //     }
        
    //     GL = wrapperGL
    // }
    // else
    // {
    //     GL = mainGL
    // }
    
    // console.log(GL)
    GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true)
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

