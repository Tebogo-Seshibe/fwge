import { DefaultWindow, Scene, ScriptSystem } from "@fwge/core";
import { InputSystem } from "@fwge/input";
import { Cube } from "../entities/Cube";
import { EditorViewer } from "../entities/EditorViewer";
import { Lighting } from "../entities/Lighting";
import { ProjectRenderSystem } from "../systems";
import { Helipad } from "../entities/Helipad";

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
        // Environment,
        // Helipad,
        Cube,
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
