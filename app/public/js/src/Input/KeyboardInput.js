import { InputState } from './InputState';
export default class KeyboardInput {
    static get KeyA() {
        return KeyboardInput.Keys[65];
    }
    static get Key0() {
        return KeyboardInput.Keys[48];
    }
    static get Numpad0() {
        return KeyboardInput.Keys[96];
    }
    static SetElement(element) {
        element.onkeyup = (e) => {
            KeyboardInput.Keys[e.keyCode] = InputState.UP;
        };
        element.onkeydown = (e) => {
            if (KeyboardInput.Keys[e.keyCode] == InputState.CLICKED) {
                KeyboardInput.Keys[e.keyCode] = InputState.DOWN;
            }
            else {
                KeyboardInput.Keys[e.keyCode] = InputState.PRESSED;
            }
        };
    }
}
KeyboardInput.Keys = new Array(128);
//# sourceMappingURL=KeyboardInput.js.map