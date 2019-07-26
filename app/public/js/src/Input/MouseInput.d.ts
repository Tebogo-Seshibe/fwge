import { InputState } from './InputState';
import Vector2 from '../Maths/Vector2';
export default class MouseInput {
    static Buttons: Array<InputState>;
    static Axes: Vector2;
    static Delta: Vector2;
    static SetElement(element: HTMLElement): void;
}
