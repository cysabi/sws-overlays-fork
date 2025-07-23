<template>
    <div
        class="ticker-scoreboard"
        :class="{ 'focus-teams': focusTeams }"
    >
        <div class="space-filler" />
        <div class="team team-alpha">
            <fitted-content class="team-name" align="right">
                <opacity-swap-transition>
                    <div :key="activeRoundStore.activeRound.teamA.name">{{ addDots(activeRoundStore.activeRound.teamA.name) }}</div>
                </opacity-swap-transition>
            </fitted-content>
            <div class="team-score">
                <score-counter :value="activeRoundStore.activeRound.teamA.score" />
            </div>
            <image-loader
                v-if="activeRoundStore.activeRound.teamA.showLogo"
                class="team-image team-image-blend"
                :src="activeRoundStore.activeRound.teamA.logoUrl"
            />
        </div>
        <div class="team team-bravo">
            <fitted-content class="team-name" align="right">
                <opacity-swap-transition>
                    <div :key="activeRoundStore.activeRound.teamB.name">{{ addDots(activeRoundStore.activeRound.teamB.name) }}</div>
                </opacity-swap-transition>
            </fitted-content>
            <div class="team-score">
                <score-counter :value="activeRoundStore.activeRound.teamB.score" />
            </div>
            <image-loader
                v-if="activeRoundStore.activeRound.teamB.showLogo"
                class="team-image team-image-blend"
                :src="activeRoundStore.activeRound.teamB.logoUrl"
            />
        </div>
        <div class="match-info">
            <event-logo class="event-logo" />
            <fitted-content>
                {{ localeInfoStore.strings.common.longTournamentName(tournamentDataStore.unprefixedTournamentName) }}
            </fitted-content>
            <fitted-content>
                <opacity-swap-transition>
                    <div :key="activeRoundStore.activeRound.match.name">
                        {{ activeRoundStore.activeRound.match.name }} - {{ activeRoundStore.formattedMatchType }}
                    </div>
                </opacity-swap-transition>
            </fitted-content>
        </div>
        <div class="organizer-logos">
            <img src="../../assets/ipl-logo-mono-lines-white.png">
            <img src="../../assets/ac_logo_white.svg">
        </div>
    </div>
</template>

<script setup lang="ts">
import EventLogo from 'components/EventLogo.vue';
import FittedContent from 'components/FittedContent.vue';
import { useActiveRoundStore } from 'browser-shared/stores/ActiveRoundStore';
import { addDots } from 'browser-shared/helpers/StringHelper';
import { useTournamentDataStore } from 'browser-shared/stores/TournamentDataStore';
import ImageLoader from 'components/ImageLoader.vue';
import OpacitySwapTransition from 'components/OpacitySwapTransition.vue';
import ScoreCounter from 'components/ScoreCounter.vue';
import { computed } from 'vue';
import { useBreakScreenStore } from 'browser-shared/stores/BreakScreenStore';
import { useLocaleInfoStore } from 'browser-shared/stores/LocaleInfoStore';

const activeRoundStore = useActiveRoundStore();
const tournamentDataStore = useTournamentDataStore();
const breakScreenStore = useBreakScreenStore();
const localeInfoStore = useLocaleInfoStore();

// todo: allow disabling this behavior
const focusTeams = computed(() => breakScreenStore.activeBreakScene === 'teams');
</script>

<style scoped lang="scss">
@use '../../styles/font-mixins';

$width-change-transition-duration: 1000ms;
$width-change-transition-delay-enlarge: 250ms;
$width-change-transition-delay-ensmallen: 1750ms;
$width-change-transition-ease: cubic-bezier(0.76, 0, 0.24, 1);

.ticker-scoreboard {
    margin: 0 96px;
    background-color: #222;
    display: flex;
    overflow: hidden;

    &.focus-teams {
        .match-info {
            width: 0;
            opacity: 0;
            transition-delay: $width-change-transition-delay-enlarge, $width-change-transition-delay-enlarge + 150ms;
        }

        .space-filler {
            min-width: 182px;
            transition-delay: $width-change-transition-delay-enlarge;
        }

        .team-image {
            transform: translateY(-150%) rotate(-5deg);
        }
    }
}

.space-filler {
    min-width: 0;
    transition-property: min-width;
    transition-duration: 800ms;
    transition-delay: 1750ms;
    transition-timing-function: $width-change-transition-ease;
}

.event-logo {
    height: 100%;
    min-width: 100px;
    padding: 10px 0;
    background-color: #FFF;
    color: #000;
    grid-row: span 2;
}

.team {
    display: flex;
    align-items: center;
    background-color: #F2F2F2;
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;

    &.team-alpha {
        background: linear-gradient(to bottom, #fff300 0%, #E8D912 100%);
        color: #222;
        margin-right: 16px;
    }

    &.team-bravo {
        background: linear-gradient(to bottom, #A032DB 0%, #BA69E5 100%);
        color: white;
    }
}

.team-image {
    position: absolute;
    left: -5px;
    top: 50%;
    transform: translateY(-50%) rotate(-5deg);
    mask-image: linear-gradient(to right, rgba(255, 255, 255, 1.0) 75%, transparent 100%);
    width: 150px;
    height: 150px;
    transition: transform 500ms ease-in-out 750ms;

    &.team-image-blend {
        mix-blend-mode: luminosity;
        opacity: 0.25;
        z-index: 99;
    }

    &.team-image-color {
        opacity: 0.1;
        z-index: 100;
    }
}

.team-score {
    color: #FFF;
    margin: 3px;
    background-color: rgba(34, 34, 34, 0.9);
    font-size: 60px;
    font-weight: 700;
    line-height: 57px;
    min-width: 74px;
    height: calc(100% - 6px);
    width: 55px;
    text-align: center;
    overflow: hidden;
}

.team-name {
    @include font-mixins.font-barlow-condensed;
    font-weight: 600;
    font-size: 54px;
    flex-grow: 1;
    max-width: 100%;
    margin: 0 16px;
    z-index: 999;
    transform: translateY(-2px);

    &.team-alpha {
        justify-self: end;
    }

    &.team-bravo {
        color: #fff;
    }
}

.match-info {
    @include font-mixins.font-barlow-condensed;
    width: 80%;
    overflow: hidden;
    color: white;
    display: grid;
    grid-template-columns: 120px 1fr;
    grid-template-rows: repeat(2, 1fr);
    justify-content: center;
    margin: 0 16px;
    font-size: 24px;
    transition-property: width, opacity;
    transition-duration: $width-change-transition-duration, 250ms;
    transition-delay: $width-change-transition-delay-ensmallen, $width-change-transition-delay-ensmallen + 500ms;
    transition-timing-function: $width-change-transition-ease, linear;
}

.organizer-logos {
    min-width: 150px;
    height: 100%;
    display: flex;
    justify-content: center;
    background-color: #111;
    padding: 0 8px;

    > * {
        margin: 8px;
    }
}
</style>
