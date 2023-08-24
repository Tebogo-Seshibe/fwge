import { AddSuccess, InvalidArgumentsException } from "../../utils";
import { addComponent } from "./component";
import { describe, it, expect, vi } from 'vitest';

describe('Adding a new component', () => {
    const logSpy = vi.spyOn(console, 'log');

    it('Should throw if a name is not provided', async () => {
        expect(addComponent).rejects.toThrowError(InvalidArgumentsException.ERROR_MESSAGE);
    });

    it('Should log if a name is provided', async () => {
        const componentName = 'ComponentName';
        
        await addComponent(componentName);
        expect(logSpy).toHaveBeenCalledWith(AddSuccess('Component', componentName));
    });
});
