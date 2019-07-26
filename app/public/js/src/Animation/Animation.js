import Item from '../Item';
import Colour4 from '../Render/Colour4';
import Transform from '../Transform';
import Vector3 from '../Maths/Vector3';
import Time from '../Utility/Time';
export class IAnimation {
}
export default class Animation extends Item {
    constructor({ name = 'Animation', gameObject, frames = [], length = 0 } = new IAnimation()) {
        super(name);
        this.ColourFrames = [];
        this.TransformFrames = [];
        this.GameObject = gameObject;
        this.Length = length;
        frames.forEach(frame => {
            if (frame.Value instanceof Transform) {
                this.TransformFrames.push(frame);
            }
            if (frame.Value instanceof Colour4) {
                this.ColourFrames.push(frame);
            }
        });
        this.FrameTime = 0;
        this.MaxFrameTime = this.Length * Time.Render.Period / 1000;
        this.CurrentFrame = null;
        this.Init();
    }
    Init() {
        let start = 0;
        let curr;
        let next;
        for (let i = 0; i < this.TransformFrames.length; ++i) {
            curr = this.TransformFrames[i];
            next = (i != this.TransformFrames.length - 1) ? this.TransformFrames[i + 1] : this.TransformFrames[0];
            let scale = 1 / (next.Time - curr.Time) * Time.Render.Period / 1000;
            start += curr.Time * Time.Render.Period / 1000;
            curr.Start = start;
            curr.Offset = new Transform({
                position: Vector3.Diff(next.Value.Position, curr.Value.Position).Scale(scale),
                rotation: Vector3.Diff(next.Value.Rotation, curr.Value.Rotation).Scale(scale),
                scale: Vector3.Diff(next.Value.Scale, curr.Value.Scale).Scale(scale),
                shear: Vector3.Diff(next.Value.Shear, curr.Value.Shear).Scale(scale)
            });
        }
    }
    Update() {
        this.FrameTime += Time.Render.Delta;
        let offset = Math.max(this.FrameTime, this.MaxFrameTime, 0);
        if (offset > 0) {
            this.FrameTime = offset;
            this.CurrentFrame = this.TransformFrames[0];
            this.GameObject.Transform.Position.Set(this.CurrentFrame.Offset.Position);
            this.GameObject.Transform.Rotation.Set(this.CurrentFrame.Offset.Rotation);
            this.GameObject.Transform.Scale.Set(this.CurrentFrame.Offset.Scale);
            this.GameObject.Transform.Shear.Set(this.CurrentFrame.Offset.Shear);
        }
        else {
            let index = this.TransformFrames.find(frame => offset >= frame.Start && offset <= frame.End).Time;
            this.CurrentFrame = this.TransformFrames[index];
        }
        this.GameObject.Transform.Position.Sum(this.CurrentFrame.Offset.Position);
        this.GameObject.Transform.Rotation.Sum(this.CurrentFrame.Offset.Rotation);
        this.GameObject.Transform.Scale.Sum(this.CurrentFrame.Offset.Scale);
        this.GameObject.Transform.Shear.Sum(this.CurrentFrame.Offset.Shear);
    }
}
//# sourceMappingURL=Animation.js.map