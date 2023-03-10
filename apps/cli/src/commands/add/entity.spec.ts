import { InvalidArgumentsException } from "../../utils/InvalidArgumentsException";
import { addEntity } from "./entity";
import { AddSuccess } from "./utils";

describe('Adding a new entity', () => {
    const logSpy = jest.spyOn(console, 'log');

    it('Should throw if a name is not provided', async () => {
        expect(addEntity).rejects.toThrowError(InvalidArgumentsException.ERROR_MESSAGE);
    });

    it('Should log if a name is provided', async () => {
        const entityName = 'EntityName';
        
        await addEntity(entityName);
        expect(logSpy).toHaveBeenCalledWith(AddSuccess('Entity', entityName));
    });
});
