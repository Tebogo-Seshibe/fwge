import Time from './Time';
import { GameObjects } from '../GameObject';
import Renderer from '../Render/Renderer';
import { Cameras } from '../Camera/Camera';
export default class Control {
    static Init(renderUpdate, physicsUpdate) {
        Time.Init(renderUpdate, physicsUpdate);
        Renderer.Init();
    }
    static Start() {
        if (Control.AnimationFrame !== -1) {
            window.cancelAnimationFrame(Control.AnimationFrame);
        }
        Time.Render.Reset();
        Time.Physics.Reset();
        Control.Run();
    }
    static Stop() {
        if (Control.AnimationFrame !== -1) {
            window.cancelAnimationFrame(Control.AnimationFrame);
        }
    }
    static Run() {
        Control.AnimationFrame = window.requestAnimationFrame(Control.Run);
        Time.Update();
        for (let gameObject of GameObjects) {
            gameObject.Update();
        }
        for (let camera of Cameras) {
            camera.Update();
        }
        if (Time.Render.Ready) {
            Renderer.Update();
        }
    }
}
Control.Running = false;
Control.AnimationFrame = -1;
//# sourceMappingURL=Control.js.map