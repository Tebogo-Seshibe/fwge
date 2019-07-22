import Control from './Utility/Control';
import MouseInput from './Input/MouseInput';
import KeyboardInput from './Input/KeyboardInput';
let GL;
export class IFWGE {
}
export default class FWGE {
    static get GL() {
        return GL;
    }
    static Init({ canvas, renderupdate = 60, physcisupdate = 30, clear = [0, 0, 0, 1] }) {
        if (!canvas) {
            throw new Error('Field {canvas: HTMLCanvasElement} is required');
        }
        GL = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!GL) {
            throw new Error('Webgl context could not be initialized.');
        }
        GL.clearColor(clear[0], clear[1], clear[2], clear[3]);
        Control.Init(renderupdate, physcisupdate);
        MouseInput.SetElement(canvas);
        KeyboardInput.SetElement(canvas);
    }
}
//# sourceMappingURL=FWGE.js.map