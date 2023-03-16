import { AddSuccess, InvalidArgumentsException } from "../../utils";

export async function addAsset(name: string): Promise<void>
{
    if (!name)
    {
        throw new InvalidArgumentsException();
    }

    console.log(AddSuccess('Asset', name));
}
