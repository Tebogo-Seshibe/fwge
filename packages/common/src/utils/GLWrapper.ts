
// return this\.this.context\.(.+)\((.*)\)
// glClearErrors(this.this.context)\n\t\t\t\tconst result = this.this.context.$1($2)\n\t\t\t\tglCheckError(this.this.context, '$1', $2)\n\t\t\t\treturn result
export class GLWrapper extends WebGL2RenderingContext
{
    //#region Properties
    get canvas(): HTMLCanvasElement
    {
        return this.context.canvas as HTMLCanvasElement
    }
    get drawingBufferHeight(): GLsizei
    {
        return this.context.drawingBufferHeight
    }
    get drawingBufferWidth(): GLsizei
    {
        return this.context.drawingBufferWidth
    }
    //#endregion

    //#region WebGL 1.0
    activeTexture(texture: GLenum): void
    {
        glClearErrors(this.context)
        this.context.activeTexture(texture)
        glCheckError(this.context, 'activeTexture', { texture })        
    }

    attachShader(program: WebGLProgram, shader: WebGLShader): void
    {
        glClearErrors(this.context)
        this.context.attachShader(program, shader)
        glCheckError(this.context, 'attachShader', { program, shader })
    }
    
    bindAttribLocation(program: WebGLProgram, index: GLuint, name: string): void
    {
        glClearErrors(this.context)
        this.context.bindAttribLocation(program, index, name)
        glCheckError(this.context, 'bindAttribLocation', { program, index, name })
    }

    bindBuffer(target: GLenum, buffer: WebGLBuffer | null): void
    {
        glClearErrors(this.context)
        this.context.bindBuffer(target, buffer)
        glCheckError(this.context, 'bindBuffer', { target, buffer })
    }

    bindFramebuffer(target: GLenum, framebuffer: WebGLFramebuffer | null): void
    {
        glClearErrors(this.context)
        this.context.bindFramebuffer(target, framebuffer)
        glCheckError(this.context, 'bindFramebuffer', { target, framebuffer })
    }
    
    bindRenderbuffer(target: GLenum, renderbuffer: WebGLRenderbuffer | null): void
    {
        glClearErrors(this.context)
        this.context.bindRenderbuffer(target, renderbuffer)
        glCheckError(this.context, 'bindRenderbuffer', { target, renderbuffer })
    }
    
    bindTexture(target: GLenum, texture: WebGLTexture | null): void
    {
        glClearErrors(this.context)
        this.context.bindTexture(target, texture)
        glCheckError(this.context, 'bindTexture', { target, texture })
    }
    
    blendColor(red: GLclampf, green: GLclampf, blue: GLclampf, alpha: GLclampf): void
    {
        glClearErrors(this.context)
        this.context.blendColor(red, green, blue, alpha)
        glCheckError(this.context, 'blendColor', { red, green, blue, alpha })
    }
    
    blendEquation(mode: GLenum): void
    {
        glClearErrors(this.context)
        this.context.blendEquation(mode)
        glCheckError(this.context, 'blendEquation', { mode })
    }
    
    blendEquationSeparate(modeRGB: GLenum, modeAlpha: GLenum): void
    {
        glClearErrors(this.context)
        this.context.blendEquationSeparate(modeRGB, modeAlpha)
        glCheckError(this.context, 'blendEquationSeparate', { modeRGB, modeAlpha })
    }
    
    blendFunc(sfactor: GLenum, dfactor: GLenum): void
    {
        glClearErrors(this.context)
        this.context.blendFunc(sfactor, dfactor) 
        glCheckError(this.context, 'blendEquationSeparate', { sfactor, dfactor })
    }
    
    blendFuncSeparate(srcRGB: GLenum, dstRGB: GLenum, srcAlpha: GLenum, dstAlpha: GLenum): void
    {
        glClearErrors(this.context)
        this.context.blendFuncSeparate(srcRGB, dstRGB, srcAlpha, dstAlpha)
        glCheckError(this.context, 'blendFuncSeparate', { srcRGB, dstRGB, srcAlpha, dstAlpha })
    }
    
    checkFramebufferStatus(target: GLenum): GLenum
    {
        glClearErrors(this.context)
        const result = this.context.checkFramebufferStatus(target)
        glCheckError(this.context, 'checkFramebufferStatus', { target })
        return result
    }
    
    clear(mask: GLbitfield): void
    {
        console.log(mask)
        glClearErrors(this.context)
        this.context.clear(mask)
        glCheckError(this.context, 'clear', { mask })
    }
    
    clearColor(red: GLclampf, green: GLclampf, blue: GLclampf, alpha: GLclampf): void
    {
        glClearErrors(this.context)
        this.context.clearColor(red, green, blue, alpha)
        glCheckError(this.context, 'clearColor', { red, green, blue, alpha })
    }
    
    clearDepth(depth: GLclampf): void
    {
        glClearErrors(this.context)
        this.context.clearDepth(depth)
        glCheckError(this.context, 'clearDepth', { depth })
    }
    
    clearStencil(s: GLint): void
    {
        glClearErrors(this.context)
        this.context.clearStencil(s)
        glCheckError(this.context, 'clearStencil', { s })
    }
    
    colorMask(red: GLboolean, green: GLboolean, blue: GLboolean, alpha: GLboolean): void
    {
        glClearErrors(this.context)
        this.context.colorMask(red, green, blue, alpha)
        glCheckError(this.context, 'colorMask', { red, green, blue, alpha })
    }
    
    compileShader(shader: WebGLShader): void
    {
        glClearErrors(this.context)
        this.context.compileShader(shader)
        glCheckError(this.context, 'compileShader', { shader })
    }
    
    copyTexImage2D(target: GLenum, level: GLint, internalformat: GLenum, x: GLint, y: GLint, width: GLsizei, height: GLsizei, border: GLint): void
    {
        glClearErrors(this.context)
        this.context.copyTexImage2D(target, level, internalformat, x, y, width, height, border)
        glCheckError(this.context, 'copyTexImage2D', { target, level, internalformat, x, y, width, height, border })
    }
    
    copyTexSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, x: GLint, y: GLint, width: GLsizei, height: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.copyTexSubImage2D(target, level, xoffset, yoffset, x, y, width, height)
        glCheckError(this.context, 'copyTexSubImage2D', { target, level, xoffset, yoffset, x, y, width, height })
    }
    
    createBuffer(): WebGLBuffer
    {
        glClearErrors(this.context)
        const result = this.context.createBuffer()
        glCheckError(this.context, 'createBuffer', {   })
        return result
    }
    
    createFramebuffer(): WebGLFramebuffer
    {
        glClearErrors(this.context)
        const result = this.context.createFramebuffer()
        glCheckError(this.context, 'createFramebuffer', {   })
        return result!
    }
    
    createProgram(): WebGLProgram
    {
        glClearErrors(this.context)
        const result = this.context.createProgram()
        glCheckError(this.context, 'createProgram', {   })
        return result
    }
    
    createRenderbuffer(): WebGLRenderbuffer
    {
        glClearErrors(this.context)
        const result = this.context.createRenderbuffer()
        glCheckError(this.context, 'createRenderbuffer', {   })
        return result
    }
    
    createShader(type: GLenum): WebGLShader | null
    {
        glClearErrors(this.context)
        const result = this.context.createShader(type)
        glCheckError(this.context, 'createShader', { type })
        return result
    }
    
    createTexture(): WebGLTexture
    {
        glClearErrors(this.context)
        const result = this.context.createTexture()
        glCheckError(this.context, 'createTexture', {   })
        return result
    }
    
    cullFace(mode: GLenum): void
    {
        glClearErrors(this.context)
        this.context.cullFace(mode)
        glCheckError(this.context, 'cullFace', { mode })
    }
    
    deleteBuffer(buffer: WebGLBuffer | null): void
    {
        glClearErrors(this.context)
        this.context.deleteBuffer(buffer)
        glCheckError(this.context, 'deleteBuffer', { buffer })
    }
    
    deleteFramebuffer(framebuffer: WebGLFramebuffer | null): void
    {
        glClearErrors(this.context)
        this.context.deleteFramebuffer(framebuffer)
        glCheckError(this.context, 'deleteFramebuffer', { framebuffer })
    }
    
    deleteProgram(program: WebGLProgram | null): void
    {
        glClearErrors(this.context)
        this.context.deleteProgram(program)
        glCheckError(this.context, 'deleteProgram', { program })
    }
    
    deleteRenderbuffer(renderbuffer: WebGLRenderbuffer | null): void
    {
        glClearErrors(this.context)
        this.context.deleteRenderbuffer(renderbuffer)
        glCheckError(this.context, 'deleteRenderbuffer', { renderbuffer })
    }
    
    deleteShader(shader: WebGLShader | null): void
    {
        glClearErrors(this.context)
        this.context.deleteShader(shader)
        glCheckError(this.context, 'deleteShader', { shader })
    }
    
    deleteTexture(texture: WebGLTexture | null): void
    {
        glClearErrors(this.context)
        this.context.deleteTexture(texture)
        glCheckError(this.context, 'deleteTexture', { texture })
    }
    
    depthFunc(func: GLenum): void
    {
        glClearErrors(this.context)
        this.context.depthFunc(func)
        glCheckError(this.context, 'depthFunc', { func })
    }
    
    depthMask(flag: GLboolean): void
    {
        glClearErrors(this.context)
        this.context.depthMask(flag)
        glCheckError(this.context, 'depthMask', { flag })
    }
    
    depthRange(zNear: GLclampf, zFar: GLclampf): void
    {
        glClearErrors(this.context)
        this.context.depthRange(zNear, zFar)
        glCheckError(this.context, 'depthRange', { zNear, zFar })
    }
    
    detachShader(program: WebGLProgram, shader: WebGLShader): void
    {
        glClearErrors(this.context)
        this.context.detachShader(program, shader)
        glCheckError(this.context, 'detachShader', { program, shader })
    }
    
    disable(cap: GLenum): void
    {
        glClearErrors(this.context)
        this.context.disable(cap)
        glCheckError(this.context, 'disable', { cap })
    }
    
    disableVertexAttribArray(index: GLuint): void
    {
        glClearErrors(this.context)
        this.context.disableVertexAttribArray(index)
        glCheckError(this.context, 'disableVertexAttribArray', { index })
    }
    
    drawArrays(mode: GLenum, first: GLint, count: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.drawArrays(mode, first, count)
        glCheckError(this.context, 'drawArrays', { mode, first, count })
    }
    
    drawElements(mode: GLenum, count: GLsizei, type: GLenum, offset: GLintptr): void
    {
        glClearErrors(this.context)
        this.context.drawElements(mode, count, type, offset)
        glCheckError(this.context, 'drawElements', { mode, count, type, offset })
    }
    
    enable(cap: GLenum): void
    {
        glClearErrors(this.context)
        this.context.enable(cap)
        glCheckError(this.context, 'enable', { cap })
    }
    
    enableVertexAttribArray(index: GLuint): void
    {
        glClearErrors(this.context)
        this.context.enableVertexAttribArray(index)
        glCheckError(this.context, 'enableVertexAttribArray', { index })
    }
    
    finish(): void
    {
        glClearErrors(this.context)
        this.context.finish()
        glCheckError(this.context, 'finish', {   })
    }
    
    flush(): void
    {
        glClearErrors(this.context)
        this.context.flush()
        glCheckError(this.context, 'flush', {   })
    }
    
    framebufferRenderbuffer(target: GLenum, attachment: GLenum, renderbuffertarget: GLenum, renderbuffer: WebGLRenderbuffer | null): void
    {
        glClearErrors(this.context)
        this.context.framebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer)
        glCheckError(this.context, 'framebufferRenderbuffer', { target, attachment, renderbuffertarget, renderbuffer })
    }
    
    framebufferTexture2D(target: GLenum, attachment: GLenum, textarget: GLenum, texture: WebGLTexture | null, level: GLint): void
    {
        glClearErrors(this.context)
        this.context.framebufferTexture2D(target, attachment, textarget, texture, level)
        glCheckError(this.context, 'framebufferTexture2D', { target, attachment, textarget, texture, level })
    }
    
    frontFace(mode: GLenum): void
    {
        glClearErrors(this.context)
        this.context.frontFace(mode)
        glCheckError(this.context, 'frontFace', { mode })
    }
    
    generateMipmap(target: GLenum): void
    {
        glClearErrors(this.context)
        this.context.generateMipmap(target)
        glCheckError(this.context, 'generateMipmap', { target })
    }
    
    getActiveAttrib(program: WebGLProgram, index: GLuint): WebGLActiveInfo | null
    {
        glClearErrors(this.context)
        const result = this.context.getActiveAttrib(program, index)
        glCheckError(this.context, 'getActiveAttrib', { program, index })
        return result
    }
    
    getActiveUniform(program: WebGLProgram, index: GLuint): WebGLActiveInfo | null
    {
        glClearErrors(this.context)
        const result = this.context.getActiveUniform(program, index)
        glCheckError(this.context, 'getActiveUniform', { program, index })
        return result
    }
    
    getAttachedShaders(program: WebGLProgram): WebGLShader[] | null
    {
        glClearErrors(this.context)
        const result = this.context.getAttachedShaders(program)
        glCheckError(this.context, 'getAttachedShaders', { program })
        return result
    }
    
    getAttribLocation(program: WebGLProgram, name: string): GLint
    {
        glClearErrors(this.context)
        const result = this.context.getAttribLocation(program, name)
        glCheckError(this.context, 'getAttribLocation', { program, name })
        return result
    }
    
    getBufferParameter(target: GLenum, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getBufferParameter(target, pname)
        glCheckError(this.context, 'getBufferParameter', { target, pname })
        return result
    }
    
    getContextAttributes(): WebGLContextAttributes | null
    {
        glClearErrors(this.context)
        const result = this.context.getContextAttributes()
        glCheckError(this.context, 'getContextAttributes', {   })
        return result
    }
    
    getError(): GLenum
    {
        glClearErrors(this.context)
        const result = this.context.getError()
        glCheckError(this.context, 'getError', {   })
        return result
    }
    
    getExtension(name: string): any
    {
        glClearErrors(this.context)
        const result = this.context.getExtension(name)
        glCheckError(this.context, 'getExtension', { name })
        return result
    }
    
    getFramebufferAttachmentParameter(target: GLenum, attachment: GLenum, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getFramebufferAttachmentParameter(target, attachment, pname)
        glCheckError(this.context, 'getFramebufferAttachmentParameter', { target, attachment, pname })
        return result
    }
    
    getParameter(pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getParameter(pname)
        glCheckError(this.context, 'getParameter', { pname })
        return result
    }
    
    getProgramInfoLog(program: WebGLProgram): string | null
    {
        glClearErrors(this.context)
        const result = this.context.getProgramInfoLog(program)
        glCheckError(this.context, 'getProgramInfoLog', { program })
        return result
    }
    
    getProgramParameter(program: WebGLProgram, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getProgramParameter(program, pname)
        glCheckError(this.context, 'getProgramParameter', { program, pname })
        return result
    }
    
    getRenderbufferParameter(target: GLenum, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getRenderbufferParameter(target, pname)
        glCheckError(this.context, 'getRenderbufferParameter', { target, pname })
        return result
    }
    
    getShaderInfoLog(shader: WebGLShader): string | null
    {
        glClearErrors(this.context)
        const result = this.context.getShaderInfoLog(shader)
        glCheckError(this.context, 'getShaderInfoLog', { shader })
        return result
    }
    
    getShaderParameter(shader: WebGLShader, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getShaderParameter(shader, pname)
        glCheckError(this.context, 'getShaderParameter', { shader, pname })
        return result
    }
    
    getShaderPrecisionFormat(shadertype: GLenum, precisiontype: GLenum): WebGLShaderPrecisionFormat | null
    {
        glClearErrors(this.context)
        const result = this.context.getShaderPrecisionFormat(shadertype, precisiontype)
        glCheckError(this.context, 'getShaderPrecisionFormat', { shadertype, precisiontype })
        return result
    }
    
    getShaderSource(shader: WebGLShader): string | null
    {
        glClearErrors(this.context)
        const result = this.context.getShaderSource(shader)
        glCheckError(this.context, 'getShaderSource', { shader })
        return result
    }
    
    getSupportedExtensions(): string[] | null
    {
        glClearErrors(this.context)
        const result = this.context.getSupportedExtensions()
        glCheckError(this.context, 'getSupportedExtensions', {   })
        return result
    }
    
    getTexParameter(target: GLenum, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getTexParameter(target, pname)
        glCheckError(this.context, 'getTexParameter', { target, pname })
        return result
    }
    
    getUniform(program: WebGLProgram, location: WebGLUniformLocation): any
    {
        glClearErrors(this.context)
        const result = this.context.getUniform(program, location)
        glCheckError(this.context, 'getUniform', { program, location })
        return result
    }
    
    getUniformLocation(program: WebGLProgram, name: string): WebGLUniformLocation | null
    {
        glClearErrors(this.context)
        const result = this.context.getUniformLocation(program, name)
        glCheckError(this.context, 'getUniformLocation', { program, name })
        return result
    }
    
    getVertexAttrib(index: GLuint, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getVertexAttrib(index, pname)
        glCheckError(this.context, 'getVertexAttrib', { index, pname })
        return result
    }
    
    getVertexAttribOffset(index: GLuint, pname: GLenum): GLintptr
    {
        glClearErrors(this.context)
        const result = this.context.getVertexAttribOffset(index, pname)
        glCheckError(this.context, 'getVertexAttribOffset', { index, pname })
        return result
    }
    
    hint(target: GLenum, mode: GLenum): void
    {
        glClearErrors(this.context)
        this.context.hint(target, mode)
        glCheckError(this.context, 'hint', { target, mode })
    }
    
    isBuffer(buffer: WebGLBuffer | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isBuffer(buffer)
        glCheckError(this.context, 'isBuffer', { buffer })
        return result
    }
    
    isContextLost(): boolean
    {
        glClearErrors(this.context)
        const result = this.context.isContextLost()
        glCheckError(this.context, 'isthis.contextLost', {   })
        return result
    }
    
    isEnabled(cap: GLenum): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isEnabled(cap)
        glCheckError(this.context, 'isEnabled', { cap })
        return result
    }
    
    isFramebuffer(framebuffer: WebGLFramebuffer | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isFramebuffer(framebuffer)
        glCheckError(this.context, 'isFramebuffer', { framebuffer })
        return result
    }
    
    isProgram(program: WebGLProgram | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isProgram(program)
        glCheckError(this.context, 'isProgram', { program })
        return result
    }
    
    isRenderbuffer(renderbuffer: WebGLRenderbuffer | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isRenderbuffer(renderbuffer)
        glCheckError(this.context, 'isRenderbuffer', { renderbuffer })
        return result
    }
    
    isShader(shader: WebGLShader | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isShader(shader)
        glCheckError(this.context, 'isShader', { shader })
        return result
    }
    
    isTexture(texture: WebGLTexture | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isTexture(texture)
        glCheckError(this.context, 'isTexture', { texture })
        return result
    }
    
    lineWidth(width: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.lineWidth(width)
        glCheckError(this.context, 'lineWidth', { width })
    }
    
    linkProgram(program: WebGLProgram): void
    {
        glClearErrors(this.context)
        this.context.linkProgram(program)
        glCheckError(this.context, 'linkProgram', { program })
    }
    
    pixelStorei(pname: GLenum, param: GLint | GLboolean): void
    {
        glClearErrors(this.context)
        this.context.pixelStorei(pname, param)
        glCheckError(this.context, 'pixelStorei', { pname, param })
    }
    
    polygonOffset(factor: GLfloat, units: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.polygonOffset(factor, units)
        glCheckError(this.context, 'polygonOffset', { factor, units })
    }
    
    renderbufferStorage(target: GLenum, internalformat: GLenum, width: GLsizei, height: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.renderbufferStorage(target, internalformat, width, height)
        glCheckError(this.context, 'renderbufferStorage', { target, internalformat, width, height })
    }
    
    sampleCoverage(value: GLclampf, invert: GLboolean): void
    {
        glClearErrors(this.context)
        this.context.sampleCoverage(value, invert)
        glCheckError(this.context, 'sampleCoverage', { value, invert })
    }
    
    scissor(x: GLint, y: GLint, width: GLsizei, height: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.scissor(x, y, width, height)
        glCheckError(this.context, 'scissor', { x, y, width, height })
    }
    
    shaderSource(shader: WebGLShader, source: string): void
    {
        glClearErrors(this.context)
        this.context.shaderSource(shader, source)
        glCheckError(this.context, 'shaderSource', { shader, source })
    }
    
    stencilFunc(func: GLenum, ref: GLint, mask: GLuint): void
    {
        glClearErrors(this.context)
        this.context.stencilFunc(func, ref, mask)
        glCheckError(this.context, 'stencilFunc', { func, ref, mask })
    }
    
    stencilFuncSeparate(face: GLenum, func: GLenum, ref: GLint, mask: GLuint): void
    {
        glClearErrors(this.context)
        this.context.stencilFuncSeparate(face, func, ref, mask)
        glCheckError(this.context, 'stencilFuncSeparate', { face, func, ref, mask })
    }
    
    stencilMask(mask: GLuint): void
    {
        glClearErrors(this.context)
        this.context.stencilMask(mask)
        glCheckError(this.context, 'stencilMask', { mask })
    }
    
    stencilMaskSeparate(face: GLenum, mask: GLuint): void
    {
        glClearErrors(this.context)
        this.context.stencilMaskSeparate(face, mask)
        glCheckError(this.context, 'stencilMaskSeparate', { face, mask })
    }
    
    stencilOp(fail: GLenum, zfail: GLenum, zpass: GLenum): void
    {
        glClearErrors(this.context)
        this.context.stencilOp(fail, zfail, zpass)
        glCheckError(this.context, 'stencilOp', { fail, zfail, zpass })
    }
    
    stencilOpSeparate(face: GLenum, fail: GLenum, zfail: GLenum, zpass: GLenum): void
    {
        glClearErrors(this.context)
        this.context.stencilOpSeparate(face, fail, zfail, zpass)
        glCheckError(this.context, 'stencilOpSeparate', { face, fail, zfail, zpass })
    }
    
    texParameterf(target: GLenum, pname: GLenum, param: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.texParameterf(target, pname, param)
        glCheckError(this.context, 'texParameterf', { target, pname, param })
    }
    
    texParameteri(target: GLenum, pname: GLenum, param: GLint): void
    {
        glClearErrors(this.context)
        this.context.texParameteri(target, pname, param)
        glCheckError(this.context, 'texParameteri', { target, pname, param })
    }
    
    uniform1f(location: WebGLUniformLocation | null, x: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.uniform1f(location, x)
        glCheckError(this.context, 'uniform1f', { location, x })
    }
    
    uniform1i(location: WebGLUniformLocation | null, x: GLint): void
    {
        glClearErrors(this.context)
        this.context.uniform1i(location, x)
        glCheckError(this.context, 'uniform1i', { location, x })
    }
    
    uniform2f(location: WebGLUniformLocation | null, x: GLfloat, y: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.uniform2f(location, x, y)
        glCheckError(this.context, 'uniform2f', { location, x, y })
    }
    
    uniform2i(location: WebGLUniformLocation | null, x: GLint, y: GLint): void
    {
        glClearErrors(this.context)
        this.context.uniform2i(location, x, y)
        glCheckError(this.context, 'uniform2i', { location, x, y })
    }
    
    uniform3f(location: WebGLUniformLocation | null, x: GLfloat, y: GLfloat, z: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.uniform3f(location, x, y, z)
        glCheckError(this.context, 'uniform3f', { location, x, y, z })
    }
    
    uniform3i(location: WebGLUniformLocation | null, x: GLint, y: GLint, z: GLint): void
    {
        glClearErrors(this.context)
        this.context.uniform3i(location, x, y, z)
        glCheckError(this.context, 'uniform3i', { location, x, y, z })
    }
    
    uniform4f(location: WebGLUniformLocation | null, x: GLfloat, y: GLfloat, z: GLfloat, w: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.uniform4f(location, x, y, z, w)
        glCheckError(this.context, 'uniform4f', { location, x, y, z, w })
    }
    
    uniform4i(location: WebGLUniformLocation | null, x: GLint, y: GLint, z: GLint, w: GLint): void
    {
        glClearErrors(this.context)
        this.context.uniform4i(location, x, y, z, w)
        glCheckError(this.context, 'uniform4i', { location, x, y, z, w })
    }
    
    useProgram(program: WebGLProgram | null): void
    {
        glClearErrors(this.context)
        this.context.useProgram(program)
        glCheckError(this.context, 'useProgram', { program })
    }
    
    validateProgram(program: WebGLProgram): void
    {
        glClearErrors(this.context)
        this.context.validateProgram(program)
        glCheckError(this.context, 'validateProgram', { program })
    }
    
    vertexAttrib1f(index: GLuint, x: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.vertexAttrib1f(index, x)
        glCheckError(this.context, 'vertexAttrib1f', { index, x })
    }
    
    vertexAttrib1fv(index: GLuint, values: Float32List): void
    {
        glClearErrors(this.context)
        this.context.vertexAttrib1fv(index, values)
        glCheckError(this.context, 'vertexAttrib1fv', { index, values })
    }
    
    vertexAttrib2f(index: GLuint, x: GLfloat, y: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.vertexAttrib2f(index, x, y)
        glCheckError(this.context, 'vertexAttrib2f', { index, x, y })
    }
    
    vertexAttrib2fv(index: GLuint, values: Float32List): void
    {
        glClearErrors(this.context)
        this.context.vertexAttrib2fv(index, values)
        glCheckError(this.context, 'vertexAttrib2fv', { index, values })
    }
    
    vertexAttrib3f(index: GLuint, x: GLfloat, y: GLfloat, z: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.vertexAttrib3f(index, x, y, z)
        glCheckError(this.context, 'vertexAttrib3f', { index, x, y, z })
    }
    
    vertexAttrib3fv(index: GLuint, values: Float32List): void
    {
        glClearErrors(this.context)
        this.context.vertexAttrib3fv(index, values)
        glCheckError(this.context, 'vertexAttrib3fv', { index, values })
    }
    
    vertexAttrib4f(index: GLuint, x: GLfloat, y: GLfloat, z: GLfloat, w: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.vertexAttrib4f(index, x, y, z, w)
        glCheckError(this.context, 'vertexAttrib4f', { index, x, y, z, w })
    }
    
    vertexAttrib4fv(index: GLuint, values: Float32List): void
    {
        glClearErrors(this.context)
        this.context.vertexAttrib4fv(index, values)
        glCheckError(this.context, 'vertexAttrib4fv', { index, values })
    }
    
    vertexAttribPointer(index: GLuint, size: GLint, type: GLenum, normalized: GLboolean, stride: GLsizei, offset: GLintptr): void
    {
        glClearErrors(this.context)
        this.context.vertexAttribPointer(index, size, type, normalized, stride, offset)
        glCheckError(this.context, 'vertexAttribPointer', { index, size, type, normalized, stride, offset })
    }
    
    viewport(x: GLint, y: GLint, width: GLsizei, height: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.viewport(x, y, width, height)
        glCheckError(this.context, 'viewport', { x, y, width, height })   
    }
    //#endregion

    //#region WebGL 2.0
    beginQuery(target: GLenum, query: WebGLQuery): void
    {
        glClearErrors(this.context)
        this.context.beginQuery(target, query)
        glCheckError(this.context, 'beginQuery', { target, query })
    }
    
    beginTransformFeedback(primitiveMode: GLenum): void
    {
        glClearErrors(this.context)
        this.context.beginTransformFeedback(primitiveMode)
        glCheckError(this.context, 'beginTransformFeedback', { primitiveMode })
    }
    
    bindBufferBase(target: GLenum, index: GLuint, buffer: WebGLBuffer | null): void
    {
        glClearErrors(this.context)
        this.context.bindBufferBase(target, index, buffer)
        glCheckError(this.context, 'bindBufferBase', { target, index, buffer })
    }
    
    bindBufferRange(target: GLenum, index: GLuint, buffer: WebGLBuffer | null, offset: GLintptr, size: GLsizeiptr): void
    {
        glClearErrors(this.context)
        this.context.bindBufferRange(target, index, buffer, offset, size)
        glCheckError(this.context, 'bindBufferRange', { target, index, buffer, offset, size })
    }
    
    bindSampler(unit: GLuint, sampler: WebGLSampler | null): void
    {
        glClearErrors(this.context)
        this.context.bindSampler(unit, sampler)
        glCheckError(this.context, 'bindSampler', { unit, sampler })
    }
    
    bindTransformFeedback(target: GLenum, tf: WebGLTransformFeedback | null): void
    {
        glClearErrors(this.context)
        this.context.bindTransformFeedback(target, tf)
        glCheckError(this.context, 'bindTransformFeedback', { target, tf })
    }
    
    bindVertexArray(array: WebGLVertexArrayObject | null): void
    {
        glClearErrors(this.context)
        this.context.bindVertexArray(array)
        glCheckError(this.context, 'bindVertexArray', { array })
    }
    
    blitFramebuffer(srcX0: GLint, srcY0: GLint, srcX1: GLint, srcY1: GLint, dstX0: GLint, dstY0: GLint, dstX1: GLint, dstY1: GLint, mask: GLbitfield, filter: GLenum): void
    {
        glClearErrors(this.context)
        this.context.blitFramebuffer(srcX0, srcY0, srcX1, srcY1, dstX0, dstY0, dstX1, dstY1, mask, filter)
        glCheckError(this.context, 'blitFramebuffer', { srcX0, srcY0, srcX1, srcY1, dstX0, dstY0, dstX1, dstY1, mask, filter })
    }
    
    clearBufferfi(buffer: GLenum, drawbuffer: GLint, depth: GLfloat, stencil: GLint): void
    {
        glClearErrors(this.context)
        this.context.clearBufferfi(buffer, drawbuffer, depth, stencil)
        glCheckError(this.context, 'clearBufferfi', { buffer, drawbuffer, depth, stencil })
    }
    
    clearBufferfv(buffer: GLenum, drawbuffer: GLint, values: Float32List, srcOffset?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.clearBufferfv(buffer, drawbuffer, values, srcOffset)
        glCheckError(this.context, 'clearBufferfv', { buffer, drawbuffer, values, srcOffset })
    }
    
    clearBufferiv(buffer: GLenum, drawbuffer: GLint, values: Int32List, srcOffset?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.clearBufferiv(buffer, drawbuffer, values, srcOffset)
        glCheckError(this.context, 'clearBufferiv', { buffer, drawbuffer, values, srcOffset })
    }
    
    clearBufferuiv(buffer: GLenum, drawbuffer: GLint, values: Uint32List, srcOffset?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.clearBufferuiv(buffer, drawbuffer, values, srcOffset)
        glCheckError(this.context, 'clearBufferuiv', { buffer, drawbuffer, values, srcOffset })
    }
    
    clientWaitSync(sync: WebGLSync, flags: GLbitfield, timeout: GLuint64): GLenum
    {
        glClearErrors(this.context)
        const result = this.context.clientWaitSync(sync, flags, timeout)
        glCheckError(this.context, 'clientWaitSync', { sync, flags, timeout })
        return result
    }
    
    compressedTexImage3D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, imageSize: GLsizei, offset: GLintptr): void
    compressedTexImage3D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint): void
    compressedTexImage3D(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, _arg0: GLsizei | ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint): void
    {
        glClearErrors(this.context)
        if (typeof _arg0 === 'number')
        {
            let offset = srcOffset!
            let imageSize = _arg0
            this.context.compressedTexImage3D(target, level, internalformat, width, height, depth, border, imageSize, offset)
            glCheckError(this.context, 'compressedTexImage3D', { target, level, internalformat, width, height, depth, border, imageSize, offset })
        }
        else
        {
            let srcData = _arg0
            this.context.compressedTexImage3D(target, level, internalformat, width, height, depth, border, srcData, srcOffset, srcLengthOverride)
            glCheckError(this.context, 'compressedTexImage3D', { target, level, internalformat, width, height, depth, border, srcData, srcOffset, srcLengthOverride })

        }
    }

    compressedTexSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, imageSize: GLsizei, offset: GLintptr): void
    compressedTexSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint): void
    compressedTexSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, _arg0: GLsizei | ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint)
    {
        glClearErrors(this.context)
        if (typeof _arg0 === 'number')
        {
            let offset = srcOffset!
            let imageSize = _arg0
            this.context.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, offset)
            glCheckError(this.context, 'compressedTexSubImage3D', { target, level, xoffset, yoffset, zoffset, width, height, depth, format, imageSize, offset })
        }
        else
        {
            let srcData = _arg0
            this.context.compressedTexSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, srcData, srcOffset, srcLengthOverride)
            glCheckError(this.context, 'compressedTexSubImage3D', { target, level, xoffset, yoffset, zoffset, width, height, depth, format, srcData, srcOffset, srcLengthOverride })

        }
    }
    
    copyBufferSubData(readTarget: GLenum, writeTarget: GLenum, readOffset: GLintptr, writeOffset: GLintptr, size: GLsizeiptr): void
    {
        glClearErrors(this.context)
        const result = this.context.copyBufferSubData(readTarget, writeTarget, readOffset, writeOffset, size)
        glCheckError(this.context, 'copyBufferSubData', { readTarget, writeTarget, readOffset, writeOffset, size })
        return result
    }

    copyTexSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, x: GLint, y: GLint, width: GLsizei, height: GLsizei): void
    {
        glClearErrors(this.context)
        const result = this.context.copyTexSubImage3D(target, level, xoffset, yoffset, zoffset, x, y, width, height)
        glCheckError(this.context, 'copyTexSubImage3D', { target, level, xoffset, yoffset, zoffset, x, y, width, height })
        return result
    }

    createQuery(): WebGLQuery
    {
        glClearErrors(this.context)
        const result = this.context.createQuery()
        glCheckError(this.context, 'createQuery', {   })
        return result
    }

    createSampler(): WebGLSampler
    {
        glClearErrors(this.context)
        const result = this.context.createSampler()
        glCheckError(this.context, 'createSampler', {   })
        return result
    }

    createTransformFeedback(): WebGLTransformFeedback
    {
        glClearErrors(this.context)
        const result = this.context.createTransformFeedback()
        glCheckError(this.context, 'createTransformFeedback', {   })
        return result
    }

    createVertexArray(): WebGLVertexArrayObject
    {
        glClearErrors(this.context)
        const result = this.context.createVertexArray()
        glCheckError(this.context, 'createVertexArray', {   })
        return result
    }

    deleteQuery(query: WebGLQuery | null): void
    {
        glClearErrors(this.context)
        this.context.deleteQuery(query)
        glCheckError(this.context, 'deleteQuery', { query })
    }

    deleteSampler(sampler: WebGLSampler | null): void
    {
        glClearErrors(this.context)
        this.context.deleteSampler(sampler)
        glCheckError(this.context, 'deleteSampler', { sampler })
    }

    deleteSync(sync: WebGLSync | null): void
    {
        glClearErrors(this.context)
        this.context.deleteSync(sync)
        glCheckError(this.context, 'deleteSync', { sync })
    }

    deleteTransformFeedback(tf: WebGLTransformFeedback | null): void
    {
        glClearErrors(this.context)
        this.context.deleteTransformFeedback(tf)
        glCheckError(this.context, 'deleteTransformFeedback', { tf })
    }

    deleteVertexArray(vertexArray: WebGLVertexArrayObject | null): void
    {
        glClearErrors(this.context)
        this.context.deleteVertexArray(vertexArray)
        glCheckError(this.context, 'deleteVertexArray', { vertexArray })
    }

    drawArraysInstanced(mode: GLenum, first: GLint, count: GLsizei, instanceCount: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.drawArraysInstanced(mode, first, count, instanceCount)
        glCheckError(this.context, 'drawArraysInstanced', { mode, first, count, instanceCount })
    }

    drawBuffers(buffers: GLenum[]): void
    {
        glClearErrors(this.context)
        this.context.drawBuffers(buffers)
        glCheckError(this.context, 'drawBuffers', { buffers })
    }

    drawElementsInstanced(mode: GLenum, count: GLsizei, type: GLenum, offset: GLintptr, instanceCount: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.drawElementsInstanced(mode, count, type, offset, instanceCount)
        glCheckError(this.context, 'drawElementsInstanced', { mode, count, type, offset, instanceCount })
    }

    drawRangeElements(mode: GLenum, start: GLuint, end: GLuint, count: GLsizei, type: GLenum, offset: GLintptr): void
    {
        glClearErrors(this.context)
        this.context.drawRangeElements(mode, start, end, count, type, offset)
        glCheckError(this.context, 'drawRangeElements', { mode, start, end, count, type, offset })
    }

    endQuery(target: GLenum): void
    {
        glClearErrors(this.context)
        this.context.endQuery(target)
        glCheckError(this.context, 'endQuery', { target })
    }

    endTransformFeedback(): void
    {
        glClearErrors(this.context)
        this.context.endTransformFeedback()
        glCheckError(this.context, 'endTransformFeedback', {   })
    }

    fenceSync(condition: GLenum, flags: GLbitfield): WebGLSync | null
    {
        glClearErrors(this.context)
        const result = this.context.fenceSync(condition, flags)
        glCheckError(this.context, 'fenceSync', { condition, flags })
        return result
    }

    framebufferTextureLayer(target: GLenum, attachment: GLenum, texture: WebGLTexture | null, level: GLint, layer: GLint): void
    {
        glClearErrors(this.context)
        this.context.framebufferTextureLayer(target, attachment, texture, level, layer)
        glCheckError(this.context, 'framebufferTextureLayer', { target, attachment, texture, level, layer })
    }

    getActiveUniformBlockName(program: WebGLProgram, uniformBlockIndex: GLuint): string | null
    {
        glClearErrors(this.context)
        const result = this.context.getActiveUniformBlockName(program, uniformBlockIndex)
        glCheckError(this.context, 'getActiveUniformBlockName', { program, uniformBlockIndex })
        return result
    }

    getActiveUniformBlockParameter(program: WebGLProgram, uniformBlockIndex: GLuint, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getActiveUniformBlockParameter(program, uniformBlockIndex, pname)
        glCheckError(this.context, 'getActiveUniformBlockParameter', { program, uniformBlockIndex, pname })
        return result
    }

    getActiveUniforms(program: WebGLProgram, uniformIndices: GLuint[], pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getActiveUniforms(program, uniformIndices, pname)
        glCheckError(this.context, 'getActiveUniforms', { program, uniformIndices, pname })
        return result
    }

    getBufferSubData(target: GLenum, srcByteOffset: GLintptr, dstBuffer: ArrayBufferView, dstOffset?: GLuint, length?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.getBufferSubData(target, srcByteOffset, dstBuffer, dstOffset, length)
        glCheckError(this.context, 'getBufferSubData', { target, srcByteOffset, dstBuffer, dstOffset, length })
    }

    getFragDataLocation(program: WebGLProgram, name: string): GLint
    {
        glClearErrors(this.context)
        const result = this.context.getFragDataLocation(program, name)
        glCheckError(this.context, 'getFragDataLocation', { program, name })
        return result
    }

    getIndexedParameter(target: GLenum, index: GLuint): any
    {
        glClearErrors(this.context)
        const result = this.context.getIndexedParameter(target, index)
        glCheckError(this.context, 'getIndexedParameter', { target, index })
        return result
    }

    getInternalformatParameter(target: GLenum, internalformat: GLenum, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getInternalformatParameter(target, internalformat, pname)
        glCheckError(this.context, 'getInternalformatParameter', { target, internalformat, pname })
        return result
    }

    getQuery(target: GLenum, pname: GLenum): WebGLQuery | null
    {
        glClearErrors(this.context)
        const result = this.context.getQuery(target, pname)
        glCheckError(this.context, 'getQuery', { target, pname })
        return result
    }

    getQueryParameter(query: WebGLQuery, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getQueryParameter(query, pname)
        glCheckError(this.context, 'getQueryParameter', { query, pname })
        return result
    }

    getSamplerParameter(sampler: WebGLSampler, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getSamplerParameter(sampler, pname)
        glCheckError(this.context, 'getSamplerParameter', { sampler, pname })
        return result
    }

    getSyncParameter(sync: WebGLSync, pname: GLenum): any
    {
        glClearErrors(this.context)
        const result = this.context.getSyncParameter(sync, pname)
        glCheckError(this.context, 'getSyncParameter', { sync, pname })
        return result
    }

    getTransformFeedbackVarying(program: WebGLProgram, index: GLuint): WebGLActiveInfo | null
    {
        glClearErrors(this.context)
        const result = this.context.getTransformFeedbackVarying(program, index)
        glCheckError(this.context, 'getTransformFeedbackVarying', { program, index })
        return result
    }

    getUniformBlockIndex(program: WebGLProgram, uniformBlockName: string): GLuint
    {
        glClearErrors(this.context)
        const result = this.context.getUniformBlockIndex(program, uniformBlockName)
        glCheckError(this.context, 'getUniformBlockIndex', { program, uniformBlockName })
        return result
    }

    getUniformIndices(program: WebGLProgram, uniformNames: string[]): GLuint[] | null
    {
        glClearErrors(this.context)
        const result = this.context.getUniformIndices(program, uniformNames)
        glCheckError(this.context, 'getUniformIndices', { program, uniformNames })
        return result as GLuint[]
    }

    invalidateFramebuffer(target: GLenum, attachments: GLenum[]): void
    {
        glClearErrors(this.context)
        this.context.invalidateFramebuffer(target, attachments)
        glCheckError(this.context, 'invalidateFramebuffer', { target, attachments })
    }

    invalidateSubFramebuffer(target: GLenum, attachments: GLenum[], x: GLint, y: GLint, width: GLsizei, height: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.invalidateSubFramebuffer(target, attachments, x, y, width, height)
        glCheckError(this.context, 'invalidateSubFramebuffer', { target, attachments, x, y, width, height })
    }

    isQuery(query: WebGLQuery | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isQuery(query)
        glCheckError(this.context, 'isQuery', { query })
        return result
    }

    isSampler(sampler: WebGLSampler | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isSampler(sampler)
        glCheckError(this.context, 'isSampler', { sampler })
        return result
    }

    isSync(sync: WebGLSync | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isSync(sync)
        glCheckError(this.context, 'isSync', { sync })
        return result
    }

    isTransformFeedback(tf: WebGLTransformFeedback | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isTransformFeedback(tf)
        glCheckError(this.context, 'isTransformFeedback', { tf })
        return result
    }

    isVertexArray(vertexArray: WebGLVertexArrayObject | null): GLboolean
    {
        glClearErrors(this.context)
        const result = this.context.isVertexArray(vertexArray)
        glCheckError(this.context, 'isVertexArray', { vertexArray })
        return result
    }

    pauseTransformFeedback(): void
    {
        glClearErrors(this.context)
        this.context.pauseTransformFeedback()
        glCheckError(this.context, 'pauseTransformFeedback', {   })
    }

    readBuffer(src: GLenum): void
    {
        glClearErrors(this.context)
        this.context.readBuffer(src)
        glCheckError(this.context, 'readBuffer', { src })
    }

    renderbufferStorageMultisample(target: GLenum, samples: GLsizei, internalformat: GLenum, width: GLsizei, height: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.renderbufferStorageMultisample(target, samples, internalformat, width, height)
        glCheckError(this.context, 'renderbufferStorageMultisample', { target, samples, internalformat, width, height })
    }

    resumeTransformFeedback(): void
    {
        glClearErrors(this.context)
        this.context.resumeTransformFeedback()
        glCheckError(this.context, 'resumeTransformFeedback', {   })
    }

    samplerParameterf(sampler: WebGLSampler, pname: GLenum, param: GLfloat): void
    {
        glClearErrors(this.context)
        this.context.samplerParameterf(sampler, pname, param)
        glCheckError(this.context, 'samplerParameterf', { sampler, pname, param })
    }

    samplerParameteri(sampler: WebGLSampler, pname: GLenum, param: GLint): void
    {
        glClearErrors(this.context)
        this.context.samplerParameteri(sampler, pname, param)
        glCheckError(this.context, 'samplerParameteri', { sampler, pname, param })
    }

    // texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, pboOffset: GLintptr): void
    // texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, source: TexImageSource): void
    // texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, srcData: ArrayBufferView | null): void
    // texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, srcData: ArrayBufferView, srcOffset: GLuint): void
    // texImage3D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, _arg0: GLintptr | TexImageSource | ArrayBufferView | null, srcOffset?: GLuint)
    // {
    //     if (typeof _arg0 === 'number')
    //     {
    //         let pboOffset =  _arg0
    //         this.context.texImage3D(target, level, internalformat, width, height, depth, border, format, type, pboOffset)
    //         glCheckError(this.context, 'texImage3D', { target, level, internalformat, width, height, depth, border, format, type, pboOffset })
    //     }
    //     else
    //     {
            
    //     }
    // }

    texStorage2D(target: GLenum, levels: GLsizei, internalformat: GLenum, width: GLsizei, height: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.texStorage2D(target, levels, internalformat, width, height)
        glCheckError(this.context, 'texStorage2D', { target, levels, internalformat, width, height })
    }

    texStorage3D(target: GLenum, levels: GLsizei, internalformat: GLenum, width: GLsizei, height: GLsizei, depth: GLsizei): void
    {
        glClearErrors(this.context)
        this.context.texStorage3D(target, levels, internalformat, width, height, depth)
        glCheckError(this.context, 'texStorage3D', { target, levels, internalformat, width, height, depth })
    }    

    // texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, pboOffset: GLintptr): void
    // texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, source: TexImageSource): void
    // texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, srcData: ArrayBufferView | null, srcOffset?: GLuint): void
    // texSubImage3D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, srcData: ArrayBufferView | null, srcOffset?: GLuint)
    // {
        
    // }

    transformFeedbackVaryings(program: WebGLProgram, varyings: string[], bufferMode: GLenum): void
    {
        glClearErrors(this.context)
        this.context.transformFeedbackVaryings(program, varyings, bufferMode)
        glCheckError(this.context, 'transformFeedbackVaryings', { program, varyings, bufferMode })
    }

    uniform1ui(location: WebGLUniformLocation | null, v0: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform1ui(location, v0)
        glCheckError(this.context, 'uniform1ui', { location, v0 })
    }

    uniform1uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform1uiv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform1uiv', { location, data, srcOffset, srcLength })
    }

    uniform2ui(location: WebGLUniformLocation | null, v0: GLuint, v1: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform2ui(location, v0, v1)
        glCheckError(this.context, 'uniform2ui', { location, v0, v1 })
    }

    uniform2uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform2uiv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform2uiv', { location, data, srcOffset, srcLength })
    }

    uniform3ui(location: WebGLUniformLocation | null, v0: GLuint, v1: GLuint, v2: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform3ui(location, v0, v1, v2)
        glCheckError(this.context, 'uniform3ui', { location, v0, v1, v2 })
    }

    uniform3uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform3uiv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform3uiv', { location, data, srcOffset, srcLength })
    }

    uniform4ui(location: WebGLUniformLocation | null, v0: GLuint, v1: GLuint, v2: GLuint, v3: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform4ui(location, v0, v1, v2, v3)
        glCheckError(this.context, 'uniform4ui', { location, v0, v1, v2, v3 })
    }

    uniform4uiv(location: WebGLUniformLocation | null, data: Uint32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform4uiv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform4uiv', { location, data, srcOffset, srcLength })
    }

    uniformBlockBinding(program: WebGLProgram, uniformBlockIndex: GLuint, uniformBlockBinding: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformBlockBinding(program, uniformBlockIndex, uniformBlockBinding)
        glCheckError(this.context, 'uniformBlockBinding', { program, uniformBlockIndex, uniformBlockBinding })
    }

    uniformMatrix2x3fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformMatrix2x3fv(location, transpose, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniformMatrix2x3fv', { location, transpose, data, srcOffset, srcLength })
    }

    uniformMatrix2x4fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformMatrix2x4fv(location, transpose, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniformMatrix2x4fv', { location, transpose, data, srcOffset, srcLength })
    }

    uniformMatrix3x2fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformMatrix3x2fv(location, transpose, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniformMatrix3x2fv', { location, transpose, data, srcOffset, srcLength })
    }

    uniformMatrix3x4fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformMatrix3x4fv(location, transpose, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniformMatrix3x4fv', { location, transpose, data, srcOffset, srcLength })
    }

    uniformMatrix4x2fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformMatrix4x2fv(location, transpose, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniformMatrix4x2fv', { location, transpose, data, srcOffset, srcLength })
    }

    uniformMatrix4x3fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformMatrix4x3fv(location, transpose, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniformMatrix4x3fv', { location, transpose, data, srcOffset, srcLength })
    }

    vertexAttribDivisor(index: GLuint, divisor: GLuint): void
    {
        glClearErrors(this.context)
        this.context.vertexAttribDivisor(index, divisor)
        glCheckError(this.context, 'vertexAttribDivisor', { index, divisor })
    }

    vertexAttribI4i(index: GLuint, x: GLint, y: GLint, z: GLint, w: GLint): void
    {
        glClearErrors(this.context)
        this.context.vertexAttribI4i(index, x, y, z, w)
        glCheckError(this.context, 'vertexAttribI4i', { index, x, y, z, w })
    }

    vertexAttribI4iv(index: GLuint, values: Int32List): void
    {
        glClearErrors(this.context)
        this.context.vertexAttribI4iv(index, values)
        glCheckError(this.context, 'vertexAttribI4iv', { index, values })
    }

    vertexAttribI4ui(index: GLuint, x: GLuint, y: GLuint, z: GLuint, w: GLuint): void
    {
        glClearErrors(this.context)
        this.context.vertexAttribI4ui(index, x, y, z, w)
        glCheckError(this.context, 'vertexAttribI4ui', { index, x, y, z, w })
    }

    vertexAttribI4uiv(index: GLuint, values: Uint32List): void
    {
        glClearErrors(this.context)
        this.context.vertexAttribI4uiv(index, values)
        glCheckError(this.context, 'vertexAttribI4uiv', { index, values })
    }

    vertexAttribIPointer(index: GLuint, size: GLint, type: GLenum, stride: GLsizei, offset: GLintptr): void
    {
        glClearErrors(this.context)
        this.context.vertexAttribIPointer(index, size, type, stride, offset)
        glCheckError(this.context, 'vertexAttribIPointer', { index, size, type, stride, offset })
    }

    waitSync(sync: WebGLSync, flags: GLbitfield, timeout: GLint64): void
    {
        glClearErrors(this.context)
        this.context.waitSync(sync, flags, timeout)
        glCheckError(this.context, 'waitSync', { sync, flags, timeout })
    }   

    //#endregion

    //#region Overloads
    bufferData(target: GLenum, size: GLsizeiptr,             usage: GLenum): void
    bufferData(target: GLenum, srcData: BufferSource | null, usage: GLenum): void
    bufferData(target: GLenum, srcData: ArrayBufferView,     usage: GLenum, srcOffset: GLuint, length?: GLuint): void
    bufferData(target: GLenum, _arg0: ArrayBufferView | GLsizeiptr | BufferSource | null,       usage: GLenum, srcOffset?: GLuint, length?: GLuint): void
    {
        glClearErrors(this.context)
        if (typeof _arg0 === 'number')
        {
            let size = _arg0
            this.context.bufferData(target, size, usage)
            glCheckError(this.context, 'bufferData', { target, size, usage })
        }
        else if (_arg0 && !instanceOfArrayBufferView(_arg0))
        {
            let srcData = _arg0 as BufferSource | null
            const result = this.context.bufferData(target, srcData, usage)
            glCheckError(this.context, 'bufferData', { target, srcData, usage })
        }
        else
        {
            let srcData = _arg0 as ArrayBufferView
            if (length !== undefined)
            {
                this.context.bufferData(target, srcData, usage, srcOffset!, length)
            }
            else
            {
                this.context.bufferData(target, srcData, usage)
            }
            glCheckError(this.context, 'bufferData', { target, srcData, srcOffset, usage })

        }
    }
    
    bufferSubData(target: GLenum, dstByteOffset: GLintptr, srcData: BufferSource): void
    bufferSubData(target: GLenum, dstByteOffset: GLintptr, srcData: ArrayBufferView, srcOffset: GLuint, length?: GLuint): void
    bufferSubData(target: GLenum, dstByteOffset: GLintptr, srcData: ArrayBufferView | BufferSource, srcOffset?: GLuint, length?: GLuint): void
    {
        glClearErrors(this.context)
        if (srcOffset === undefined)
        {
            this.context.bufferSubData(target, dstByteOffset, srcData)
            glCheckError(this.context, 'bufferSubData', { target, dstByteOffset, srcData })
        }
        else
        {
            this.context.bufferSubData(target, dstByteOffset, srcData as ArrayBufferView, srcOffset!, length)
            glCheckError(this.context, 'bufferSubData', { target, dstByteOffset, srcData, srcOffset, length })
        }
    }
    
    // compressedTexImage2D: (target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, border: GLint, imageSize: GLsizei, offset: GLintptr) => void
    // compressedTexImage2D: (target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, border: GLint, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint) => void
    
    // compressedTexSubImage2D: (target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, imageSize: GLsizei, offset: GLintptr) => void
    // compressedTexSubImage2D: (target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint) => void
    
    // readPixels: (x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, dstData: ArrayBufferView | null) => void
    // readPixels: (x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, offset: GLintptr) => void
    // readPixels: (x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, dstData: ArrayBufferView, dstOffset: GLuint) => void
    
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint,                  format: GLenum,  type: GLenum, pixels: ArrayBufferView | null): void
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, format: GLenum, type: GLenum,    source: TexImageSource): void
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint,                  format: GLenum,  type: GLenum, pboOffset: GLintptr): void
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint,                  format: GLenum,  type: GLenum, source: TexImageSource): void
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, border: GLint,                  format: GLenum,  type: GLenum, srcData: ArrayBufferView, srcOffset: GLuint): void
    texImage2D(target: GLenum, level: GLint, internalformat: GLint, _arg0: GLsizei, _arg1: GLsizei,  _arg2: GLint | TexImageSource, format?: GLenum, type?: GLenum, _arg3?: ArrayBufferView | GLintptr | TexImageSource | null, srcOffset?: GLuint)
    {
        
        glClearErrors(this.context)
        if (typeof _arg2 === 'number')
        {
            let width = _arg0
            let height = _arg1
            let border = _arg2
        
            if (typeof _arg3 === 'number')
            {
                let pboOffset = _arg3
                this.context.texImage2D(target, level, internalformat, width, height, border, format!, type!, pboOffset)
                glCheckError(this.context, 'texImage2D', { target, level, internalformat, width, height, border, format, type, pboOffset })
            }
            else if (_arg3 == null || !instanceOfArrayBufferView(_arg3))
            {
                let pixels = _arg3 as ArrayBufferView | null
                this.context.texImage2D(target, level, internalformat, width, height, border, format!, type!, pixels)
                glCheckError(this.context, 'texImage2D', { target, level, internalformat, width, height, border, format, type, pixels })
            }
            else
            {
                let srcData = _arg3 as ArrayBufferView
                if (srcOffset !== undefined)
                {
                    this.context.texImage2D(target, level, internalformat, width, height, border, format!, type!, srcData, srcOffset)
                }
                else
                {
                    this.context.texImage2D(target, level, internalformat, width, height, border, format!, type!, srcData)
                }
                glCheckError(this.context, 'texImage2D', { target, level, internalformat, width, height, border, format, type, srcData, srcOffset })
            }
        }
        else
        {
            let format = _arg0
            let type = _arg1
            let source = _arg2
            const result = this.context.texImage2D(target, level, internalformat, format, type, source)
            glCheckError(this.context, 'texImage2D', { target, level, internalformat, format, type, source })
        }
    }
    
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, pixels: ArrayBufferView | null): void
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, format: GLenum, type: GLenum, source: TexImageSource): void
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, pboOffset: GLintptr): void
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, source: TexImageSource): void
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, srcData: ArrayBufferView, srcOffset: GLuint): void
    texSubImage2D(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, _arg0: GLsizei | GLenum, _arg1: GLsizei | GLenum, _arg2: GLenum | TexImageSource, type?: GLenum, srcData?: ArrayBufferView | GLintptr | TexImageSource | null, srcOffset?: GLuint): void
    {
        glClearErrors(this.context)
        if (typeof _arg2 === 'number')
        {
            let width = _arg0
            let height = _arg1
            let format = _arg2
        
            if (typeof srcData === 'number')
            {
                let pboOffset = srcData
                this.context.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type!, pboOffset)
                glCheckError(this.context, 'texSubImage2D', { target, level, xoffset, yoffset, width, height, format, type, pboOffset })
            }
            else if (srcData == null || !instanceOfArrayBufferView(srcData))
            {
                let pixels = srcData as ArrayBufferView | null
                this.context.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type!, pixels)
                glCheckError(this.context, 'texSubImage2D', { target, level, xoffset, yoffset, width, height, format, type, pixels })
            }
            else
            {
                srcData = srcData as ArrayBufferView
                this.context.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type!, srcData, srcOffset!)
                glCheckError(this.context, 'texSubImage2D', { target, level, xoffset, yoffset, width, height, format, type, srcData, srcOffset })
            }
        }
        else
        {
            let format = _arg0
            let type = _arg1
            let source = _arg2
            this.context.texSubImage2D(target, level, xoffset, yoffset, format, type, source)
            glCheckError(this.context, 'texSubImage2D', { target, level, xoffset, yoffset, format, type, source })
        }
    }
    
    uniform1fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform1fv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform1fv', { location, data, srcOffset, srcLength })
    }

    uniform1iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform1iv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform1iv', { location, data, srcOffset, srcLength })
    }

    uniform2fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform2fv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform2fv', { location, data, srcOffset, srcLength })
    }

    uniform2iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform2iv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform2iv', { location, data, srcOffset, srcLength })
    }

    uniform3fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform3fv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform3fv', { location, data, srcOffset, srcLength })
    }

    uniform3iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform3iv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform3iv', { location, data, srcOffset, srcLength })
    }

    uniform4fv(location: WebGLUniformLocation | null, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform4fv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform4fv', { location, data, srcOffset, srcLength })
    }

    uniform4iv(location: WebGLUniformLocation | null, data: Int32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniform4iv(location, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniform4iv', { location, data, srcOffset, srcLength })
    }

    uniformMatrix2fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformMatrix2fv(location, transpose, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniformMatrix2fv', { location, transpose, data, srcOffset, srcLength })
    }

    uniformMatrix3fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformMatrix3fv(location, transpose, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniformMatrix3fv', { location, transpose, data, srcOffset, srcLength })
    }

    uniformMatrix4fv(location: WebGLUniformLocation | null, transpose: GLboolean, data: Float32List, srcOffset?: GLuint, srcLength?: GLuint): void
    {
        glClearErrors(this.context)
        this.context.uniformMatrix4fv(location, transpose, data, srcOffset, srcLength)
        glCheckError(this.context, 'uniformMatrix4fv', { location, transpose, data, srcOffset, srcLength })
    }    
    //#endregion

    constructor(private context: WebGL2RenderingContext){super();}

    // texImage3DOffset(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, pboOffset: GLintptr)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texImage3D(target, level, internalformat, width, height, depth, border, format, type, pboOffset)
    //     glCheckError(this.context, 'texImage3D', { target, level, internalformat, width, height, depth, border, format, type, pboOffset })
    //     return result
    // }
    // texImage3DSource(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, source: TexImageSource)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texImage3D(target, level, internalformat, width, height, depth, border, format, type, source)
    //     glCheckError(this.context, 'texImage3D', { target, level, internalformat, width, height, depth, border, format, type, source })
    //     return result
    // }
    // texImage3DData(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, srcData: ArrayBufferView | null)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texImage3D(target, level, internalformat, width, height, depth, border, format, type, srcData)
    //     glCheckError(this.context, 'texImage3D', { target, level, internalformat, width, height, depth, border, format, type, srcData })
    //     return result
    // }
    // texImage3DDataOffset(target: GLenum, level: GLint, internalformat: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, border: GLint, format: GLenum, type: GLenum, srcData: ArrayBufferView, srcOffset: GLuint)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texImage3D(target, level, internalformat, width, height, depth, border, format, type, srcData, srcOffset)
    //     glCheckError(this.context, 'texImage3D', { target, level, internalformat, width, height, depth, border, format, type, srcData, srcOffset })
    //     return result
    // }
    // texSubImage3DOffset(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, pboOffset: GLintptr)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pboOffset)
    //     glCheckError(this.context, 'texSubImage3D', { target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, pboOffset })
    //     return result
    // }
    // texSubImage3DSource(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, source: TexImageSource)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, source)
    //     glCheckError(this.context, 'texSubImage3D', { target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, source })
    //     return result
    // }
    // texSubImage3DData(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, zoffset: GLint, width: GLsizei, height: GLsizei, depth: GLsizei, format: GLenum, type: GLenum, srcData: ArrayBufferView | null, srcOffset?: GLuint)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texSubImage3D(target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, srcData, srcOffset)
    //     glCheckError(this.context, 'texSubImage3D', { target, level, xoffset, yoffset, zoffset, width, height, depth, format, type, srcData, srcOffset })
    //     return result
    // }
    // compressedTexImage2DSize(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, border: GLint, imageSize: GLsizei, offset: GLintptr)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.compressedTexImage2D(target, level, internalformat, width, height, border, imageSize, offset)
    //     glCheckError(this.context, 'compressedTexImage2D', { target, level, internalformat, width, height, border, imageSize, offset })
    //     return result
    // }
    // compressedTexImage2DData(target: GLenum, level: GLint, internalformat: GLenum, width: GLsizei, height: GLsizei, border: GLint, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.compressedTexImage2D(target, level, internalformat, width, height, border, srcData, srcOffset, srcLengthOverride)
    //     glCheckError(this.context, 'compressedTexImage2D', { target, level, internalformat, width, height, border, srcData, srcOffset, srcLengthOverride })
    //     return result
    // }
    // compressedTexSubImage2DSize(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, imageSize: GLsizei, offset: GLintptr)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, offset)
    //     glCheckError(this.context, 'compressedTexSubImage2D', { target, level, xoffset, yoffset, width, height, format, imageSize, offset })
    //     return result
    // }
    // compressedTexSubImage2DData(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, srcData: ArrayBufferView, srcOffset?: GLuint, srcLengthOverride?: GLuint)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.compressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, srcData, srcOffset, srcLengthOverride)
    //     glCheckError(this.context, 'compressedTexSubImage2D', { target, level, xoffset, yoffset, width, height, format, srcData, srcOffset, srcLengthOverride })
    //     return result
    // }
    // readPixelsData(x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, dstData: ArrayBufferView | null)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.readPixels(x, y, width, height, format, type, dstData)
    //     glCheckError(this.context, 'readPixels', { x, y, width, height, format, type, dstData })
    //     return result
    // }
    // readPixelsOffet(x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, offset: GLintptr)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.readPixels(x, y, width, height, format, type, offset)
    //     glCheckError(this.context, 'readPixels', { x, y, width, height, format, type, offset })
    //     return result
    // }
    // readPixelsDataOffset(x: GLint, y: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, dstData: ArrayBufferView, dstOffset: GLuint)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.readPixels(x, y, width, height, format, type, dstData, dstOffset)
    //     glCheckError(this.context, 'readPixels', { x, y, width, height, format, type, dstData, dstOffset })
    //     return result
    // }
    // texSubImage2DBuffer(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, pixels: ArrayBufferView | null)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels)
    //     glCheckError(this.context, 'texSubImage2D', { target, level, xoffset, yoffset, width, height, format, type, pixels })
    //     return result
    // }
    // texSubImage2DImage(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, format: GLenum, type: GLenum, source: TexImageSource)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texSubImage2D(target, level, xoffset, yoffset, format, type, source)
    //     glCheckError(this.context, 'texSubImage2D', { target, level, xoffset, yoffset, format, type, source })
    //     return result
    // }
    // texSubImage2DOffset(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, pboOffset: GLintptr)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pboOffset)
    //     glCheckError(this.context, 'texSubImage2D', { target, level, xoffset, yoffset, width, height, format, type, pboOffset })
    //     return result
    // }
    // texSubImage2DSource(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, source: TexImageSource)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, source)
    //     glCheckError(this.context, 'texSubImage2D', { target, level, xoffset, yoffset, width, height, format, type, source })
    //     return result
    // }
    // texSubImage2DData(target: GLenum, level: GLint, xoffset: GLint, yoffset: GLint, width: GLsizei, height: GLsizei, format: GLenum, type: GLenum, srcData: ArrayBufferView, srcOffset: GLuint)
    // {
    //     glClearErrors(this.context)
    //     const result = this.context.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, srcData, srcOffset)
    //     glCheckError(this.context, 'texSubImage2D', { target, level, xoffset, yoffset, width, height, format, type, srcData, srcOffset })
    //     return result
    // }
}

