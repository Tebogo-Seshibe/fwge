export declare class IFWGE {
    canvas: HTMLCanvasElement;
    renderupdate?: number;
    physcisupdate?: number;
    clear?: Float32Array | Array<number>;
}
export default class FWGE {
    static readonly GL: WebGLRenderingContext;
    static Init({ canvas, renderupdate, physcisupdate, clear }: IFWGE): void;
}
