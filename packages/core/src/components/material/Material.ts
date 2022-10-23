import { Shader } from "../../base/Shader"
import { Colour3, GL, IBindable, isPowerOf2, Scalar } from "@fwge/common"
import { SharedComponent } from "../../ecs"
import { ImageTexture } from "../../base"
export function* TheThingDoer() {
    let count = 0
    while (true)
        yield count++
}
export const DoTheThing = TheThingDoer()

export enum BlendMode
{
    NONE,
    ADDITIVE,
    SUBTRACTIVE,
    MULTIPLICATIVE
}

export enum RenderType
{
    OPAQUE,
    TRANSPARENT,
    EMISSIVE
}

export interface IMaterial
{
    shader: Shader
    renderType?: RenderType
}

export class Material extends SharedComponent implements IBindable<Float32Array>
{
    static BlockIndex = new Map<string, any>()
    static BindingPoint = new Map<string, number>()

    static Empty: WebGLTexture
    ReceiveShadows: boolean = true
    ProjectsShadows: boolean = true

    Shader: Shader
    RenderType: RenderType
    #alpha: Scalar
    
    readonly MaterialBuffer = GL.createBuffer()!

    readonly Colour: Colour3
    readonly Textures: Array<WebGLTexture | null> = new Array(8).fill(null)
    readonly ImageTextures: Array<ImageTexture | null> = new Array(8).fill(null)

    get Alpha()
    {
        return this.#alpha.Value
    }

    set Alpha(alpha: number)
    {
        this.#alpha.Value = alpha
    }

    constructor(
        shader: Shader,
        renderType?: RenderType,
        readonly BufferData: Float32Array = new Float32Array([1, 1, 1, 1])
    ) {
        super(Material)

        this.Shader = shader
        this.RenderType = renderType ?? RenderType.OPAQUE
        this.Colour = new Colour3()//this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 0)
        this.#alpha = new Scalar()//this.BufferData.buffer, Float32Array.BYTES_PER_ELEMENT * 3)
        
        this.Colour.Set(0.3)
        this.#alpha.Set(1.0)

        if (!Material.Empty)
        {
            Material.Empty = GL.createTexture()!
            GL.bindTexture(GL.TEXTURE_2D, Material.Empty)
            GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
            GL.generateMipmap(GL.TEXTURE_2D)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.NEAREST_MIPMAP_NEAREST)
            GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.NEAREST)
            GL.bindTexture(GL.TEXTURE_2D, null)            
        }
    }
    
    protected applyImage(texture: WebGLTexture, src: string): void
    {    
        GL.bindTexture(GL.TEXTURE_2D, texture)
        GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, 1, 1, 0, GL.RGBA, GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
    
        const img: HTMLImageElement = new Image()
        img.onload = () =>
        {
            setTimeout(() =>
            {
                GL.bindTexture(GL.TEXTURE_2D, texture)
                GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, img)
        
                if (isPowerOf2(img.width) && isPowerOf2(img.height))
                {
                    GL.generateMipmap(GL.TEXTURE_2D)
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST)
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
                }
                else
                {
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
                    GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
                }
        
                GL.bindTexture(GL.TEXTURE_2D, null)
            })
        }
    
        img.src = src
    }

    Bind(): void
    Bind(shader: Shader): void
    Bind(_0?: Shader): void
    {
        // if (this.RenderType === RenderType.OPAQUE)
        // {
            // GL.disable(GL.BLEND)
            // GL.enable(GL.DEPTH_TEST)
            // GL.enable(GL.CULL_FACE)
            // GL.cullFace(GL.BACK)
            // GL.depthMask(true)
        // }
        // else
        // {
        //     GL.enable(GL.BLEND)
        //     GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA)
        // }

        // this.bindBufferData(shader.Program!)
    }

    // private bindBufferData(shaderProgram: WebGLProgram)
    // {
    //     const name = (this as Object).constructor.name + 'Buffer'
    //     let blockIndex = Material.BlockIndex.get(name)!
    //     let bindingPoint = Material.BindingPoint.get(name)!

    //     if (!Material.BlockIndex.has(name))
    //     {
    //         bindingPoint = DoTheThing.next().value!
    //         blockIndex = GL.getUniformBlockIndex(shaderProgram, name)!

    //         Material.BlockIndex.set(name, blockIndex)
    //         Material.BindingPoint.set(name, bindingPoint)

    //         if (blockIndex !== GL.INVALID_INDEX)
    //         {
    //             GL.uniformBlockBinding(shaderProgram, blockIndex, bindingPoint)
    //             GL.bindBufferBase(GL.UNIFORM_BUFFER, bindingPoint, this.MaterialBuffer)
    //             GL.bufferData(GL.UNIFORM_BUFFER, this.BufferData, GL.DYNAMIC_DRAW)
    //         }
    //     }

    //     if (blockIndex !== GL.INVALID_INDEX)
    //     {
    //         GL.bindBuffer(GL.UNIFORM_BUFFER, this.MaterialBuffer)
    //         GL.bufferSubData(GL.UNIFORM_BUFFER, 0, this.BufferData)
    //     }
    // }

    UnBind(): void
    {
        for (let i = 0; i < this.Textures.length; ++i)
        {
            const texture = this.Textures[i]
            if (texture)
            {
                GL.activeTexture(GL.TEXTURE0 + i)
                GL.bindTexture(GL.TEXTURE_2D, null)
            }
        }
    }
}
