import Item from '../Item';
import ShaderAttributes from './ShaderAttributes';
import ShaderUniforms from './ShaderUniforms';
declare class IShader {
    name?: string;
    height?: number;
    width?: number;
    vertexshader: string;
    fragmentshader: string;
}
export declare let Shaders: Shader[];
export default class Shader extends Item {
    readonly Attributes: ShaderAttributes;
    readonly Uniforms: ShaderUniforms;
    Program: WebGLProgram;
    Texture: WebGLTexture;
    FrameBuffer: WebGLBuffer;
    RenderBuffer: WebGLBuffer;
    Height: number;
    Width: number;
    constructor({ name, height, width, vertexshader, fragmentshader }: IShader);
    static Init(shader: Shader, gl: WebGLRenderingContext, vertexshader: string, fragmentshader: string): void;
}
export {};
