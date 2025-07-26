<template>
    <div class="content-wrapper counterpick-alert-wrapper layout vertical center-horizontal center-vertical">
        <transition
            mode="out-in"
            :css="false"
            appear
            @before-enter="beforeStagesEnter"
            @enter="stagesEnter"
            @leave="stagesLeave"
        >
            <suspense>
                <team-rosters
                    v-if="breakScreenStore.activeBreakScene === 'teams'"
                />
                <counterpick-alert
                    v-else-if="showCounterpickAlert"
                    style="width: 800px; height: 150px"
                    :game="nextGame"
                    :next-picking-team="nextPickingTeam"
                />
                <stage-display
                    v-else
                    :key="visibleGames.matchId"
                    style="height: 150px"
                    :games="visibleGames.games"
                />
            </suspense>
        </transition>
    </div>

    <div class="content-wrapper layout vertical center-horizontal">
        <caster-grid :casters="casterStore.casters" />
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
import { computed, watch } from 'vue';
import StageDisplay from './StageDisplay.vue';
import { createTransitionMap } from '../../helpers/TransitionHelper';
import { useActiveRoundStore } from 'browser-shared/stores/ActiveRoundStore';
import { useDecorationStore } from 'browser-shared/stores/DecorationStore';
import { useBreakScreenStore } from 'browser-shared/stores/BreakScreenStore';
import TeamRosters from './TeamRosters.vue';
import { useCasterStore } from 'browser-shared/stores/CasterStore';
import CasterGrid from 'components/CasterGrid.vue';

const activeRoundStore = useActiveRoundStore();
const decorationStore = useDecorationStore();
const breakScreenStore = useBreakScreenStore();
const casterStore = useCasterStore();

const transitions = createTransitionMap();

const nextGame = computed(() => activeRoundStore.activeRound.games[activeRoundStore.scoreSum]);
const showCounterpickAlert = computed(() => activeRoundStore.scoreSum !== 0 && nextGame.value != null && nextGame.value.stage !== 'Counterpick' && nextGame.value.stage !== 'Unknown Stage' && breakScreenStore.activeBreakScene !== 'teams');
const nextPickingTeam = computed<'alpha' | 'bravo'>(() => {
    if (activeRoundStore.scoreSum === 0) return 'alpha';
    const lastWinner = activeRoundStore.activeRound.games[activeRoundStore.scoreSum - 1].winner;
    if (lastWinner === 'none') return 'alpha';
    return lastWinner === 'bravo' ? 'alpha' : 'bravo';
});

function setBackgroundAlertColor() {
    decorationStore.mazeBackgroundAlertColor = activeRoundStore.getTeamColor(nextPickingTeam.value);
}

watch(() => activeRoundStore.getTeamColor(nextPickingTeam.value), () => {
    if (showCounterpickAlert.value) {
        setBackgroundAlertColor();
    }
}, { immediate: true });

const visibleGames = computed(() => {
    const firstUnfinishedGameIndex = activeRoundStore.activeRound.games.findIndex(game => game.winner === 'none');

    if (activeRoundStore.activeRound.match.isCompleted) {
        return {
            matchId: activeRoundStore.activeRound.match.id,
            games: firstUnfinishedGameIndex === -1
                ? activeRoundStore.activeRound.games
                : activeRoundStore.activeRound.games.slice(0, firstUnfinishedGameIndex)
        };
    }

    return {
        matchId: activeRoundStore.activeRound.match.id,
        games: firstUnfinishedGameIndex === -1
            ? activeRoundStore.activeRound.games
            : activeRoundStore.activeRound.games.slice(0, firstUnfinishedGameIndex + 1)
    };
});

function beforeStagesEnter(elem: HTMLElement) {
    transitions.UnderCameraGraphic?.beforeEnter(elem);
}

function stagesEnter(elem: HTMLElement, done: gsap.Callback) {
    decorationStore.mazeBackgroundAlert = showCounterpickAlert.value;
    if (showCounterpickAlert.value) {
        setBackgroundAlertColor();
    }
    transitions.UnderCameraGraphic?.enter(elem, done);
}

function stagesLeave(elem: HTMLElement, done: gsap.Callback) {
    transitions.UnderCameraGraphic?.leave(elem, done);
}

function counterpickAlertBackgroundEnter(elem: HTMLElement, done: gsap.Callback) {
    transitions.CounterpickAlertBackground.enter(elem, done, 0.75 + (visibleGames.value.games.length - 1) * 0.1);
}

function counterpickAlertBackgroundLeave(elem: HTMLElement, done: gsap.Callback) {
    transitions.CounterpickAlertBackground.leave(elem, done);
}
</script>

<style lang="scss">
.casters-layout {
    height: 590px;
    align-items: end;
}
</style>

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
