<template>
    <transition
        mode="out-in"
        @enter="scoreCounterEnter"
        @leave="scoreCounterLeave"
        @before-enter="beforeScoreCounterEnter"
    >
        <fitted-content
            :key="value"
            align="center"
        >
            {{ value }}
        </fitted-content>
    </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';
import FittedContent from './FittedContent.vue';

const props = defineProps<{
    value: number
}>();

const oldValue = ref<number | null>(null);

function beforeScoreCounterEnter(elem: HTMLElement) {
    gsap.set(elem, { x: props.value > (oldValue.value ?? 0) ? '100%' : '-100%' });
    oldValue.value = props.value;
}

function scoreCounterEnter(elem: HTMLElement, done: gsap.Callback) {
    gsap.to(elem, { duration: 0.15, x: '0%', ease: 'power2.out', onComplete: done });
}

function scoreCounterLeave(elem: HTMLElement, done: gsap.Callback) {
    gsap.to(elem, { duration: 0.15, x: props.value > (oldValue.value ?? 0) ? '-100%' : '100%', ease: 'power2.in', onComplete: done });
}
</script>
