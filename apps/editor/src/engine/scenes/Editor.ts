import { DefaultWindow, Scene, ScriptSystem } from "@fwge/core";
import { InputSystem } from "@fwge/input";
import { EditorViewer } from "../entities/EditorViewer";
import { Environment } from "../entities/Environment";
import { GeneralAreaLight } from "../entities/GeneralAreaLight";
import { Grid } from "../entities/Grid";
import { Sun } from "../entities/Sun";
import { ProjectRenderSystem } from "../systems";

export class EditorScene extends Scene {
    UseWindows = [
        DefaultWindow
    ];
    UseEntites = [
        Grid,
        GeneralAreaLight,
        Sun,
        EditorViewer,
        Environment
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
