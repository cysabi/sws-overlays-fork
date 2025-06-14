<template>
    <div
        class="counterpick-alert"
        ref="root"
    >
        <canvas
            v-show="canvasVisible"
            ref="canvas"
            class="max-width max-height"
        />
        <LargeStageDetailDisplay
            v-if="props.game != null"
            class="underlay"
            :title="`${activeRoundStore.getTeamName(props.nextPickingTeam, '???')}'s Pick`"
            :color="props.nextPickingTeam"
            :style="{ opacity: underlayVisible ? '1' : '0' }"
            :game="props.game"
        />
    </div>
</template>

<script setup lang="ts">
import { ActiveRound } from 'schemas';
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import {
    Application,
    Graphics,
    Particle,
    ParticleContainer,
    Rectangle,
    Sprite,
    Text
} from 'pixi.js';
import gsap from 'gsap';
import LargeStageDetailDisplay from './LargeStageDetailDisplay.vue';
import { fillLazyTransitionMapMember, initLazyTransitionMapMember } from '../../helpers/TransitionHelper';
import { useActiveRoundStore } from 'browser-shared/stores/ActiveRoundStore';

const activeRoundStore = useActiveRoundStore();

const root = useTemplateRef('root');
const canvas = useTemplateRef('canvas');

const transitions = initLazyTransitionMapMember(root);

const canvasVisible = ref(false);
const underlayVisible = ref(false);

const props = defineProps<{
    game: ActiveRound['games'][number] | null
    nextPickingTeam: 'alpha' | 'bravo'
}>();

