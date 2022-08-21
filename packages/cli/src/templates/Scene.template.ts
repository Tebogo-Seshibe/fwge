export default `import { Entity, Scene } from "@fwge/core"

export class {{ EntityName }} extends Entity
{
    
    constructor(scene: Scene)
    {
        super(scene)
    }

    override OnCreate(): void { }

    override OnDestroy(): void { }
}
`