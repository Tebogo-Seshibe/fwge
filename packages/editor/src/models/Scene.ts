import { EntityModel } from "./Entity"
import { SystemModel } from "./System"

export interface SceneModel
{
    id: number
    name: string
    systems: SystemModel[]
    entityList: EntityModel[]
}
