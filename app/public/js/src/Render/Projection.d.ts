import Matrix4 from '../Maths/Matrix4';
export default class Projection {
    static Orthographic(left: number, right: number, top: number, bottom: number, near: number, far: number, theta: number, phi: number): Matrix4;
    static Perspective(field_of_view: number, aspect_ratio: number, near: number, far: number): Matrix4;
}
