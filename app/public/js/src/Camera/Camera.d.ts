import Item from '../Item';
import Updateable from '../Interfaces/Updateable';
export declare enum ViewMode {
    PERSPECTIVE = 0,
    ORTHOGRAPHIC = 1
}
export declare class ICamera {
    name?: string;
    mode?: ViewMode;
    fieldOfView?: number;
    aspectRatio?: number;
    nearClipping?: number;
    farClipping?: number;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    horizontalTilt?: number;
    vericalTilt?: number;
}
export declare let Cameras: Array<Camera>;
export default class Camera extends Item implements Updateable {
    Mode: ViewMode;
    FieldOfView: ViewMode;
    AspectRatio: number;
    NearClipping: number;
    FarClipping: number;
    Left: number;
    Right: number;
    Top: number;
    Bottom: number;
    HorizontalTilt: number;
    VericalTilt: number;
    static Main: Camera;
    constructor(name: string, mode?: ViewMode, fieldOfView?: number, aspectRatio?: number, nearClipping?: number, farClipping?: number, left?: number, right?: number, top?: number, bottom?: number, horizontalTilt?: number, vericalTilt?: number);
    Update(): void;
}
