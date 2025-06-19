<template>
    <div class="ticker-graphic">
        <ticker-scoreboard class="ticker-scoreboard" />
    </div>
</template>

<script setup lang="ts">
import TickerScoreboard from './TickerScoreboard.vue';
</script>

<style lang="scss">
@use '../../styles/constants';

body {
    height: 1080px;
}

#app {
    transform: translateY(1080px - constants.$bottom-ticker-height);
    height: constants.$bottom-ticker-height !important;
    overflow: hidden;
    background: linear-gradient(to bottom, #333 0%, #292929 100%);
    filter: drop-shadow(0 2px 12px #000);
}
</style>

<style scoped lang="scss">
.ticker-scoreboard {
    height: 65px;
    margin-top: 4px;
}
</style>
