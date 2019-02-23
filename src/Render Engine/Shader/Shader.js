/**
 * @name        Shader
 * @module      FWGE.Render
 * @description This object links with the vertex and fragment shaders
 */

window.Shader = (function()
{
    /**
     * @param       {Object}    request
     * @param       {string}    request.name
     * @param       {number}    request.height
     * @param       {number}    request.width
     * @param       {string}    request.vertexshader
     * @param       {string}    request.fragemntshader
     */
    function Shader({name = "Shader", height = 1024, width = 1024, vertexshader = "", fragmentshader = ""} = {})
    {
        Item.call(this, name);

        Object.defineProperties(this,
        {
            /**
             * @property    {Program}
             * @type        {WebGLProgram}
             */
            Program: { value: FWGE.GL.createProgram(), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Texture}
             * @type        {WebGLTexture}
             */
            Texture: { value: FWGE.GL.createTexture(), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {FrameBuffer}
             * @type        {WebGLFramebuffer}
             */
            FrameBuffer: { value: FWGE.GL.createFramebuffer(), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {RenderBuffer}
             * @type        {WebGLRenderbuffer}
             */
            RenderBuffer: { value: FWGE.GL.createRenderbuffer(), configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Height}
             * @type        {Number}
             */
            Height: { value: height, configurable: false, enumerable: true, writable: false },
            
            /**
             * @property    {Width}
             * @type        {Number}
             */
            Width: { value: width, configurable: false, enumerable: true, writable: false },
        });

        if (Shader.Init(this, FWGE.GL, vertexshader, fragmentshader))
        {
            FWGE.GL.useProgram(this.Program);

            Object.defineProperties(this,
            {
                /**
                 * @property    {Attributes}
                 * @type        {ShaderAttributes}
                 */
                Attributes: { value: new ShaderAttributes(FWGE.GL, this.Program), configurable: false, enumerable: true, writable: false },

                /**
                 * @property    {Uniforms}
                 * @type        {ShaderUniforms}
                 */
                Uniforms: { value: new ShaderUniforms(FWGE.GL, this.Program), configurable: false, enumerable: true, writable: false }
            });

            FWGE.GL.useProgram(null);
        }

        Shader.Shaders.push(this);
    
        Object.seal(this);
    };
    Object.defineProperties(Shader,
    {
        Shaders: { value: new Array(), configurable: false, enumerable: false, writable: false },
        
        /**
         * @function    Init
         * @param       {Shader}                shader
         * @param       {WebGLRenderingContext} GL
         * @param       {string}                vertexshader
         * @param       {string}                fragmentshader
         * @return      {boolean}
         */
        Init:
        {
            value: function Init(shader, GL, vertexShader, fragmentShader)
            {
                GL.bindFramebuffer(GL.FRAMEBUFFER, shader.FrameBuffer); 
                GL.bindRenderbuffer(GL.RENDERBUFFER, shader.RenderBuffer);
                GL.renderbufferStorage(GL.RENDERBUFFER, GL.DEPTH_COMPONENT16, shader.Width, shader.Height);
                GL.bindTexture(GL.TEXTURE_2D, shader.Texture);
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
                GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
                GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, shader.Width, shader.Height, 0, GL.RGBA, GL.UNSIGNED_BYTE, undefined);
                GL.framebufferTexture2D(GL.FRAMEBUFFER, GL.COLOR_ATTACHMENT0, GL.TEXTURE_2D, shader.Texture, 0);
                GL.framebufferRenderbuffer(GL.FRAMEBUFFER, GL.DEPTH_ATTACHMENT, GL.RENDERBUFFER, shader.RenderBuffer);  
                            
                GL.bindTexture(GL.TEXTURE_2D, null);
                GL.bindRenderbuffer(GL.RENDERBUFFER, null);
                GL.bindFramebuffer(GL.FRAMEBUFFER, null);        
                
                var vs = GL.createShader(GL.VERTEX_SHADER);
                GL.shaderSource(vs, vertexShader);
                GL.compileShader(vs);
                if (!GL.getShaderParameter(vs, GL.COMPILE_STATUS))
                {
                    console.error(new Error("Vertex Shader: " + GL.getShaderInfoLog(vs)));
                    return false;
                }
                
                var fs = GL.createShader(GL.FRAGMENT_SHADER);
                GL.shaderSource(fs, fragmentShader);
                GL.compileShader(fs);
                if (!GL.getShaderParameter(fs, GL.COMPILE_STATUS))
                {
                    console.error(new Error("Fragment Shader: " + GL.getShaderInfoLog(fs)));
                    return false;
                }
                
                GL.attachShader(shader.Program, vs);
                GL.attachShader(shader.Program, fs);
                GL.linkProgram(shader.Program);
                if (!GL.getProgramParameter(shader.Program, GL.LINK_STATUS))
                    return false;

                return true;
            },
            configurable: false, enumerable: false, writable: false
        }
    });

    Shader.prototype = Object.create(null);
    Object.seal(Shader.prototype);

    return Shader;
})();
Object.seal(Shader);
