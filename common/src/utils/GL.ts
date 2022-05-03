export let GL: WebGL2RenderingContext

export function setContext(gl: WebGL2RenderingContext)
{
    GL = gl
    GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
}

export function glUseProgram(progamId: WebGLProgram | null)
{
    GL.useProgram(progamId)
}
