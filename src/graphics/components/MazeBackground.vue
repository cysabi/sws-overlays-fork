<template>
    <div class="maze-background">
        <div class="maze-background-maze" />
        <slot />
        <div
            class="maze-background-alert"
            :class="{ visible: decorationStore.mazeBackgroundAlert }"
            :style="{ '--color': decorationStore.mazeBackgroundAlertColor }"
        />
    </div>
</template>

<script setup lang="ts">
import { useDecorationStore } from 'browser-shared/stores/DecorationStore';

const decorationStore = useDecorationStore();
</script>

<style scoped lang="scss">
@use '../styles/colors';

.maze-background, .maze-background > * {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
}

.maze-background {
    background-color: colors.$background-light;
}

.maze-background-maze {
    z-index: 2;
    background-image: url('../assets/pattern-maze.png');
    background-position: center;
    mix-blend-mode: overlay;
}

.maze-background-alert {
    background: linear-gradient(to bottom, transparent 50%, var(--color) 95%);
    transition: opacity 1500ms;
    opacity: 0;

    &.visible {
        opacity: 0.5;
    }
}
</style>
