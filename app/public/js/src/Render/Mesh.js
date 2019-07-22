import ArrayUtiils from '../Utility/ArrayUtils';
import FWGE from '../FWGE';
import Item from '../Item';
export var BufferType;
(function (BufferType) {
    BufferType[BufferType["INDEX"] = 0] = "INDEX";
    BufferType[BufferType["POSITION"] = 1] = "POSITION";
})(BufferType || (BufferType = {}));
export class IMesh {
}
export default class Mesh extends Item {
    constructor({ name = 'Mesh', position, uv, colour, normal, index, wireframe } = new IMesh()) {
        super(name);
        if (colour && colour.length === 0) {
            colour = undefined;
        }
        if (uv && uv.length === 0) {
            uv = undefined;
        }
        if (wireframe && wireframe.length === 0) {
            wireframe = undefined;
        }
        this.PositionBuffer = this.Bind(FWGE.GL, BufferType.POSITION, position);
        this.UVBuffer = this.Bind(FWGE.GL, BufferType.POSITION, uv);
        this.ColourBuffer = this.Bind(FWGE.GL, BufferType.POSITION, colour);
        this.NormalBuffer = this.Bind(FWGE.GL, BufferType.POSITION, normal);
        this.IndexBuffer = this.Bind(FWGE.GL, BufferType.INDEX, index);
        this.WireframeBuffer = this.Bind(FWGE.GL, BufferType.INDEX, wireframe);
        this.VertexCount = index.length;
    }
    Bind(gl, type, data) {
        if (!data) {
            return null;
        }
        let buffer = gl.createBuffer();
        data = ArrayUtiils.Flatten(data);
        switch (type) {
            case BufferType.INDEX:
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(data), gl.STATIC_DRAW);
                break;
            case BufferType.POSITION:
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
                break;
        }
        return buffer;
    }
    Unbind(gl, buffer) {
        gl.deleteBuffer(buffer);
    }
}
//# sourceMappingURL=Mesh.js.map