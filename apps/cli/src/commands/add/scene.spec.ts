import { InvalidArgumentsException } from "../../utils/InvalidArgumentsException";
import { addScene } from "./scene";
import { AddSuccess } from "./utils";

describe('Adding a new scene', () => {
    const logSpy = jest.spyOn(console, 'log');

    it('Should throw if a name is not provided', async () => {
        expect(addScene).rejects.toThrowError(InvalidArgumentsException.ERROR_MESSAGE);
    });

    it('Should log if a name is provided', async () => {
        const sceneName = 'SceneName';
        
        await addScene(sceneName);
        expect(logSpy).toHaveBeenCalledWith(AddSuccess('Scene', sceneName));
    });
});
