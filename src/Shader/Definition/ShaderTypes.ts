class ShaderFieldType<T>
{
    public name: string
    public value: T
    public type: string

    constructor(name: string, value: T, type: string)
    {
        this.name = name
        this.value = value
        this.type = type
    }
}

export class ShaderBool extends ShaderFieldType<boolean>
{
    constructor(name: string, value: boolean)
    {
        super(name, value, 'bool')
    } 
}   

export class ShaderInt extends ShaderFieldType<number>
{
    constructor(name: string, value: number)
    {
        super(name, value, 'int')
    }
}   

export class ShaderUInt extends ShaderFieldType<number>
{
    constructor(name: string, value: number)
    {
        super(name, value, 'uint')
    }
}

export class ShaderFloat extends ShaderFieldType<number>
{
    constructor(numbername: string, value: number)
    {
        super(name, value, 'float')
    }
}

export class ShaderBVec2 extends ShaderFieldType<[boolean, boolean]>
{
    constructor(name: string, value: [boolean, boolean])
    {
        super(name, value, 'bvec2')
    }
}

export class ShaderBVec3 extends ShaderFieldType<[boolean, boolean, boolean]>
{
    constructor(name: string, value: [boolean, boolean, boolean])
    {
        super(name, value, 'bvec3')
    }
}

export class ShaderBVec4 extends ShaderFieldType<[boolean, boolean, boolean, boolean]>
{
    constructor(name: string, value: [boolean, boolean, boolean, boolean])
    {
        super(name, value,'bvec4')
    }
}

export class ShaderIVec2 extends ShaderFieldType<[number, number]>
{
    constructor(name: string, value: [number, number])
    {
        super(name, value, 'ivec2')
    }
}

export class ShaderIVec3 extends ShaderFieldType<[number, number, number]>
{
    constructor(name: string, value: [number, number, number])
    {
        super(name, value, 'ivec3')
    }
}

export class ShaderIVec4 extends ShaderFieldType<[number, number, number, number]>
{
    constructor(name: string, value: [number, number, number, number])
    {
        super(name, value, 'ivec4')
    }
}

export class ShaderUVec2 extends ShaderFieldType<[number, number]>
{
    constructor(name: string, value: [number, number])
    {
        super(name, value, 'uvec2')
    }
}

export class ShaderUVec3 extends ShaderFieldType<[number, number, number]>
{
    constructor(name: string, value: [number, number, number])
    {
        super(name, value, 'uvec3')
    }
}

export class ShaderUVec4 extends ShaderFieldType<[number, number, number, number]>
{
    constructor(name: string, value: [number, number, number, number])
    {
        super(name, value, 'uvec4')
    }
}

export class ShaderVec2 extends ShaderFieldType<[number, number]>
{
    constructor(name: string, value: [number, number])
    {
        super(name, value, 'vec2')
    }
}   

export class ShaderVec3 extends ShaderFieldType<[number, number, number]>
{
    constructor(name: string, value: [number, number, number])
    {
        super(name, value, 'vec3')
    }
}   

export class ShaderVec4 extends ShaderFieldType<[number, number, number, number]>
{
    constructor(name: string, value: [number, number, number, number])
    {
        super(name, value, 'vec4')
    }
}   

export class ShaderMat2 extends ShaderFieldType<[number, number, number, number]>
{
    constructor(name: string, value: [number, number, number, number])
    {
        super(name, value, 'mat2')
    }
}   

export class ShaderMat3 extends ShaderFieldType<[number, number, number, number, number, number, number, number, number]>
{
    constructor(name: string, value: [number, number, number, number, number, number, number, number, number])
    {
        super(name, value, 'mat3')
    }
}   

export class ShaderMat4 extends ShaderFieldType<[number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]>
{
    constructor(name: string, value: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number])
    {
        super(name, value, 'mat4')
    }
}

export type ShaderField =  
    ShaderBool  | ShaderInt     | ShaderUInt    | ShaderFloat |
    ShaderBVec2 | ShaderBVec3   | ShaderBVec4   |
    ShaderIVec2 | ShaderIVec3   | ShaderIVec4   |
    ShaderUVec2 | ShaderUVec3   | ShaderUVec4   |
    ShaderVec2  | ShaderVec3    | ShaderVec4    |
    ShaderMat2  | ShaderMat3    | ShaderMat4

export class ShaderNode
{
    public Content: ShaderField
    public Inputs: ShaderNode[]
    public Output: (...inputs: ShaderNode[]) => ShaderNode

    constructor(content: ShaderField, output: (...inputs: ShaderNode[]) => ShaderNode, inputs?: ShaderNode[])
    {
        this.Content = content
        this.Output = output
        this.Inputs = inputs
    }
}

new ShaderNode(new ShaderVec4('colour', [0,0,0,0]),
() => null,
[
    new ShaderNode(new ShaderFloat('red', 1), null), // red
    new ShaderNode(new ShaderFloat('green', 1), null), // green
    new ShaderNode(new ShaderFloat('blue', 1), null) // blue
])