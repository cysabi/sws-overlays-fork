<template>
    <div class="counterpick-alert">
        <canvas
            ref="canvas"
            class="max-width max-height"
        />
        <div
            class="underlay"
            :style="{ opacity: underlayVisible ? 1 : 0 }"
        >
            <div
                class="stage-image"
                :style="{ backgroundImage: `url('${assetPathStore.getStageImagePath('Inkblot Art Academy')}')` }"
            />
            <div class="pick-info-layout">
                <div class="picker-name">Yaotl Teotl's Pick</div>
                <div class="picked-stage">Inkblot Art Academy</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { useAssetPathStore } from 'browser-shared/stores/AssetPathStore';
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

const canvas = useTemplateRef('canvas');

const assetPathStore = useAssetPathStore();

const underlayVisible = ref(false);

onMounted(async () => {
    if (!canvas.value) {
        console.error('missing canvas context');
        return;
    }

    const app = new Application();
    let ctx: gsap.Context | null = null;

    const tickerCallback = (time: number) => {
        app.ticker.update(time);
    };

    onUnmounted(() => {
        gsap.ticker.remove(tickerCallback);
        app.destroy();
        if (ctx != null) {
            ctx.revert();
        }
    });

    await app.init({
        canvas: canvas.value,
        resizeTo: canvas.value,
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
    background.fill(0xA032DB);
    app.stage.addChild(background);

    const text = new Text({
        text: 'YAOTL TEOTL\'S PICK',
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

    ctx = gsap.context(() => {
        const tl = gsap.timeline({ paused: false });

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
                    scaleX: text.scale.x + 0.05
                }
            }, 'intro')
            .to(endMask, {
                duration: 0.5,
                ease: 'power4.out',
                pixi: {
                    scaleX: 0
                },
                onStart: () => {
                    app.stage.mask = endMask;
                    underlayVisible.value = true;
                }
            }, '-=0.5');
    });
});
</script>

<style scoped lang="scss">
.counterpick-alert {
    position: relative;
    filter: drop-shadow(0 0 5px rgba(34, 34, 34, 0.3));
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
    background: linear-gradient(to bottom, #F0F0F0 0%, #E3E3E3 100%);
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 16px;

    .pick-info-layout {
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: #333333;
    }

    .stage-image {
        aspect-ratio: 16 / 9;
        height: 100%;
        background-size: cover;
        background-repeat: no-repeat;
    }

    .picker-name {
        font-family: 'Barlow Condensed';
        font-weight: 400;
        font-size: 28px;
        color: #A032DB;
        margin-top: 2px;
    }

    .picked-stage {
        font-weight: 700;
        font-size: 55px;
        margin-top: -10px;
    }
}
</style>
