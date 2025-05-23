import { AddSuccess, InvalidArgumentsException } from "../../utils";

export async function addScene(name: string): Promise<void>
{
    if (!name)
    {
        throw new InvalidArgumentsException();
    }

    console.log(AddSuccess('Scene', name));
}
