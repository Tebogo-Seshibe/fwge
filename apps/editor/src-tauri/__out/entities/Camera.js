import { PerspectiveCamera, Transform } from "@fwge/core";
import { Entity } from "@fwge/ecs";
export class Camera extends Entity {
    Init() {
        this.AddComponents(new Transform({ position: [0, 0, 10] }), new PerspectiveCamera());
    }
}
