import Colour4 from './Colour4';
import FWGE from '../FWGE';
import Item from '../Item';
import Maths from '../Maths/Maths';
export class IRenderMaterial {
}
export default class RenderMaterial extends Item {
    constructor({ name = 'Render Material', ambient = [0.50, 0.50, 0.50, 1.00], diffuse = [0.75, 0.75, 0.75, 1.00], specular = [1.00, 1.00, 1.00, 1.00], alpha = 1, shininess = 5, shader, imagemap } = new IRenderMaterial) {
        super(name);
        this.Ambient = new Colour4(ambient);
        this.Diffuse = new Colour4(diffuse);
        this.Specular = new Colour4(specular);
        this.Alpha = alpha;
        this.Shininess = shininess;
        this.Shader = shader;
        if (imagemap) {
            RenderMaterial.ApplyImage(this, imagemap, 'image');
        }
    }
    static ApplyImage(material, src, type) {
        let img = new Image();
        let texture = null;
        switch (type) {
            case 'image':
                material.ImageMap = FWGE.GL.createTexture();
                texture = material.ImageMap;
                break;
            case 'bump':
                material.BumpMap = FWGE.GL.createTexture();
                texture = material.BumpMap;
                break;
            case 'specular':
                material.SpecularMap = FWGE.GL.createTexture();
                texture = material.SpecularMap;
                break;
            default: texture = null;
        }
        FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, texture);
        FWGE.GL.texImage2D(FWGE.GL.TEXTURE_2D, 0, FWGE.GL.RGBA, 1, 1, 0, FWGE.GL.RGBA, FWGE.GL.UNSIGNED_BYTE, new Uint8Array([255, 0, 255, 255]));
        img.onload = function () {
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, texture);
            FWGE.GL.texImage2D(FWGE.GL.TEXTURE_2D, 0, FWGE.GL.RGBA, FWGE.GL.RGBA, FWGE.GL.UNSIGNED_BYTE, img);
            if (Maths.IsPowerOf2(img.width) && Maths.IsPowerOf2(img.height)) {
                FWGE.GL.generateMipmap(FWGE.GL.TEXTURE_2D);
                FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_MAG_FILTER, FWGE.GL.LINEAR);
                FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_MIN_FILTER, FWGE.GL.LINEAR_MIPMAP_NEAREST);
            }
            else {
                FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_WRAP_S, FWGE.GL.CLAMP_TO_EDGE);
                FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_WRAP_T, FWGE.GL.CLAMP_TO_EDGE);
                FWGE.GL.texParameteri(FWGE.GL.TEXTURE_2D, FWGE.GL.TEXTURE_MIN_FILTER, FWGE.GL.LINEAR);
            }
            FWGE.GL.bindTexture(FWGE.GL.TEXTURE_2D, null);
        };
        img.src = src;
    }
}
//# sourceMappingURL=RenderMaterial.js.map