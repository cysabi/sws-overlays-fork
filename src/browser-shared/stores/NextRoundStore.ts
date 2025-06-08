import { NextRound } from 'schemas';
import { defineStore } from 'pinia';
import { DASHBOARD_BUNDLE_NAME } from '../constants';
import { createReplicantStoreInitializer } from '../helpers/StoreHelper';

const nextRound = nodecg.Replicant<NextRound>('nextRound', DASHBOARD_BUNDLE_NAME);

interface NextRoundStore {
    nextRound: NextRound
}

export const useNextRoundStore = defineStore('nextRound', {
    state: () => ({
        nextRound: null
    } as unknown as NextRoundStore)
});

export const initNextRoundStore = createReplicantStoreInitializer([nextRound], useNextRoundStore);
