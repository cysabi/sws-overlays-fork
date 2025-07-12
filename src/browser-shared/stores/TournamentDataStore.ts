import { TournamentData } from 'schemas';
import { defineStore } from 'pinia';
import { DASHBOARD_BUNDLE_NAME } from '../constants';
import { createReplicantStoreInitializer } from '../helpers/StoreHelper';
import { isBlank } from 'browser-shared/helpers/StringHelper';

const tournamentData = nodecg.Replicant<TournamentData>('tournamentData', DASHBOARD_BUNDLE_NAME);

interface TournamentDataStore {
    tournamentData: TournamentData
}

export const useTournamentDataStore = defineStore('tournamentData', {
    state: () => ({
        tournamentData: null
    } as unknown as TournamentDataStore),
    getters: {
        edition: state => {
            const splitTournamentName = state.tournamentData.meta.name?.split('-');
            if (splitTournamentName == null || splitTournamentName.length <= 1) {
                return splitTournamentName?.[0] ?? 'FIX ME: UNKNOWN TOURNAMENT NAME!';
            }
            splitTournamentName.shift();
            return splitTournamentName.join('-').trim();
        }
    }
});

export const initTournamentDataStore = createReplicantStoreInitializer([tournamentData], useTournamentDataStore);
