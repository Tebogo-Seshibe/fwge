export interface EntityModel
{
    id: number
    name: string
    args?: any[]
    asset?: string
    children?: EntityModel[]
}
