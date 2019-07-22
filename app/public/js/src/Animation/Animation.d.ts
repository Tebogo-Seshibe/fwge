import AnimationFrame, { Frame } from './AnimationFrame';
import Item from '../Item';
import Updateable from '../Interfaces/Updateable';
import Colour4 from '../Render/Colour4';
import Transform from '../Transform';
import GameObject from '../GameObject';
export declare class IAnimation {
    name?: string;
    gameObject?: GameObject;
    frames?: Array<AnimationFrame<Frame>>;
    length?: number;
}
export default class Animation extends Item implements Updateable {
    ColourFrames: Array<AnimationFrame<Colour4>>;
    TransformFrames: Array<AnimationFrame<Transform>>;
    GameObject: GameObject;
    Length: number;
    FrameTime: number;
    MaxFrameTime: number;
    CurrentFrame: AnimationFrame<Transform>;
    constructor({ name, gameObject, frames, length }?: IAnimation);
    Init(): void;
    Update(): void;
}