onMounted(async () => {
    const app = new Application();
    let ctx: gsap.Context | null = null;

    const tickerCallback = (time: number) => {
        app.ticker.update(time);
    };

    onUnmounted(() => {
        gsap.ticker.remove(tickerCallback);
        app.destroy();
        if (ctx != null) {
            // ctx.revert();
        }
    });

    await app.init({
        canvas: canvas.value!,
        width: 800,
        height: 150,
        backgroundAlpha: 0
    });
    app.ticker.stop();

    gsap.ticker.add(tickerCallback);

    const dotRadius = 35;
    const dotGraphics = new Graphics({
        width: dotRadius,
        height: dotRadius
    });
    dotGraphics.circle(0, 0, dotRadius).fill(0xFFFFFF);
    const dotTexture = app.renderer.generateTexture({ target: dotGraphics });

    const dotCountX = Math.ceil(app.renderer.width / dotRadius);
    const dotCountY = Math.ceil(app.renderer.height / dotRadius);
    const dotOffsetX = -((dotCountX * dotRadius - app.renderer.width) / 2) + dotRadius / 2;
    const dotOffsetY = -((dotCountY * dotRadius - app.renderer.height) / 2) + dotRadius / 2;
    const dotGridParticleContainer = new ParticleContainer({
        dynamicProperties: {
            vertex: true
        }
    });
    dotGridParticleContainer.boundsArea = new Rectangle(0, 0, app.renderer.width, app.renderer.height);

    const particles: Particle[] = [];
    for (let i = 0; i < dotCountX; i++) {
        for (let j = 0; j < dotCountY; j++) {
            const particle = new Particle({
                texture: dotTexture,
                x: dotRadius * i + dotOffsetX,
                y: dotRadius * j + dotOffsetY,
                scaleX: 0,
                scaleY: 0,
                anchorX: 0.5,
                anchorY: 0.5
            });
            dotGridParticleContainer.addParticle(particle);
            particles.push(particle);
        }
    }

    const endMask = new Graphics();
    endMask.rect(0, 0, app.renderer.width, app.renderer.height);
    endMask.fill(0xFFFFFF);
    app.stage.addChild(endMask);

    const background = new Graphics({ width: app.renderer.width, height: app.renderer.height });
    background.rect(0, 0, app.renderer.width, app.renderer.height);
    background.fill(0xFFFFFF);
    app.stage.addChild(background);

    const text = new Text({
        text: '???\'S PICK',
        style: {
            fill: 0xFFFFFF,
            fontSize: 128,
            fontFamily: 'Barlow',
            fontWeight: '800'
        },
        anchor: 0.5,
        position: {
            x: app.renderer.width / 2,
            y: app.renderer.height / 2 - 8
        }
    });
    text.scale.y = 0.9;
    text.width = Math.min(text.width, app.renderer.width * 0.9);

    app.stage.addChild(text);

    watch(() => ({
        team: props.nextPickingTeam,
        text: `${activeRoundStore.getTeamName(props.nextPickingTeam, '???').toUpperCase()}'S PICK`
    }), newValue => {
        background.tint = newValue.team === 'alpha' ? 0xE0A000 : 0xA032DB;
        text.text = newValue.text;
    }, { immediate: true });

    fillLazyTransitionMapMember(transitions, {
        enter: () => {
            const tl = gsap.timeline({
                onStart: () => {
                    canvasVisible.value = true;
                    underlayVisible.value = false;
                    gsap.set(particles, { scaleX: 0, scaleY: 0 });
                    gsap.set(text, { pixi: { scaleY: 0.9, scaleX: text.scale.x - 0.05 } });
                    gsap.set(endMask, { pixi: { scaleX: 1 } });
                    text.visible = true;
                    text.visible = true;
                    text.scale.y = 0.9;
                    text.scale.x = 1;
                    text.width = Math.min(text.width, app.renderer.width * 0.9);
                }
            });

            tl
                .to(particles, {
                    duration: 0.75,
                    ease: 'power2.out',
                    scaleX: 1,
                    scaleY: 1,
                    stagger: {
                        each: 0.015,
                        from: 'center',
                        axis: 'y',
                        grid: [dotCountX, dotCountY]
                    },
                    onUpdate: () => {
                        if (app.renderer) {
                            app.stage.mask = new Sprite(app.renderer.generateTexture({ target: dotGridParticleContainer }));
                        }
                    },
                    onComplete: () => {
                        app.stage.mask = null;
                    }
                }, 'intro')
                .to(text, {
                    duration: 2,
                    ease: 'none',
                    pixi: {
                        scaleY: 0.95,
                        scaleX: '+=0.05'
                    }
                }, 'intro')
                .to(endMask, {
                    duration: 0.5,
                    ease: 'power4.out',
                    pixi: {
                        scaleX: 0
                    },
                    onStart: () => {
                        underlayVisible.value = true;
                        app.stage.mask = endMask;
                    },
                    onComplete: () => {
                        canvasVisible.value = false;
                        app.stage.mask = null;
                    }
                }, '-=0.5');

            return tl;
        },
        leave: () => {
            const tl = gsap.timeline({
                onStart: () => {
                    canvasVisible.value = true;
                    text.visible = false;
                    gsap.set(particles, { scaleX: 1, scaleY: 1 });
                }
            });

            tl
                .to(endMask, {
                    duration: 0.5,
                    ease: 'power4.in',
                    pixi: {
                        scaleX: 1
                    },
                    onStart: () => {
                        app.stage.mask = endMask;
                    },
                    onComplete: () => {
                        underlayVisible.value = false;
                    }
                })
                .to(particles, {
                    duration: 0.75,
                    ease: 'power2.out',
                    scaleX: 0,
                    scaleY: 0,
                    stagger: {
                        each: 0.015,
                        from: 'edges',
                        axis: 'y',
                        grid: [dotCountX, dotCountY]
                    },
                    onUpdate: () => {
                        if (app.renderer) {
                            app.stage.mask = new Sprite(app.renderer.generateTexture({ target: dotGridParticleContainer }));
                        }
                    },
                    onComplete: () => {
                        canvasVisible.value = false;
                        app.stage.mask = null;
                    }
                });

            return tl;
        }
    });
});
</script>

<style scoped lang="scss">
.counterpick-alert {
    position: relative;
    filter: drop-shadow(0 0 3px rgba(34, 34, 34, 0.25));
}

.counterpick-alert > :deep(canvas) {
    transition: opacity 250ms;
}

.underlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
}
</style>
