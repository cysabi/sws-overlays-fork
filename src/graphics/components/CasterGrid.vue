<template>
    <div class="casters-wrapper layout horiz center-horizontal">
        <div class="casters-layout">
            <caster-display
                v-for="(caster, id) in props.casters"
                :key="id"
                :caster="caster"
                :width="casterWidth"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import CasterDisplay from './CasterDisplay.vue';
import { computed } from 'vue';
import { Casters } from 'schemas';

const props = defineProps<{
    casters: Casters
}>();

const casterWidth = computed(() => {
    switch (Object.keys(props.casters).length) {
        case 1:
            return 1000;
        case 2:
            return 800;
        default:
            return 700;
    }
});
</script>

<style scoped lang="scss">
.casters-wrapper {
    position: absolute;
    top: 50px;
    z-index: 999;
}

.casters-layout {
    height: 590px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-end;

    > * {
        flex-basis: 50%;
    }
}
</style>
