import { AddSuccess, InvalidArgumentsException } from "../../utils";
import { addAsset } from "./asset";
import { describe, it, expect, vi } from 'vitest';

describe('Adding a new asset', () => {
    const logSpy = vi.spyOn(console, 'log');

    it('Should throw if a name is not provided', async () => {
        expect(addAsset).rejects.toThrowError(InvalidArgumentsException.ERROR_MESSAGE);
    });

    it('Should log if a name is provided', async () => {
        const assetName = 'AssetName';
        
        await addAsset(assetName);
        expect(logSpy).toHaveBeenCalledWith(AddSuccess('Asset', assetName));
    });
});
