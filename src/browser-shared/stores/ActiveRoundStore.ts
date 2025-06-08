import { ActiveRound, SwapColorsInternally, ScoreboardData } from 'schemas';
import { defineStore } from 'pinia';
import { DASHBOARD_BUNDLE_NAME } from '../constants';
import { createReplicantStoreInitializer } from '../helpers/StoreHelper';

const activeRound = nodecg.Replicant<ActiveRound>('activeRound', DASHBOARD_BUNDLE_NAME);
const swapColorsInternally = nodecg.Replicant<SwapColorsInternally>('swapColorsInternally', DASHBOARD_BUNDLE_NAME);
const scoreboardData = nodecg.Replicant<ScoreboardData>('scoreboardData', DASHBOARD_BUNDLE_NAME);

interface ActiveRoundStore {
    activeRound: ActiveRound
    swapColorsInternally: SwapColorsInternally
    scoreboardData: ScoreboardData
}

export const useActiveRoundStore = defineStore('activeRound', {
    state: () => ({
        activeRound: null,
        swapColorsInternally: null,
        scoreboardData: null
    } as unknown as ActiveRoundStore),
    getters: {
        formattedMatchType: state => `${state.activeRound.match.type === 'BEST_OF' ? 'Best of' : 'Play all'} ${state.activeRound.games.length}`
    }
});

export const initActiveRoundStore = createReplicantStoreInitializer([
    activeRound,
    swapColorsInternally,
    scoreboardData
], useActiveRoundStore);
