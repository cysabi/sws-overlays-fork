<template>
    <div class="timer">
        {{ nextRoundTimerText }}
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { DateTime } from 'luxon';
import { useBreakScreenStore } from 'browser-shared/stores/BreakScreenStore';

const breakScreenStore = useBreakScreenStore();

const parsedNextRoundTimeDiff = computed(() => DateTime.fromISO(breakScreenStore.nextRoundStartTime.startTime).diffNow());

function getNextRoundTimerText() {
    const diffNow = parsedNextRoundTimeDiff.value;
    if (diffNow.toMillis() <= 0) {
        return '00:00';
    }
    return diffNow.toFormat('mm:ss');
}

const nextRoundTimerText = ref(getNextRoundTimerText());

let nextRoundTimerTextSetterInterval: number | undefined = undefined;

onMounted(() => {
    nextRoundTimerTextSetterInterval = window.setInterval(() => {
        nextRoundTimerText.value = getNextRoundTimerText();
    }, 100);
});

onUnmounted(() => {
    window.clearInterval(nextRoundTimerTextSetterInterval);
});
</script>

<style scoped lang="scss">
@use '../styles/font-mixins';

.timer {
    @include font-mixins.font-haverbrooke;
    font-variant-numeric: tabular-nums;
    text-align: center;
}
</style>
