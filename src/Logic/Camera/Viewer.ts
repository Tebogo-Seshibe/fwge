import Item from '../../Item';

export enum ViewMode
{
    PERSPECTIVE,
    ORTHOGRAPHIC,
    LOOKAT
}

export default class Viewer extends Item
{
    public Mode: ViewMode = ViewMode.PERSPECTIVE
    public FieldOfView: number = 35
    public AspectRatio: number = 16 / 9

    public NearClipping: number = 0.1
    public FarClipping: number = 900

    public Left: number = -10
    public Right: number = 10
    public Top: number = 10
    public Bottom: number = -10

    public HorizontalTilt: number = 0
    public VericalTilt: number = 0
}
