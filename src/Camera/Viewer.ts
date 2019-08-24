import Item from '../Item';

export enum ViewMode
{
    PERSPECTIVE,
    ORTHOGRAPHIC
}

export default class Viewer extends Item
{
    public Mode: ViewMode
    public FieldOfView: number
    public AspectRatio: number

    public NearClipping: number
    public FarClipping: number

    public Left: number
    public Right: number
    public Top: number
    public Bottom: number

    public HorizontalTilt: number
    public VericalTilt: number
}