export function glClearErrors(GL: WebGL2RenderingContext): void
{
    // while (GL.getError() !== GL.NO_ERROR) {}
}

export function glCheckError(GL: WebGL2RenderingContext, functionName: string, args: any): void
{
    const errorCode = GL.getError()
    if (errorCode === GL.NO_ERROR)
    {
        return
    }

    const keys = Object.keys(args)
    const func = functionName + '(' + keys.map((key) => {
        let result = key + ': '
        const value = args[key]

        if (value !== undefined && value !== null && typeof value !== 'number' && 'length' in value)
        {
            result += '[' + value.toString() + ']'
        }
        else
        {
            result += value
        }
        return result
    }).join(', ') + ')'

    switch (errorCode)
    {
        case GL.INVALID_ENUM:
            throw new Error(`[WEBGL Error]: "INVALID_ENUM" error created from "${ func }"`)
        case GL.INVALID_VALUE:
            throw new Error(`[WEBGL Error]: "INVALID_VALUE" error created from "${ func }"`)
        case GL.INVALID_OPERATION:
            throw new Error(`[WEBGL Error]: "INVALID_OPERATION" error created from "${ func }"`)
        case GL.OUT_OF_MEMORY:
            throw new Error(`[WEBGL Error]: "OUT_OF_MEMORY" error created from "${ func }"`)
        case GL.INVALID_FRAMEBUFFER_OPERATION:
            throw new Error(`[WEBGL Error]: "INVALID_FRAMEBUFFER_OPERATION" error created from "${ func }"`)
        case GL.CONTEXT_LOST_WEBGL:
            throw new Error(`[WEBGL Error]: "this.context_LOST_WEBGL" error created from "${ func }"`)
    }
}

function instanceOfA<T>(object: any, ...keys: (keyof T)[]): object is T
{
    for (const key in keys)
    {
        if (!(key in object))
        {
            return false;
        }
    }
    return true;
}

const instanceOfArrayBufferView = (object: any) => instanceOfA<ArrayBufferView>(object, 'buffer', 'byteLength', 'byteOffset')
