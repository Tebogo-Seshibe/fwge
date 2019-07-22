import { InputState } from './InputState';
export default class KeyboardInput {
    static Keys: Array<InputState>;
    static readonly KeyA: InputState;
    static readonly Key0: InputState;
    static readonly Numpad0: InputState;
    static SetElement(element: HTMLElement): void;
}
