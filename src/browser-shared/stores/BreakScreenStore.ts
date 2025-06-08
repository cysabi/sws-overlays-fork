import { ActiveBreakScene, MainFlavorText, NextRoundStartTime, ObsState } from 'schemas';
import { defineStore } from 'pinia';
import { DASHBOARD_BUNDLE_NAME } from '../constants';
import { createReplicantStoreInitializer } from '../helpers/StoreHelper';

const mainFlavorText = nodecg.Replicant<MainFlavorText>('mainFlavorText', DASHBOARD_BUNDLE_NAME);
const nextRoundStartTime = nodecg.Replicant<NextRoundStartTime>('nextRoundStartTime', DASHBOARD_BUNDLE_NAME);
const activeBreakScene = nodecg.Replicant<ActiveBreakScene>('activeBreakScene', DASHBOARD_BUNDLE_NAME);
const obsState = nodecg.Replicant<ObsState>('obsState', DASHBOARD_BUNDLE_NAME);

interface BreakScreenStore {
    mainFlavorText: MainFlavorText
    nextRoundStartTime: NextRoundStartTime
    activeBreakScene: ActiveBreakScene
    obsState: ObsState
}

export const useBreakScreenStore = defineStore('breakScreen', {
    state: () => ({
        mainFlavorText: null,
        nextRoundStartTime: { startTime: null, isVisible: null },
        activeBreakScene: null,
        obsState: null
    } as unknown as BreakScreenStore)
});

export const initBreakScreenStore = createReplicantStoreInitializer([
    mainFlavorText,
    nextRoundStartTime,
    activeBreakScene,
    obsState
], useBreakScreenStore);
