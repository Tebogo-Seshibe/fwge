import { Vector2, Vector2Array } from "@fwge/common";
import { Camera, PerspectiveCamera, StaticMesh } from "../../components";
import { Scene } from "../Scene";
import { RenderPipelineMode } from "./RenderPipelineMode";
import { RenderPipelineStep } from "./RenderPipelineStep";
import { ColourType, DepthType, RenderTarget } from "./RenderTarget";

export interface IRenderWindow
{
    resolution?: Vector2 | Vector2Array;
    offset?: Vector2 | Vector2Array;
    scale?: Vector2 | Vector2Array;
    renderPipelineMode?: RenderPipelineMode;
    camera?: Camera;
    mainPass?: RenderPipelineStep;
    pipeline?: RenderPipelineStep[];
}

export class RenderWindow
{
    static readonly MainPassName = 'MAIN_PASS';

    readonly RenderPipelineMode: RenderPipelineMode;
    readonly MainPass: RenderPipelineStep;
    readonly RenderPipeline: RenderPipelineStep[];
    readonly RenderPipelineMap: Map<string, number>;

    readonly Resolution: Vector2;
    readonly Offset: Vector2;
    readonly Scale: Vector2;

    private static _panel: StaticMesh;

    get Panel(): StaticMesh
    {
        if (!RenderWindow._panel)
        {
            RenderWindow._panel = new StaticMesh(
                {
                    position: [
                        [-1,  1, 0],
                        [-1, -1, 0],
                        [ 1, -1, 0],
                        [ 1,  1, 0],
                    ],
                    index: [
                        0, 1, 2,
                        0, 2, 3,
                    ]
                });
        }

        return RenderWindow._panel;
    }

    Camera: Camera;

    get FinalComposite(): RenderTarget
    {
        if (this.RenderPipeline.any())
        {
            return this.RenderPipeline.last.Output;
        }
        else
        {
            return this.MainPass.Output;
        }
    }

    constructor(scene: Scene);
    constructor(scene: Scene, window: IRenderWindow);
    constructor(_scene: Scene, window: IRenderWindow = {})
    {
        this.Camera = window.camera ?? new PerspectiveCamera();
        this.Resolution = new Vector2(window.resolution as Vector2Array ?? [1920, 1080]);
        this.Offset = new Vector2(window.offset as Vector2Array ?? [0, 0]);
        this.Scale = new Vector2(window.scale as Vector2Array ?? [1, 1]);
        this.RenderPipelineMode = window.renderPipelineMode ?? RenderPipelineMode.FORWARD;
        this.RenderPipeline = window.pipeline ?? [];
        this.RenderPipelineMap = new Map([[RenderWindow.MainPassName, -1]]);
        this.RenderPipeline.forEach((step, index) => this.RenderPipelineMap.set(step.Name, index));

        if (window.mainPass)
        {
            this.MainPass = window.mainPass;
        }
        else
        {
            switch (this.RenderPipelineMode)
            {
                case RenderPipelineMode.DEFERRED:
                    this.MainPass = new RenderPipelineStep(
                        {
                            name: RenderWindow.MainPassName,
                            output: new RenderTarget(
                                {
                                    colour: [
                                        ColourType.FLOAT_RGB, // [Position.X, Position.Y, Position.Z]
                                        ColourType.FLOAT_RGB, // [Normal.X, Normal.Y, Normal.Z]
                                        ColourType.BYTE_RGBA, // [Colour.R, Colour.G, Colour.B, Specular]
                                    ],
                                    depth: DepthType.FLOAT32,
                                    height: this.Resolution[1] * this.Scale[1],
                                    width: this.Resolution[0] * this.Scale[0],
                                }),
                            shader: null!
                        });
                    break;

                case RenderPipelineMode.FORWARD:
                    this.MainPass = new RenderPipelineStep(
                        {
                            name: RenderWindow.MainPassName,
                            output: new RenderTarget(
                                {
                                    colour: [
                                        ColourType.BYTE_RGBA, // [Colour.R, Colour.G, Colour.B, Colour.A]
                                    ],
                                    depth: DepthType.FLOAT32,
                                    height: this.Resolution.Y * this.Scale.Y,
                                    width: this.Resolution.X * this.Scale.X,
                                }),
                            shader: null!
                        });
                    break;
            }
        }
    }
}
