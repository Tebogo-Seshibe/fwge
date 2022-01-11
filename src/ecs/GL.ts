export let GL: WebGLRenderingContext

export function setContext(gl: WebGLRenderingContext)
{
    GL = gl
}

export function glUseProgram(progamId: WebGLProgram | null)
{
    GL.useProgram(progamId)
}
