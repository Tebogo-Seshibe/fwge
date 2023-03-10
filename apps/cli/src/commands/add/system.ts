import { InvalidArgumentsException } from "../../utils/InvalidArgumentsException";
import { AddSuccess } from "./utils";

export async function addSystem(name: string): Promise<void>
{
    if (!name)
    {
        throw new InvalidArgumentsException();
    }

    console.log(AddSuccess('System', name));
}
