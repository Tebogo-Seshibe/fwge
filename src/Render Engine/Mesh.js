var __MESH__ = [];

/*!
 *  @constructor    Mesh
 *  @description    The vertex array buffer containers 
 *  @param          {Object: request}
 *                  {Array: position}
 *                  {Array: uvs}
 *                  {Array: colours}
 *                  {Array: normals}
 *                  {Array: indices}
 */
function Mesh(request)
{   
    if (!request) request = {};
    request.type = "MESH";
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
        /*!
         *  @property       {WebGLBuffer: PositionBuffer}
         *  @description    Vertex buffer object for the 
         */
        PositionBuffer: { value: GL.createBuffer() },

        /*!
         *  @property       {WebGLBuffer: UVBuffer}
         *  @description    Hello
         */
        UVBuffer: { value: GL.createBuffer() },

        /*!
         *  @property       {WebGLBuffer: ColourBuffer}
         *  @description    Hello
         */
        ColourBuffer: { value: GL.createBuffer() },

        /*!
         *  @property       {WebGLBuffer: NormalBuffer}
         *  @description    Hello
         */
        NormalBuffer: { value: GL.createBuffer() },
        
        /*!
         *  @property       {WebGLBuffer: IndexBuffer}
         *  @description    Hello
         */
        IndexBuffer: { value: GL.createBuffer() },
        
        /*!
         *  @property       {Number: VertexCount}
         *  @description    Hello
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

