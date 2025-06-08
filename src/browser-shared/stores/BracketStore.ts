import { Bracket } from '@tourneyview/common';
import { defineStore } from 'pinia';
import { createReplicantStoreInitializer } from '../helpers/StoreHelper';
import { DASHBOARD_BUNDLE_NAME } from '../constants';

const bracketData = nodecg.Replicant('bracketData', DASHBOARD_BUNDLE_NAME);

interface BracketStore {
    bracketData: Bracket | undefined
}

export const useBracketStore = defineStore('brackets', {
    state: (): BracketStore => ({
        bracketData: undefined
    })
});

export const initBracketStore = createReplicantStoreInitializer([bracketData], useBracketStore);
