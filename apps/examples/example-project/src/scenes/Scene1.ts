import { DefaultWindow, Scene, ScriptSystem } from "@fwge/core";
import { InputSystem } from "@fwge/input";
import { EditorViewer } from "../entities/EditorViewer";
import { Environment } from "../entities/Environment";
import { GeneralAreaLight } from "../entities/GeneralAreaLight";
import { Grid } from "../entities/Grid";
import { Sun } from "../entities/Sun";
import { ProjectRenderSystem } from "../systems";
import { Lighting } from "../entities/Lighting";

export class Scene1 extends Scene
{
    UseWindows = [ 
        DefaultWindow 
    ];
    UseEntites = [
        // GeneralAreaLight,
        Lighting,
        EditorViewer,
        // Sun,
        Grid,
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
