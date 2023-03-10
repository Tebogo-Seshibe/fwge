import { AddSuccess, InvalidArgumentsException } from "../../utils";

export async function addComponent(name: string): Promise<void>
{
    if (!name)
    {
        throw new InvalidArgumentsException();
    }

    console.log(AddSuccess('Component', name));  
}
