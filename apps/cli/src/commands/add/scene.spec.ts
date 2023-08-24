import { AddSuccess, InvalidArgumentsException } from "../../utils";
import { addScene } from "./scene";
import { describe, it, expect, vi } from 'vitest';

describe('Adding a new scene', () => {
    const logSpy = vi.spyOn(console, 'log');

    it('Should throw if a name is not provided', async () => {
        expect(addScene).rejects.toThrowError(InvalidArgumentsException.ERROR_MESSAGE);
    });

    it('Should log if a name is provided', async () => {
        const sceneName = 'SceneName';
        
        await addScene(sceneName);
        expect(logSpy).toHaveBeenCalledWith(AddSuccess('Scene', sceneName));
    });
});
