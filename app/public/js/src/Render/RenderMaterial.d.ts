import Colour4 from './Colour4';
import Item from '../Item';
import Shader from '../Shader/Shader';
export declare class IRenderMaterial {
    name?: string;
    ambient?: Colour4 | Array<number>;
    diffuse?: Colour4 | Array<number>;
    specular?: Colour4 | Array<number>;
    alpha?: number;
    shininess?: number;
    shader?: Shader;
    imagemap?: string;
    normalmap?: string;
    specularmap?: string;
}
export default class RenderMaterial extends Item {
    Ambient: Colour4;
    Diffuse: Colour4;
    Specular: Colour4;
    Alpha: number;
    Shininess: number;
    ImageMap: WebGLTexture;
    BumpMap: WebGLTexture;
    SpecularMap: WebGLTexture;
    Shader: Shader;
    constructor({ name, ambient, diffuse, specular, alpha, shininess, shader, imagemap }?: IRenderMaterial);
    static ApplyImage(material: RenderMaterial, src: string, type: string): void;
}
