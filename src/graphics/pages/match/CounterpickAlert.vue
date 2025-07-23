<template>
    <div
        class="counterpick-alert"
        ref="root"
    >
        <large-stage-detail-display
            v-if="props.game != null"
            class="underlay"
            :title="localeInfoStore.strings.match.stages.pickingTeamName(activeRoundStore.getTeamName(nextPickingTeam, '???'))"
            :color="props.nextPickingTeam"
            :game="props.game"
        />
    </div>
</template>

<script setup lang="ts">
import { ActiveRound } from 'schemas';
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import { Application, Graphics, Sprite, Text } from 'pixi.js';
import gsap from 'gsap';
import LargeStageDetailDisplay from './LargeStageDetailDisplay.vue';
import { provideTransitionMapMember } from '../../helpers/TransitionHelper';
import { useActiveRoundStore } from 'browser-shared/stores/ActiveRoundStore';
import { DotGridParticleContainer } from 'components/DotGridParticleContainer';
import { useLocaleInfoStore } from 'browser-shared/stores/LocaleInfoStore';

const activeRoundStore = useActiveRoundStore();
const localeInfoStore = useLocaleInfoStore();

const root = useTemplateRef('root');

const canvasVisible = ref(false);

const props = defineProps<{
    game: ActiveRound['games'][number] | null
    nextPickingTeam: 'alpha' | 'bravo'
}>();

const app = new Application();

const tickerCallback = (time: number) => {
    app.ticker.update(time);
};

onUnmounted(() => {
    gsap.ticker.remove(tickerCallback);
    setTimeout(app.destroy, 10);
});

onMounted(() => {
    root.value!.prepend(app.canvas);
});

await app.init({
    width: 800,
    height: 150,
    backgroundAlpha: 0
});
app.ticker.stop();

app.canvas.classList.add('max-width', 'max-height');

gsap.ticker.add(tickerCallback);

const dotRadius = 35;
const dotGridParticleContainer = new DotGridParticleContainer(app, dotRadius);

const endMask = new Graphics();
endMask.rect(0, 0, app.renderer.width, app.renderer.height);
endMask.fill(0xFFFFFF);
app.stage.addChild(endMask);

const background = new Graphics({ width: app.renderer.width, height: app.renderer.height });
background.rect(0, 0, app.renderer.width, app.renderer.height);
background.fill(0xFFFFFF);
app.stage.addChild(background);

const text = new Text({
    text: localeInfoStore.strings.match.stages.pickingTeamName('???'),
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
    text: localeInfoStore.strings.match.stages.pickingTeamName(activeRoundStore.getTeamName(props.nextPickingTeam, '???'))
}), newValue => {
    background.tint = newValue.team === 'alpha' ? 0xE8D912 : 0xA032DB;
    text.style.fill = newValue.team === 'alpha' ? 0x222222 : 0xFFFFFF;
    text.text = newValue.text;
}, { immediate: true });

function setUnderlayOpacity(elem: HTMLElement, opacity: string) {
    (elem.querySelector('.underlay') as HTMLElement).style.opacity = opacity;
}

provideTransitionMapMember({
    beforeEnter: (elem) => {
        canvasVisible.value = true;
        setUnderlayOpacity(elem, '0');
        gsap.set(dotGridParticleContainer.particles, { scaleX: 0, scaleY: 0 });
        gsap.set(text, { pixi: { scaleY: 0.9, scaleX: text.scale.x - 0.05 } });
        gsap.set(endMask, { pixi: { scaleX: 1 } });
        text.visible = true;
        text.visible = true;
        text.scale.y = 0.9;
        text.scale.x = 1;
        text.width = Math.min(text.width, app.renderer.width * 0.9);
        app.stage.mask = new Sprite(app.renderer.generateTexture({ target: dotGridParticleContainer }));
    },
    enter: (elem, done) => {
        const tl = gsap.timeline({
            onComplete: done
        });

        tl
            .to(dotGridParticleContainer.particles, {
                duration: 0.75,
                ease: 'power2.out',
                scaleX: 1,
                scaleY: 1,
                stagger: {
                    each: 0.015,
                    from: 'center',
                    axis: 'y',
                    grid: dotGridParticleContainer.gridSize
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
                    setUnderlayOpacity(elem, '1');
                    app.stage.mask = endMask;
                }
            }, '-=0.5');

        return tl;
    },
    leave: (elem, done) => {
        const tl = gsap.timeline({
            onComplete: done,
            onStart: () => {
                canvasVisible.value = true;
                text.visible = false;
                gsap.set(dotGridParticleContainer.particles, { scaleX: 1, scaleY: 1 });
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
                    setUnderlayOpacity(elem, '0');
                }
            })
            .to(dotGridParticleContainer.particles, {
                duration: 0.75,
                ease: 'power2.out',
                scaleX: 0,
                scaleY: 0,
                stagger: {
                    each: 0.015,
                    from: 'edges',
                    axis: 'y',
                    grid: dotGridParticleContainer.gridSize
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
}, 'UnderCameraGraphic');
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
