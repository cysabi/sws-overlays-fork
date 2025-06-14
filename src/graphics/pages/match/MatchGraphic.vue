<template>
    <div class="content-wrapper counterpick-alert-wrapper layout vertical center-horizontal center-vertical">
        <counterpick-alert
            style="width: 800px; height: 150px"
            :game="counterpickAlertContent"
            :next-picking-team="nextPickingTeam"
        />
        <stage-display
            style="height: 150px"
            :games="stageDisplayGames"
        />
    </div>

    <maze-background>
        <counterpick-alert-background
            :team-color="nextPickingTeam"
        />
    </maze-background>
</template>

<script setup lang="ts">
import { ActiveRound } from 'schemas';
import MazeBackground from 'components/MazeBackground.vue';
import CounterpickAlert from './CounterpickAlert.vue';
import CounterpickAlertBackground from './CounterpickAlertBackground.vue';
import { onMounted, ref, watch } from 'vue';
import StageDisplay from './StageDisplay.vue';
import gsap from 'gsap';
import { createTransitionMap } from '../../helpers/TransitionHelper';
import { useActiveRoundStore } from 'browser-shared/stores/ActiveRoundStore';

const activeRoundStore = useActiveRoundStore();

const transitions = createTransitionMap();

function isUnfinishedCounterpick(stage: string) {
    return stage === 'Unknown Stage' || stage === 'Counterpick';
}

const tl = gsap.timeline();

const stageDisplayGames = ref<ActiveRound['games']>([]);
const nextPickingTeam = ref<'alpha' | 'bravo'>('alpha');
const counterpickAlertContent = ref<ActiveRound['games'][number] | null>(null);

onMounted(() => {
    watch(() => ({
        scoreSum: activeRoundStore.activeRound.teamA.score + activeRoundStore.activeRound.teamB.score,
        games: activeRoundStore.activeRound.games.map(game => ({ stage: game.stage, winner: game.winner }))
    }), (newValue, oldValue) => {
        const revealCounterpickAlert = oldValue != null &&
            counterpickAlertContent.value == null &&
            oldValue.scoreSum === newValue.scoreSum &&
            isUnfinishedCounterpick(oldValue.games[oldValue.scoreSum].stage) &&
            !isUnfinishedCounterpick(newValue.games[newValue.scoreSum].stage);
        const revealStageDisplay = oldValue != null &&
            counterpickAlertContent.value != null && (
                newValue.scoreSum > oldValue.scoreSum ||
                isUnfinishedCounterpick(newValue.games[newValue.scoreSum].stage) &&
                !isUnfinishedCounterpick(oldValue.games[oldValue.scoreSum].stage)
            );

        if ((oldValue == null || counterpickAlertContent.value == null) && !revealCounterpickAlert) {
            stageDisplayGames.value = activeRoundStore.activeRound.games.slice(0, newValue.scoreSum + 1);
        } else if (!revealStageDisplay) {
            nextPickingTeam.value = activeRoundStore.nextPickingTeam ?? 'alpha';
            counterpickAlertContent.value = activeRoundStore.activeRound.games[newValue.scoreSum];
        }

        if (oldValue == null) {
            return;
        }

        if (revealCounterpickAlert) {
            tl.clear();

            tl
                .add(transitions.StageDisplay.leave())
                .add(transitions.CounterpickAlert.enter(), 'enter')
                .add(transitions.CounterpickAlertBackground.enter(), 'enter');
        } else if (revealStageDisplay) {
            tl.clear();

            stageDisplayGames.value = activeRoundStore.activeRound.games.slice(0, newValue.scoreSum + 1);

            tl
                .add(transitions.CounterpickAlert.leave(), 'leave')
                .add(transitions.CounterpickAlertBackground.leave(), 'leave')
                .add(() => {
                    counterpickAlertContent.value = null;
                    tl.add(transitions.StageDisplay.enter());
                });
        }
    }, { immediate: true });
});
</script>

<style lang="scss" scoped>
.counterpick-alert-wrapper {
    height: 30%;
    bottom: 0;
    top: unset;

    > * {
        position: absolute;
    }
}
</style>
