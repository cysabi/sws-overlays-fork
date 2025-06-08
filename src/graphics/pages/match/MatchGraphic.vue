<template>
    <div class="content-wrapper counterpick-alert-wrapper layout vertical center-horizontal center-vertical">
        <counterpick-alert v-if="alertBackgroundVisible" style="width: 800px; height: 150px" />
    </div>
    <maze-background>
        <counterpick-alert-background v-if="alertBackgroundVisible" />
    </maze-background>
</template>

<script setup lang="ts">
import MazeBackground from 'components/MazeBackground.vue';
import CounterpickAlert from './CounterpickAlert.vue';
import CounterpickAlertBackground from './CounterpickAlertBackground.vue';
import { ref } from 'vue';

const alertBackgroundVisible = ref(false);

document.addEventListener('click', () => alertBackgroundVisible.value = !alertBackgroundVisible.value);
</script>

<style lang="scss" scoped>
.counterpick-alert-wrapper {
    height: 30%;
    bottom: 0;
    top: unset;
}
</style>
