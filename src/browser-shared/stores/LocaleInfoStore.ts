import { LocaleInfo, RuntimeConfig } from 'schemas';
import { defineStore } from 'pinia';
import { DASHBOARD_BUNDLE_NAME } from 'browser-shared/constants';
import { createReplicantStoreInitializer } from 'browser-shared/helpers/StoreHelper';
import { posessive } from 'browser-shared/helpers/StringHelper';

const localeInfo = nodecg.Replicant<LocaleInfo>('localeInfo', DASHBOARD_BUNDLE_NAME);
const runtimeConfig = nodecg.Replicant<RuntimeConfig>('runtimeConfig', DASHBOARD_BUNDLE_NAME);

export const localeInfoReps = [localeInfo, runtimeConfig];

interface LocaleInfoStore {
    localeInfo: LocaleInfo
    runtimeConfig: RuntimeConfig
}

interface TranslatableText {
    gameplay: {
        castersTitle: string
    }
    common: {
        matchType: {
            BEST_OF: (numberOfGames: number) => string
            PLAY_ALL: (numberOfGames: number) => string
        }
        longTournamentName: (tournamentSeriesName: string) => string
    }
    match: {
        stages: {
            gameTitle: (index: number) => string
            pickingTeamName: (teamName: string) => string
            awaitingCounterpickLabel: string
            firstStageTitle: string
        }
    }
}

export const useLocaleInfoStore = defineStore('localeInfo', {
    state: () => ({
        localeInfo: null,
        runtimeConfig: null
    } as unknown as LocaleInfoStore),
    getters: {
        strings: (state): TranslatableText => {
            switch (state.runtimeConfig.locale) {
                case 'JA':
                    return {
                        gameplay: {
                            castersTitle: 'キャスト'
                        },
                        common: {
                            matchType: {
                                BEST_OF: (numberOfGames: number) => `Best of ${numberOfGames}`,
                                PLAY_ALL: (numberOfGames: number) => `Play all ${numberOfGames}`
                            },
                            longTournamentName: (tournamentSeriesName) => `Splat World Series - ${tournamentSeriesName}`
                        },
                        match: {
                            stages: {
                                gameTitle: (index) => `ゲーム ${index + 1}`,
                                pickingTeamName: (teamName) => `${teamName}のピック`,
                                awaitingCounterpickLabel: 'Waiting...',
                                firstStageTitle: 'はじめにステージ'
                            }
                        }
                    };
                default:
                    return {
                        gameplay: {
                            castersTitle: 'Commentators'
                        },
                        common: {
                            matchType: {
                                BEST_OF: (numberOfGames: number) => `Best of ${numberOfGames}`,
                                PLAY_ALL: (numberOfGames: number) => `Play all ${numberOfGames}`
                            },
                            longTournamentName: (tournamentSeriesName) => `Splat World Series - ${tournamentSeriesName}`
                        },
                        match: {
                            stages: {
                                gameTitle: (index) => `Game ${index + 1}`,
                                pickingTeamName: (teamName) => `${posessive(teamName)} Pick`,
                                awaitingCounterpickLabel: 'Waiting...',
                                firstStageTitle: 'First Stage'
                            }
                        }
                    };
            }
        }
    }
});

export const initLocaleInfoStore = createReplicantStoreInitializer([localeInfo, runtimeConfig], useLocaleInfoStore);
