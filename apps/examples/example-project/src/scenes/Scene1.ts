import { DefaultWindow, Scene, ScriptSystem } from "@fwge/core";
import { InputSystem } from "@fwge/input";
import { EditorViewer } from "../entities/EditorViewer";
import { Environment } from "../entities/Environment";
import { GeneralAreaLight } from "../entities/GeneralAreaLight";
import { Sun } from "../entities/Sun";
import { ProjectRenderSystem } from "../systems";

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
        ScriptSystem,
        ProjectRenderSystem,
    ];
    Init(): void {
        super.Init();
        const renderSystem = this.Systems.find(x => x.Name === ProjectRenderSystem.name) as ProjectRenderSystem;
        renderSystem.window = this.Windows[0];
    }
}
