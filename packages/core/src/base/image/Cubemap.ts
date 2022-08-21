import { GL, isPowerOf2 } from "@fwge/common"
import { ImageTexture } from "./ImageTexture"

export type SquareUVs = 
{
    minX: number
    minY: number
    maxX: number
    maxY: number
}

export interface ICubemap
{
    src: string
    top: SquareUVs
    bottom: SquareUVs
    left: SquareUVs
    right: SquareUVs
    front: SquareUVs
    back: SquareUVs
    height: number
    width: number
}

export class Cubemap extends ImageTexture
{
    constructor(args: ICubemap)
    {
        super()
        this.cropImage(args.src, args.top, args.width, args.height, GL.TEXTURE_CUBE_MAP_POSITIVE_Y)
        this.cropImage(args.src, args.bottom, args.width, args.height, GL.TEXTURE_CUBE_MAP_NEGATIVE_Y)
        this.cropImage(args.src, args.left, args.width, args.height, GL.TEXTURE_CUBE_MAP_POSITIVE_X)
        this.cropImage(args.src, args.right, args.width, args.height, GL.TEXTURE_CUBE_MAP_NEGATIVE_X)
        this.cropImage(args.src, args.front, args.width, args.height, GL.TEXTURE_CUBE_MAP_POSITIVE_Z)
        this.cropImage(args.src, args.back, args.width, args.height, GL.TEXTURE_CUBE_MAP_NEGATIVE_Z)
    }


    cropImage(src: string, uvs: SquareUVs, width: number, height: number, target: number)
    {    
        const img = new Image()
        img.onload = () =>
        {
            const context = document.createElement('canvas')!.getContext('2d')!
            context.canvas.height = height
            context.canvas.width = width
            const x = uvs.minX
            const y = uvs.minY
            const dx = uvs.maxX - uvs.minX
            const dy = uvs.maxY - uvs.minY

            context.drawImage(img, x, y, dx, dy, 0, 0, width, height)

            GL.bindTexture(GL.TEXTURE_CUBE_MAP, this.Texture)
            GL.texImage2D(target, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, context.canvas)

            if (isPowerOf2(img.width) && isPowerOf2(img.height))
            {
                GL.generateMipmap(GL.TEXTURE_CUBE_MAP)
                GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_MAG_FILTER, GL.LINEAR)
                GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_MIN_FILTER, GL.LINEAR_MIPMAP_NEAREST)
            }
            else
            {
                GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE)
                GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE)
                GL.texParameteri(GL.TEXTURE_CUBE_MAP, GL.TEXTURE_MIN_FILTER, GL.LINEAR)
            }
            GL.bindTexture(GL.TEXTURE_CUBE_MAP, null)
        }

        img.src = src
    }
}