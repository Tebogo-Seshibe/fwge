/*!
 *
 */
function Mesh(request)
{        
    var $ = this;
    
    console.log(request);
    GameItem.call($, undefined, "MESH");
    
    Object.defineProperties($,
    {
        VertexCount:      { value: request.indices.length   },
        PositionBuffer:   { value: GL.createBuffer() },
        UVBuffer:         { value: !!request.uvs 		? GL.createBuffer() : undefined },
        ColourBuffer:     { value: !!request.colours 	? GL.createBuffer() : undefined },            
        NormalBuffer:     { value: !!request.normals 	? GL.createBuffer() : undefined },
        IndexBuffer:      { value: GL.createBuffer() }
    });
    
    GL.bindBuffer(GL.ARRAY_BUFFER, $.PositionBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(request.position), GL.STATIC_DRAW);
    GL.bindBuffer(GL.ARRAY_BUFFER, $.UVBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(request.uvs), GL.STATIC_DRAW);
    GL.bindBuffer(GL.ARRAY_BUFFER, $.ColourBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(request.colours), GL.STATIC_DRAW);
    GL.bindBuffer(GL.ARRAY_BUFFER, $.NormalBuffer);
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(request.normals), GL.STATIC_DRAW);
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, $.IndexBuffer);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(request.indices), GL.STATIC_DRAW);
    
    __MESH__.push($);
}

