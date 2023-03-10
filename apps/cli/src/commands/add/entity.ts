import { AddSuccess, InvalidArgumentsException } from "../../utils";

export async function addEntity(name: string): Promise<void>
{
    if (!name)
    {
        throw new InvalidArgumentsException();
    }

    console.log(AddSuccess('Entity', name));
}
