import { BundleCasterSets } from 'schemas';
import { defineStore } from 'pinia';
import { DASHBOARD_BUNDLE_NAME } from '../constants';
import { createReplicantStoreInitializer } from '../helpers/StoreHelper';

const bundleCasterSets = nodecg.Replicant<BundleCasterSets>('bundleCasterSets', DASHBOARD_BUNDLE_NAME);
const preshowTopic = nodecg.Replicant<string>('preshowTopic', { defaultValue: 'Welcome to the preshow!' });
const preshowLargeVideoUrl = nodecg.Replicant<string>('preshowLargeVideoUrl', { defaultValue: '' });
const preshowLargeVideoVisible = nodecg.Replicant<boolean>('preshowLargeVideoVisible', { defaultValue: false });

interface PreshowStore {
    bundleCasterSets: BundleCasterSets
    preshowTopic: string
    preshowLargeVideoUrl: string
    preshowLargeVideoVisible: boolean
}

export const usePreshowStore = defineStore('preshow', {
    state: () => ({
        bundleCasterSets: {},
        preshowTopic: '',
        preshowLargeVideoUrl: '',
        preshowLargeVideoVisible: false
    } as PreshowStore),
    actions: {
        setPreshowTopic(newValue: string) {
            preshowTopic.value = newValue;
        },
        setPreshowLargeVideoUrl(newValue: string) {
            preshowLargeVideoUrl.value = newValue;
        },
        setPreshowLargeVideoVisible(newValue: boolean) {
            console.log('!', newValue);
            preshowLargeVideoVisible.value = newValue;
        }
    }
});

export const initPreshowStore = createReplicantStoreInitializer([
    bundleCasterSets,
    preshowTopic,
    preshowLargeVideoUrl,
    preshowLargeVideoVisible
], usePreshowStore);
