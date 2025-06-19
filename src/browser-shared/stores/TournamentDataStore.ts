import { TournamentData } from 'schemas';
import { defineStore } from 'pinia';
import { DASHBOARD_BUNDLE_NAME } from '../constants';
import { createReplicantStoreInitializer } from '../helpers/StoreHelper';

const tournamentData = nodecg.Replicant<TournamentData>('tournamentData', DASHBOARD_BUNDLE_NAME);

interface TournamentDataStore {
    tournamentData: TournamentData
}

export const useTournamentDataStore = defineStore('tournamentData', {
    state: () => ({
        tournamentData: null
    } as unknown as TournamentDataStore)
});

export const initTournamentDataStore = createReplicantStoreInitializer([tournamentData], useTournamentDataStore);
