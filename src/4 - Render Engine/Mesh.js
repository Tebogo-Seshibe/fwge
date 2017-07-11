/**
 * @name        Mesh
 * @module      FWGE.Render
 * @description The vertex array buffer containers
 */

window.Mesh = (function()
{
    /**
     * @param   {Object}    request
     * @param   {string}    request.name
     * @param   {Array}     request.position
     * @param   {Array}     request.uv
     * @param   {Array}     request.colouur
     * @param   {Array}     request.normal
     * @param   {Array}     request.index
     * @param   {Array}     request.wireframe
     */
    function Mesh({name = "Mesh", position = undefined, uv = undefined, colour = undefined, normal = undefined, index = undefined, wireframe = undefined} = {})
    {
        Item.call(this, name);

        Object.defineProperties(this,
        {
            /**
             * @constant    {PositionBuffer}
             * @type        {WebGLBuffer}
             */
            PositionBuffer: { value: FWGE.GL.createBuffer(), configurable: false, enumerable: true, writable: false },

            /**
             * @constant    {UVBuffer}
             * @type        {WebGLBuffer}
             */
            UVBuffer: { value: !!uv ? FWGE.GL.createBuffer() : null, configurable: false, enumerable: true, writable: false },

            /**
             * @constant    {ColourBuffer}
             * @type        {WebGLBuffer}
             */
            ColourBuffer: { value: FWGE.GL.createBuffer(), configurable: false, enumerable: true, writable: false },

            /**
             * @constant    {NormalBuffer}
             * @type        {WebGLBuffer}
             */
            NormalBuffer: { value: !!normal ? FWGE.GL.createBuffer() : null, configurable: false, enumerable: true, writable: false },
            
            /**
             * @constant    {IndexBuffer}
             * @type        {WebGLBuffer}
             */
            IndexBuffer: { value: FWGE.GL.createBuffer(), configurable: false, enumerable: true, writable: false },
            
            /**
             * @constant    {IndexBuffer}
             * @type        {WebGLBuffer}
             */
            WireframeBuffer: { value: !!wireframe ? FWGE.GL.createBuffer() : null, configurable: false, enumerable: true, writable: false },
            
            /**
             * @constant    {VertexCount}
             * @type        {number}
             */
            VertexCount: { value: !!index ? index.length : 0, configurable: false, enumerable: true, writable: false },
            
            /**
             * @constant    {VertexCount}
             * @type        {number}
             */
            WireframeCount: { value: !!wireframe ? wireframe.length : 0, configurable: false, enumerable: true, writable: false },

            /**
             * @property    {DrawWireframe}
             * @type        {boolean}
             */
            DrawWireframe: { value: false, configurable: false, enumerable: true, writable: true }
        });

        FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, this.PositionBuffer);
        FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER, new Float32Array(position), FWGE.GL.STATIC_DRAW);
        
        FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);
        FWGE.GL.bufferData(FWGE.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), FWGE.GL.STATIC_DRAW);
        
        if (!colour || colour.length !== position.length)
            colour = position.map(function(){ return 1.0; });

        FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, this.ColourBuffer);
        FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER, new Float32Array(colour), FWGE.GL.STATIC_DRAW);

        if (!!this.WireframeBuffer)
        {
            FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, this.WireframeBuffer);
            FWGE.GL.bufferData(FWGE.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(wireframe), FWGE.GL.STATIC_DRAW);
        }

        if (!!this.UVBuffer)
        {
            FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, this.UVBuffer);
            FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER, new Float32Array(uv), FWGE.GL.STATIC_DRAW);
        }

        if (!!this.NormalBuffer)
        {
            FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, this.NormalBuffer);
            FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER, new Float32Array(normal), FWGE.GL.STATIC_DRAW);
        }
        
        Object.seal(this);
    }

    Mesh.prototype = Object.create(null);
    Object.seal(Mesh.prototype);

    return Mesh;
})();
Object.seal(Mesh);
