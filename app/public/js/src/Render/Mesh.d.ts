import Item from '../Item';
import Vector2 from '../Maths/Vector2';
import Vector3 from '../Maths/Vector3';
import Vector4 from '../Maths/Vector4';
export declare enum BufferType {
    INDEX = 0,
    POSITION = 1
}
export declare class IMesh {
    name?: string;
    position?: Array<Vector3> | Float32Array | Array<number>;
    uv?: Array<Vector2> | Float32Array | Array<number>;
    colour?: Array<Vector4> | Float32Array | Array<number>;
    normal?: Array<Vector3> | Float32Array | Array<number>;
    index?: Uint8Array | Array<number>;
    wireframe?: Uint8Array | Array<number>;
}
export default class Mesh extends Item {
    PositionBuffer: WebGLBuffer;
    UVBuffer: WebGLBuffer;
    ColourBuffer: WebGLBuffer;
    NormalBuffer: WebGLBuffer;
    IndexBuffer: WebGLBuffer;
    WireframeBuffer: WebGLBuffer;
    VertexCount: number;
    constructor({ name, position, uv, colour, normal, index, wireframe }?: IMesh);
    private Bind;
    private Unbind;
}
