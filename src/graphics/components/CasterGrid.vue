<template>
    <div
        class="casters-wrapper layout horiz center-horizontal"
        :class="`caster-count-${Object.keys(props.casters).length}`"
        ref="wrapper"
    >
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
import { computed, onMounted, onUpdated, useTemplateRef, watch } from 'vue';
import { Casters } from 'schemas';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

const wrapper = useTemplateRef('wrapper');

const props = withDefaults(defineProps<{
    casters: Casters
    compact?: boolean
}>(), {
    compact: false
});

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

function applyCompactClasses() {
    if (props.compact) {
        wrapper.value!.classList.add('compact');
        wrapper.value!.querySelectorAll('.caster-display-wrapper').forEach(wrapper => {
            wrapper.classList.add('compact');
        });
    }
}

onUpdated(() => {
    applyCompactClasses();
});

onMounted(() => {
    applyCompactClasses();

    watch(() => props.compact, newValue => {
        const state1 = Flip.getState(wrapper.value!.querySelectorAll('.caster-display-wrapper'));
        if (newValue) {
            wrapper.value!.classList.add('compact');
            wrapper.value!.querySelectorAll('.caster-display-wrapper').forEach(wrapper => {
                wrapper.classList.add('compact');
            });
        } else {
            wrapper.value!.classList.remove('compact');
            wrapper.value!.querySelectorAll('.caster-display-wrapper').forEach(wrapper => {
                wrapper.classList.remove('compact');
            });
        }

        const tl = gsap.timeline({
            delay: newValue ? 0 : 0.1
        });

        tl
            .add(Flip.from(state1, {
                duration: 0.75,
                ease: 'power3.inOut',
                scale: true
            }), 'anim');
    });
});
</script>

<style scoped lang="scss">
.casters-wrapper {
    position: absolute;
    top: 100px;
    z-index: 999;

    &.compact {
        transform: translateX(-600px);
    }

    &.compact .casters-layout {
        grid-template-columns: 1fr;
    }

    &:not(.compact).caster-count-1 :deep(.caster-display-wrapper),
    &:not(.compact).caster-count-3 :deep(.caster-display-wrapper:last-child) {
        grid-column: span 2;
    }
}

.casters-layout {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: minmax(0, 1fr);
    justify-content: center;
    align-items: center;
    justify-items: center;
}
</style>
