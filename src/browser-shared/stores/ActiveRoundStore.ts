import { ActiveRound, SwapColorsInternally, ScoreboardData } from 'schemas';
import { defineStore } from 'pinia';
import { DASHBOARD_BUNDLE_NAME } from '../constants';
import { createReplicantStoreInitializer } from '../helpers/StoreHelper';
import { addDots } from 'browser-shared/helpers/StringHelper';

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
        formattedMatchType: state => `${state.activeRound.match.type === 'BEST_OF' ? 'Best of' : 'Play all'} ${state.activeRound.games.length}`,
        scoreSum: state => state.activeRound.teamA.score + state.activeRound.teamB.score,
        getTeamName: state => (team: ActiveRound['games'][number]['winner'] | null | undefined, defaultValue: string) => {
            if (team == null || team === 'none') return defaultValue;

            return team === 'alpha'
                ? addDots(state.activeRound.teamA.name)
                : addDots(state.activeRound.teamB.name);
        },
        getOpposingTeamName: state => (team: ActiveRound['games'][number]['winner'] | null | undefined, defaultValue: string) => {
            if (team == null || team === 'none') return defaultValue;

            return team === 'alpha'
                ? addDots(state.activeRound.teamB.name)
                : addDots(state.activeRound.teamA.name);
        },
        nextPickingTeam: function(state) {
            if (this.scoreSum === 0 || this.scoreSum === state.activeRound.games.length) return null;
            const lastWinner = state.activeRound.games[this.scoreSum - 1].winner;
            switch (lastWinner) {
                case 'none':
                    return null;
                case 'alpha':
                    return 'bravo';
                case 'bravo':
                    return 'alpha';
            }
        }
    }
});

export const initActiveRoundStore = createReplicantStoreInitializer([
    activeRound,
    swapColorsInternally,
    scoreboardData
], useActiveRoundStore);
