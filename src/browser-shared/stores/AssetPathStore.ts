import { AssetPaths } from 'schemas';
import { defineStore } from 'pinia';
import { DASHBOARD_BUNDLE_NAME } from '../constants';
import { createReplicantStoreInitializer } from '../helpers/StoreHelper';

const assetPaths = nodecg.Replicant<AssetPaths>('assetPaths', DASHBOARD_BUNDLE_NAME);

interface AssetPathStore {
    assetPaths: AssetPaths;
}

export const useAssetPathStore = defineStore('assetPaths', {
    state: () => ({
        assetPaths: null
    } as unknown as AssetPathStore),
    getters: {
        getStageImagePath: state =>
            (stageName: string) => state.assetPaths.stageImages[stageName] ?? `/bundles/${nodecg.bundleName}/static/unknown-stage.png`
    }
});

export const initAssetPathStore = createReplicantStoreInitializer([assetPaths], useAssetPathStore);
