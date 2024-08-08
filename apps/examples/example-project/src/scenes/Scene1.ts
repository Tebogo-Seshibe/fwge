import { DefaultWindow, Scene } from "@fwge/core";
import { InputSystem } from "@fwge/input";
import { EditorViewer } from "../entities/EditorViewer";
import { Environment } from "../entities/Environment";
import { GeneralAreaLight } from "../entities/GeneralAreaLight";
import { Sun } from "../entities/Sun";

export class Scene1 extends Scene
{
    UseWindows = [ 
        DefaultWindow 
    ];
    UseEntites = [
        GeneralAreaLight,
        EditorViewer,
        Sun,
        Environment,
    ];
    UseSystems = [
        InputSystem,
        // ProjectRenderSystem,
    ];
}
