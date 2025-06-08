<template>
    <canvas ref="canvas" />
</template>

<!--
  impl. notes:
  - canvas is never expected to resize (at the moment)
  - return false in tickFunction to stop the animation loop at any point
 -->

<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { ManagedCanvasFallbackFactory } from '../types/ManagedCanvas';

const canvas = useTemplateRef('canvas');
let mounted = true;
const startFunction = ref<(() => void) | null>(null);
const ctxRef = ref<CanvasRenderingContext2D | null>(null);

const props = withDefaults(defineProps<{
    callbackFactory: ManagedCanvasFallbackFactory
    autoStart?: boolean
    scale?: number
}>(), {
    autoStart: false,
    scale: 1
});

onMounted(() => {
    if (canvas.value == null) {
        console.warn('missing canvas');
        return;
    }

    canvas.value.width = canvas.value.clientWidth * props.scale;
    canvas.value.height = canvas.value.clientHeight * props.scale;

    const ctx = canvas.value.getContext('2d');
    if (ctx == null) {
        console.warn('no canvas context');
        return;
    }

    ctx.scale(props.scale, props.scale);

    const { init, tick } = props.callbackFactory(ctx);

    let startTime: number | null = null;
    let lastTime = 0;

    const redraw = (time: number) => {
        if (!mounted || startTime == null) {
            return;
        }

        const deltaTime = time - lastTime;
        const elapsed = time - startTime;
        lastTime = time;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        if (tick(ctx, deltaTime, elapsed, time) === false) {
            startTime = null;
        } else {
            requestAnimationFrame(redraw);
        }
    }

    startFunction.value = () => {
        startTime = lastTime = (document.timeline.currentTime as number ?? 0);
        init?.(ctx);
        requestAnimationFrame(redraw);
    };

    if (props.autoStart) {
        startFunction.value();
    }
});

onUnmounted(() => {
    mounted = false;
});

defineExpose({
    start: startFunction,
    ctx: ctxRef
});
</script>
