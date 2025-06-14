<template>
    <div class="content-wrapper counterpick-alert-wrapper layout vertical center-horizontal center-vertical">
        <transition
            mode="out-in"
            :css="false"
            @before-enter="beforeStagesEnter"
            @enter="stagesEnter"
            @leave="stagesLeave"
        >
            <suspense>
                <counterpick-alert
                    v-if="showCounterpickAlert"
                    style="width: 800px; height: 150px"
                    :game="nextGame"
                    :next-picking-team="nextPickingTeam"
                />
                <stage-display
                    v-else
                    style="height: 150px"
                    :games="visibleGames.games"
                />
            </suspense>
        </transition>
    </div>

    <maze-background>
        <transition
            mode="out-in"
            :css="false"
            @enter="counterpickAlertBackgroundEnter"
            @leave="counterpickAlertBackgroundLeave"
        >
            <suspense>
                <counterpick-alert-background
                    v-if="showCounterpickAlert"
                    :team-color="nextPickingTeam"
                />
            </suspense>
        </transition>
    </maze-background>
</template>

<script setup lang="ts">
import MazeBackground from 'components/MazeBackground.vue';
import CounterpickAlert from './CounterpickAlert.vue';
import CounterpickAlertBackground from './CounterpickAlertBackground.vue';
import { computed } from 'vue';
import StageDisplay from './StageDisplay.vue';
import { createTransitionMap } from '../../helpers/TransitionHelper';
import { useActiveRoundStore } from 'browser-shared/stores/ActiveRoundStore';

const activeRoundStore = useActiveRoundStore();

const transitions = createTransitionMap();

const nextGame = computed(() => activeRoundStore.activeRound.games[activeRoundStore.scoreSum]);
const showCounterpickAlert = computed(() => activeRoundStore.scoreSum !== 0 && nextGame.value != null && nextGame.value.stage !== 'Counterpick' && nextGame.value.stage !== 'Unknown Stage');
const nextPickingTeam = computed<'alpha' | 'bravo'>(() => {
    if (activeRoundStore.scoreSum === 0) return 'alpha';
    const lastWinner = activeRoundStore.activeRound.games[activeRoundStore.scoreSum - 1].winner;
    if (lastWinner === 'none') return 'alpha';
    return lastWinner === 'bravo' ? 'alpha' : 'bravo';
});

const visibleGames = computed(() => {
    const firstUnfinishedGameIndex = activeRoundStore.activeRound.games.findIndex(game => game.winner === 'none');

    return {
        games: firstUnfinishedGameIndex === -1
            ? activeRoundStore.activeRound.games
            : activeRoundStore.activeRound.games.slice(0, firstUnfinishedGameIndex + 1)
    };
});

function beforeStagesEnter(elem: HTMLElement) {
    if (showCounterpickAlert.value) {
        transitions.CounterpickAlert.beforeEnter(elem);
    } else {
        transitions.StageDisplay.beforeEnter(elem);
    }

}

function stagesEnter(elem: HTMLElement, done: gsap.Callback) {
    if (showCounterpickAlert.value) {
        transitions.CounterpickAlert.enter(elem, done);
    } else {
        transitions.StageDisplay.enter(elem, done);
    }
}

function stagesLeave(elem: HTMLElement, done: gsap.Callback) {
    if (showCounterpickAlert.value) {
        transitions.StageDisplay.leave(elem, done);
    } else {
        transitions.CounterpickAlert.leave(elem, done);
    }
}

function counterpickAlertBackgroundEnter(elem: HTMLElement, done: gsap.Callback) {
    transitions.CounterpickAlertBackground.enter(elem, done, 0.75 + (visibleGames.value.games.length - 1) * 0.1);
}

function counterpickAlertBackgroundLeave(elem: HTMLElement, done: gsap.Callback) {
    transitions.CounterpickAlertBackground.leave(elem, done);
}
</script>

<style lang="scss" scoped>
.counterpick-alert-wrapper {
    height: 25%;
    bottom: 0;
    top: unset;

    > * {
        position: absolute;
    }
}
</style>
