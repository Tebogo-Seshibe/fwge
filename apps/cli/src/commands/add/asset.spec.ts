import { AddSuccess, InvalidArgumentsException } from "../../utils";
import { addAsset } from "./asset";

describe('Adding a new asset', () => {
    const logSpy = jest.spyOn(console, 'log');

    it('Should throw if a name is not provided', async () => {
        expect(addAsset).rejects.toThrowError(InvalidArgumentsException.ERROR_MESSAGE);
    });

    it('Should log if a name is provided', async () => {
        const assetName = 'AssetName';
        
        await addAsset(assetName);
        expect(logSpy).toHaveBeenCalledWith(AddSuccess('Asset', assetName));
    });
});
