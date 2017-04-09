var __MESH__ = [];

/**
 * @name        Mesh
 * @description The vertex array buffer containers
 * @module      FWGE.Render
 */
function Mesh(request)
{   
    if (!request) request = {};
    if (!request.type) request.type = "";
    request.type += "MESH ";
    
    GameItem.call(this, request);
    
    function validate(array, constructor)
    {
        var i = array.length;

        while (--i > 0)
            if (typeof array[i] !== 'number')
                return undefined;

        return new constructor(array);
    }

    request.position    = validate(request.position, Float32Array);
    request.uvs         = validate(request.uvs,     Float32Array);
    request.colours     = validate(request.colours, Float32Array);
    request.normals     = validate(request.normals, Float32Array);
    request.indices     = validate(request.indices, Uint16Array);

    Object.defineProperties(this,
    {
        /**
         * @constant    PositionBuffer: {WebGLBuffer} [read]
         * @description Buffer containing all the vertex position vectors
         */
        PositionBuffer: { value: GL.createBuffer() },

        /**
         * @constant    UVBuffer: {WebGLBuffer} [read]
         * @description Buffer containing all the uv coordinate vectors
         */
        UVBuffer: { value: GL.createBuffer() },

        /**
         * @constant    ColourBuffer: {WebGLBuffer} [read]
         * @description Buffer containing all the colour for the vertices
         */
        ColourBuffer: { value: GL.createBuffer() },

        /**
         * @constant    NormalBuffer: {WebGLBuffer} [read]
         * @description Buffer containing all the nromal vectors
         */
        NormalBuffer: { value: GL.createBuffer() },
        
        /**
         * @constant    IndexBuffer: {WebGLBuffer} [read]
         * @description Buffer containing all the indices
         */
        IndexBuffer: { value: GL.createBuffer() },
        
        /**
         * @constant    VertexCount: {Number} [read]
         * @description The number of vertices in the mesh
         */
        VertexCount: { value: !!request.indices ? request.indices.length : 0 }
    });

    if (!!request.position)
    {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.PositionBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, request.position, GL.STATIC_DRAW);
    }
    if (!!request.uvs)
    {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.UVBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, request.uvs, GL.STATIC_DRAW);
    }
    if (!!request.colours)
    {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.ColourBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, request.colours, GL.STATIC_DRAW);
    }
    if (!!request.normals)
    {
        GL.bindBuffer(GL.ARRAY_BUFFER, this.NormalBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, request.normals, GL.STATIC_DRAW);
    }
    if (!!request.indices)
    {
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, request.indices, GL.STATIC_DRAW);
    }
    
    __MESH__.push(this);
}

