<template>
    <div class="stage-display">
        <large-stage-detail-display
            v-if="props.games.length === 1"
            title="First Stage"
            :game="props.games[0]"
            color="neutral"
            class="first-stage-highlight"
        />
        <template v-else>
            <div
                v-for="(game, i) in props.games"
                class="small-stage-display"
                :class="`winner-${game.winner}`"
                :key="`game-${i}-${game.winner}-${game.stage}-${game.mode}`"
            >
                <div class="game-index">Game {{ i + 1 }}</div>
                <fitted-content
                    class="subtitle"
                    align="center"
                >
                    <template v-if="i === 0 || (game.stage !== 'Counterpick' && game.stage !== 'Unknown Stage')">
                        {{ game.stage }}
                    </template>
                    <template v-else-if="game.stage === 'Counterpick' || game.stage === 'Unknown Stage'">
                        {{ props.games[i - 1].winner === 'none' ? 'Counterpick' : `${posessive(activeRoundStore.getOpposingTeamName(props.games[i - 1].winner, '???'))} Pick` }}
                    </template>
                </fitted-content>
                <fitted-content
                    class="title"
                    align="center"
                >
                    {{ activeRoundStore.getTeamName(game.winner, 'Waiting...') }}
                </fitted-content>
                <div
                    v-if="game.stage !== 'Counterpick' && game.stage !== 'Unknown Stage'"
                    class="stage-image"
                    :style="{ backgroundImage: `url('${assetPathStore.getStageImagePath(game.stage)}')` }"
                />
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { ActiveRound } from 'schemas';
import { useActiveRoundStore } from 'browser-shared/stores/ActiveRoundStore';
import LargeStageDetailDisplay from './LargeStageDetailDisplay.vue';
import { useAssetPathStore } from 'browser-shared/stores/AssetPathStore';
import FittedContent from 'components/FittedContent.vue';
import gsap from 'gsap';
import { provideTransitionMapMember } from '../../helpers/TransitionHelper';
import { posessive } from 'browser-shared/helpers/StringHelper';
import { watch } from 'vue';

const activeRoundStore = useActiveRoundStore();
const assetPathStore = useAssetPathStore();

const props = defineProps<{
    games: ActiveRound['games']
}>();

watch(() => props.games, newValue => {
    console.log('?', newValue.map(el => ({ ...el })));
}, { immediate: true });

const getStageElems = (elem: HTMLElement) => elem.querySelectorAll('.first-stage-highlight, .small-stage-display');

provideTransitionMapMember({
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
    }
});
</script>

<style scoped lang="scss">
@use '../../styles/font-mixins';

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
    color: #fff;
    overflow: hidden;

    .stage-image {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        mix-blend-mode: overlay;
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
        font-size: 30px;
        line-height: 35px;
        margin-top: -2px;
        width: 95%;
    }

    .title {
        font-size: 45px;
        font-weight: 700;
        width: 95%;
    }

    &.winner-alpha {
        background: linear-gradient(to bottom, #fff300 0%, #E8D912 100%);
        color: #222;

        .stage-image {
            opacity: 0.75;
        }
    }

    &.winner-bravo {
        background: linear-gradient(to bottom, #A032DB 0%, #BA69E5 100%);

        .stage-image {
            opacity: 0.5;
        }
    }

    &.winner-none {
        background: linear-gradient(to bottom, #353535 0%, #282828 100%);
    }
}
</style>
