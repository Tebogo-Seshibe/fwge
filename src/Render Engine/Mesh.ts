import { Item } from "../Game Engine/Item";
import { FWGE } from "../FWGE";

export class IMesh
{
    Name:      string = '';
    Position:  Array<number> = new Array<number>();
    Indices:   Array<number> = new Array<number>();
    Wireframe: Array<number> = new Array<number>();
    UVs:       Array<number> = new Array<number>();
    Colours:   Array<number> = new Array<number>();
    Normals:   Array<number> = new Array<number>();
}

/**
 * @name        Mesh
 * @description The vertex array buffer containers
 * @module      FWGE.Render
 */
export class Mesh extends Item
{
    /**
     * @constant    PositionBuffer: {WebGLBuffer} [read]
     * @description Buffer containing all the vertex position vectors
     */
    public readonly PositionBuffer: WebGLBuffer | null;

    /**
     * @constant    UVBuffer: {WebGLBuffer} [read]
     * @description Buffer containing all the uv coordinate vectors
     */
    public readonly UVBuffer: WebGLBuffer | null;

    /**
     * @constant    ColourBuffer: {WebGLBuffer} [read]
     * @description Buffer containing all the colour for the vertices
     */
    public readonly ColourBuffer: WebGLBuffer | null;

    /**
     * @constant    NormalBuffer: {WebGLBuffer} [read]
     * @description Buffer containing all the nromal vectors
     */
    public readonly NormalBuffer: WebGLBuffer | null;
    
    /**
     * @constant    IndexBuffer: {WebGLBuffer} [read]
     * @description Buffer containing all the indices
     */
    public readonly IndexBuffer: WebGLBuffer | null;
    
    /**
     * @constant    IndexBuffer: {WebGLBuffer} [read]
     * @description Buffer containing all the indices
     */
    public readonly WireframeBuffer: WebGLBuffer | null;
    
    /**
     * @constant    VertexCount: {Number} [read]
     * @description The number of vertices in the mesh
     */
    public readonly VertexCount: number;
    
    /**
     * @constant    VertexCount: {Number} [read]
     * @description The number of vertices in the mesh
     */
    public readonly WireframeCount: number;
    
    constructor(request: IMesh)
    {
        super(request.Name || "Mesh");

        this.VertexCount = request.Indices.length;
        this.WireframeCount = request.Wireframe ? request.Wireframe.length : 0;

        this.PositionBuffer = FWGE.GL.createBuffer();
        FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, this.PositionBuffer);
        FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER, new Float32Array(request.Position), FWGE.GL.STATIC_DRAW);
        
        this.IndexBuffer = FWGE.GL.createBuffer();
        FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, this.IndexBuffer);
        FWGE.GL.bufferData(FWGE.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(request.Indices), FWGE.GL.STATIC_DRAW);
        
        if (!request.Colours || request.Colours.length !== request.Position.length)
            request.Colours = request.Position.map(function(){ return 1.0; });

        this.ColourBuffer = FWGE.GL.createBuffer();
        FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, this.ColourBuffer);
        FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER, new Float32Array(request.Colours), FWGE.GL.STATIC_DRAW);

        if (request.Wireframe)
        {
            this.WireframeBuffer = FWGE.GL.createBuffer();
            FWGE.GL.bindBuffer(FWGE.GL.ELEMENT_ARRAY_BUFFER, this.WireframeBuffer);
            FWGE.GL.bufferData(FWGE.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(request.Wireframe), FWGE.GL.STATIC_DRAW);
        }
        else
            this.WireframeBuffer = null;

        if (request.UVs)
        {
            this.UVBuffer = FWGE.GL.createBuffer();
            FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, this.UVBuffer);
            FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER, new Float32Array(request.UVs), FWGE.GL.STATIC_DRAW);
        }
        else
            this.UVBuffer = null;

        if (request.Normals)
        {
            this.NormalBuffer = FWGE.GL.createBuffer();
            FWGE.GL.bindBuffer(FWGE.GL.ARRAY_BUFFER, this.NormalBuffer);
            FWGE.GL.bufferData(FWGE.GL.ARRAY_BUFFER,new Float32Array(request.Normals), FWGE.GL.STATIC_DRAW);
        }
        else
            this.NormalBuffer = null;
    }
}
