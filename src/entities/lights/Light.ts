import { Class, Component, Entity, Registry, Scene } from "../../ecs"
import { Colour4 } from "../../atoms/colour"
import { Transform } from "../../components/Transform"

export class Light extends Entity
{
    public get Transform(): Transform
    {
        return this.GetComponent(Transform)!
    }

    constructor(scene: Scene, public readonly Colour: Colour4)
    {
        super(scene)

        this.AddComponent(new Transform())
    }

    public override RemoveComponent<T extends Component>(type: Class<T>): Entity
    {
        if (Registry.getComponentTypeId(type) !== Registry.getComponentTypeId(Transform))
        {
            return super.RemoveComponent(type)
        }

        return this
    }
}
