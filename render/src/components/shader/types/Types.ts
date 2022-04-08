import { GL } from "@fwge/common"
import { Entity } from "@fwge/core"

export class ShaderFieldType<T>
{
    public Id: number = -1
    public Location: WebGLUniformLocation | null = null
    public Name?: string    
    public Offset: number = 0

    constructor(
        public readonly Type: GLenum,
        public readonly Size: number,
        public readonly Normalized: boolean,
        public readonly Bind: (data: any) => void,
        public readonly Accessor: (arg: Entity) => WebGLBuffer,
        public readonly Transpose: boolean = false
    ) { }
}

export class ShaderBool extends ShaderFieldType<boolean>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.BOOL, 3, false, (data: boolean) => GL.uniform1ui(this.Location, data ? 0 : 1), accessor)
    }
}   

export class ShaderInt extends ShaderFieldType<number>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.INT, 3, false, (data: number) => GL.uniform1i(this.Location, data), accessor)
    }
}   

export class ShaderUInt extends ShaderFieldType<number>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.UNSIGNED_INT, 3, false, (data: number) => GL.uniform1ui(this.Location, data), accessor)
    }
}

export class ShaderFloat extends ShaderFieldType<number>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.FLOAT, 3, false, (data: number) => GL.uniform1f(this.Location, data), accessor)
    }
}

export class ShaderBVec2 extends ShaderFieldType<[boolean, boolean]>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.BOOL_VEC2, 3, false, (data: [boolean, boolean]) => GL.uniform2uiv(this.Location, data.map(x => x ? 1 : 0)), accessor)
    }
}

export class ShaderBVec3 extends ShaderFieldType<[boolean, boolean, boolean]>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.BOOL_VEC3, 3, false, (data: [boolean, boolean, boolean]) => GL.uniform3uiv(this.Location, data.map(x => x ? 1 : 0)), accessor)
    }
}

export class ShaderBVec4 extends ShaderFieldType<[boolean, boolean, boolean, boolean]>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.BOOL_VEC4, 3, false, (data: [boolean, boolean, boolean, boolean]) => GL.uniform4uiv(this.Location, data.map(x => x ? 1 : 0)), accessor)
    }
}

export class ShaderIVec2 extends ShaderFieldType<[number, number]>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.INT_VEC2, 3, false, (data: [number, number]) => GL.uniform2iv(this.Location, data), accessor)
    }
}

export class ShaderIVec3 extends ShaderFieldType<[number, number, number]>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.INT_VEC3, 3, false, (data: [number, number, number]) => GL.uniform3iv(this.Location, data), accessor)
    }
}

export class ShaderIVec4 extends ShaderFieldType<[number, number, number, number]>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.INT_VEC4, 3, false, (data: [number, number, number, number]) => GL.uniform4iv(this.Location, data), accessor)
    }
}

export class ShaderUVec2 extends ShaderFieldType<[number, number]>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.UNSIGNED_INT_VEC2, 3, false, (data: [number, number]) => GL.uniform2uiv(this.Location, data), accessor)
    }
}

export class ShaderUVec3 extends ShaderFieldType<[number, number, number]>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.UNSIGNED_INT_VEC3, 3, false, (data: [number, number, number]) => GL.uniform3uiv(this.Location, data), accessor)
    }
}

export class ShaderUVec4 extends ShaderFieldType<[number, number, number, number]>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.UNSIGNED_INT_VEC4, 3, false, (data: [number, number, number, number]) => GL.uniform4uiv(this.Location, data), accessor)
    }
}

export class ShaderVec2 extends ShaderFieldType<[number, number]>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.FLOAT, 2, false, (data: [number, number]) => GL.uniform2fv(this.Location, data), accessor)
    }
}   

export class ShaderVec3 extends ShaderFieldType<[number, number, number]>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.FLOAT, 3, false, (data: [number, number, number]) => GL.uniform3fv(this.Location, data), accessor)
    }
}   

export class ShaderVec4 extends ShaderFieldType<[number, number, number, number]>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.FLOAT, 4, false, (data: [number, number, number, number]) => GL.uniform4fv(this.Location, data), accessor)
    }
}   

export class ShaderMat2 extends ShaderFieldType<[number, number, number, number]>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.FLOAT_MAT2, 3, false, (data: [number, number, number, number]) => GL.uniformMatrix2fv(this.Location, this.Transpose, data), accessor)
    }
}   

export class ShaderMat3 extends ShaderFieldType<[number, number, number, number, number, number, number, number, number]>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.FLOAT_MAT3, 3, false, (data: [number, number, number, number, number, number, number, number, number]) => GL.uniformMatrix3fv(this.Location, this.Transpose, data), accessor)
    }
}   

export class ShaderMat4 extends ShaderFieldType<[number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]>
{
    constructor(accessor: (arg: Entity) => WebGLBuffer)
    {
        super(GL.FLOAT_MAT4, 3, false, (data: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]) => GL.uniformMatrix4fv(this.Location, this.Transpose, data), accessor)
    }
}
