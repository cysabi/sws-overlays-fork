<template>
    <div class="stage-display">
        <transition
            mode="out-in"
            :css="false"
            appear
            @before-enter="transitions.beforeEnter"
            @enter="transitions.enter"
            @leave="transitions.leave"
        >
            <large-stage-detail-display
                v-if="props.games.length === 1"
                :title="localeInfoStore.strings.match.stages.firstStageTitle"
                :game="props.games[0]"
                color="neutral"
                class="first-stage-highlight"
            />
            <div
                v-else
                class="small-stages-wrapper"
            >
                <div
                    v-for="(game, i) in props.games"
                    class="small-stage-display"
                    :class="`winner-${game.winner}`"
                    :key="`game-${i}-${game.winner}-${game.stage}-${game.mode}`"
                    :style="{
                        '--accent-color': activeRoundStore.getTeamColor(game.winner),
                        '--text-color': getContrastingTextColor(activeRoundStore.getTeamColor(game.winner), '#ffffff', '#111111')
                    }"
                >
                    <div class="game-index">{{ localeInfoStore.strings.match.stages.gameTitle(i) }}</div>
                    <fitted-content
                        class="subtitle"
                        align="center"
                    >
                        <template v-if="i === 0 || (game.stage !== 'Counterpick' && game.stage !== 'Unknown Stage')">
                            {{ localeInfoStore.localeInfo.stages[game.stage] }}
                        </template>
                        <template v-else-if="game.stage === 'Counterpick' || game.stage === 'Unknown Stage'">
                            {{ props.games[i - 1].winner === 'none' ? localeInfoStore.localeInfo.stages['Counterpick'] : localeInfoStore.strings.match.stages.pickingTeamName(activeRoundStore.getOpposingTeamName(props.games[i - 1].winner, '???')) }}
                        </template>
                    </fitted-content>
                    <fitted-content
                        class="title"
                        align="center"
                    >
                        {{ activeRoundStore.getTeamName(game.winner, localeInfoStore.strings.match.stages.awaitingCounterpickLabel) }}
                    </fitted-content>
                    <div
                        v-if="game.stage !== 'Counterpick' && game.stage !== 'Unknown Stage'"
                        class="stage-image"
                        :style="{ backgroundImage: `url('${assetPathStore.getStageImagePath(game.stage)}')` }"
                    />
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ActiveRound } from 'schemas';
import { useActiveRoundStore } from 'browser-shared/stores/ActiveRoundStore';
import LargeStageDetailDisplay from './LargeStageDetailDisplay.vue';
import { useAssetPathStore } from 'browser-shared/stores/AssetPathStore';
import FittedContent from 'components/FittedContent.vue';
import gsap from 'gsap';
import { provideTransitionMapMember, RawTransitions } from '../../helpers/TransitionHelper';
import { useLocaleInfoStore } from 'browser-shared/stores/LocaleInfoStore';
import { getContrastingTextColor } from '../../helpers/ColorHelper';

const activeRoundStore = useActiveRoundStore();
const assetPathStore = useAssetPathStore();
const localeInfoStore = useLocaleInfoStore();

const props = defineProps<{
    games: ActiveRound['games']
}>();

const getStageElems = (elem: HTMLElement) => {
    return elem.classList.contains('first-stage-highlight') ? elem : elem.querySelectorAll('.first-stage-highlight, .small-stage-display');
};

const transitions: RawTransitions = {
    leave: (elem, done) => {
        const tl = gsap.timeline({
            onComplete: done
        });

        tl.to(getStageElems(elem), {
            duration: 0.75,
            y: 250,
            ease: 'power4.in',
            stagger: {
                each: 0.1,
                from: 'random'
            }
        });

        return tl;
    },
    beforeEnter: (elem) => {
        gsap.set(getStageElems(elem), { y: 250 });
    },
    enter: (elem, done) => {
        const tl = gsap.timeline({
            onComplete: done
        });

        tl.to(getStageElems(elem), {
            duration: 0.75,
            y: 0,
            ease: 'power4.out',
            stagger: {
                each: 0.1,
                from: 'random'
            }
        });

        return tl;
    }
};
provideTransitionMapMember(transitions, 'UnderCameraGraphic');
</script>

<style scoped lang="scss">
@use '../../styles/font-mixins';

@property --accent-color {
    syntax: '<color>';
    initial-value: #FFFFFF;
    inherits: true;
}

@property --text-color {
    syntax: '<color>';
    initial-value: #222222;
    inherits: true;
}

.stage-display {
    filter: drop-shadow(0 0 3px rgba(34, 34, 34, 0.25));
    display: grid;
    grid-auto-flow: column;
    gap: 45px;
}

.first-stage-highlight {
    height: 100%;
    width: 800px;
}

.small-stage-display {
    height: 100%;
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    background: var(--accent-color);
    color: var(--text-color);
    transition-property: --text-color, --accent-color;
    transition-duration: 500ms;

    .stage-image {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        mix-blend-mode: overlay;
        opacity: 0.25;
    }

    .game-index {
        @include font-mixins.font-barlow-condensed;
        font-weight: 700;
        font-size: 30px;
        margin-top: -4px;
        text-rendering: geometricPrecision;
    }

    .subtitle {
        @include font-mixins.font-barlow-condensed;
        font-weight: 500;
        font-size: 35px;
        line-height: 38px;
        margin-top: -2px;
        width: 95%;
    }

    .title {
        font-size: 45px;
        font-weight: 700;
        width: 95%;
    }

    &.winner-none {
        background: linear-gradient(to bottom, #353535 0%, #282828 100%);
        color: #fff;
    }
}

.small-stages-wrapper {
    display: contents;
}
</style>
