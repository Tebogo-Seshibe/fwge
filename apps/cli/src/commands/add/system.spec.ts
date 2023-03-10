import { InvalidArgumentsException } from "../../utils/InvalidArgumentsException";
import { addSystem } from "./system";
import { AddSuccess } from "./utils";

describe('Adding a new system', () => {
    const logSpy = jest.spyOn(console, 'log');

    it('Should throw if a name is not provided', async () => {
        expect(addSystem).rejects.toThrowError(InvalidArgumentsException.ERROR_MESSAGE);
    });

    it('Should log if a name is provided', async () => {
        const systemName = 'SystemName';
        
        await addSystem(systemName);
        expect(logSpy).toHaveBeenCalledWith(AddSuccess('System', systemName));
    });
});
