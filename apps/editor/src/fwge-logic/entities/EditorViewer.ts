import { PerspectiveCamera, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";
import { EditorTag } from "../components/EditorTag";

export class EditorViewer extends Entity
{
    override Init(): void
    {
        this.AddComponents(
            new EditorTag(),
            new Transform(
            {
                position: [-2,1,10],
                rotation: [0,15,0],
                scale: [1,1,1]
            }),
            new PerspectiveCamera()
        );
    }
}