import { InputState } from './InputState';
import Vector2 from '../Maths/Vector2';
export default class MouseInput {
    static SetElement(element) {
        element.onmouseup = (e) => {
            MouseInput.Buttons[e.button] = InputState.UP;
        };
        element.onmousedown = (e) => {
            MouseInput.Buttons[e.button] = InputState.DOWN;
        };
        element.onmousemove = (e) => {
            MouseInput.Delta.Set(e.clientX - MouseInput.Axes.X, e.clientY - MouseInput.Axes.Y);
            MouseInput.Axes.Set(e.clientX, e.clientY);
        };
    }
}
MouseInput.Buttons = new Array(20);
MouseInput.Axes = new Vector2();
MouseInput.Delta = new Vector2();
//# sourceMappingURL=MouseInput.js.map