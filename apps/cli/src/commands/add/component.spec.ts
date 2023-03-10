import { InvalidArgumentsException } from "../../utils/InvalidArgumentsException";
import { addComponent } from "./component";
import { AddSuccess } from "./utils";

describe('Adding a new component', () => {
    const logSpy = jest.spyOn(console, 'log');

    it('Should throw if a name is not provided', async () => {
        expect(addComponent).rejects.toThrowError(InvalidArgumentsException.ERROR_MESSAGE);
    });

    it('Should log if a name is provided', async () => {
        const componentName = 'ComponentName';
        
        await addComponent(componentName);
        expect(logSpy).toHaveBeenCalledWith(AddSuccess('Component', componentName));
    });
});
