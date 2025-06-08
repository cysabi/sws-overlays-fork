<template>
    <div class="counterpick-alert">
        <managed-canvas
            ref="managedIntroCanvas"
            :callback-factory="callbackFactory"
            class="max-width max-height"
            auto-start
            :scale="2"
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
import { ManagedCanvasFallbackFactory } from '../../types/ManagedCanvas';
import ManagedCanvas from 'components/ManagedCanvas.vue';
import { ref } from 'vue';
import { useAssetPathStore } from 'browser-shared/stores/AssetPathStore';

const assetPathStore = useAssetPathStore();

const underlayVisible = ref(false);

const distanceFromCenter = (max: number) => {
    const even = max % 2 === 0;
    const middle = Math.floor(max / 2);
    return (value: number) => {
        if (even && value < middle) {
            return middle - value - 1;
        }

        return Math.abs(middle - value);
    }
};
let circleRadii: number[] = [];

function easeOutQuad(x: number): number {
    return 1 - (1 - x) * (1 - x);
}

function easeInExpo(x: number): number {
    return x < 0.03125 ? x === 0 ? 0 : Math.pow(2, 10 * x - 10) : 1 - (1 - x) * (1 - x);
}

const callbackFactory: ManagedCanvasFallbackFactory = (ctx) => {
    const dotSpacing = 70;
    const dotXOffset = (ctx.canvas.width % dotSpacing) / 2;
    const dotYOffset = (ctx.canvas.height % dotSpacing) / 2;
    const gridItemCountX = Math.floor(ctx.canvas.width / dotSpacing) + 1;
    const gridItemCountY = Math.floor(ctx.canvas.height / dotSpacing) + 1;
    const distanceFromX = distanceFromCenter(gridItemCountX);
    // const startDelayMillis = 500;
    const startDelayMillis = 0;
    const titleFontSize = 256;
    let revealEndTime: number | null = null;
    let titleFontScale = 0.5;
    let introMaskProgress = 0;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // todo: tickIn, tickIdle, tickOut?
    return {
        init: () => {
            circleRadii = new Array(gridItemCountX).fill(0);
            titleFontScale = 0.9;
            introMaskProgress = 0;
            revealEndTime = null;
        },
        tick: (ctx, delta, elapsed) => {
            if (elapsed < startDelayMillis) return;

            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = '#000000';

            for (let x = 0; x < gridItemCountX; x++) {
                const distance = distanceFromX(x);
                if (distance * 40 < elapsed - startDelayMillis && circleRadii[x] <= dotSpacing) {
                    circleRadii[x] = Math.min(0.5, circleRadii[x] + delta / 500);
                }

                for (let y = 0; y < gridItemCountY; y++) {
                    ctx.beginPath();
                    ctx.arc(
                        x * dotSpacing + dotXOffset,
                        y * dotSpacing + dotYOffset,
                        easeInExpo(circleRadii[x]) * dotSpacing,
                        0,
                        Math.PI * 2);
                    ctx.fill();
                }
            }

            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = '#A032DB';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            ctx.fillStyle = '#FFF';
            ctx.font = `800 ${titleFontSize}px Barlow`;
            ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
            ctx.scale(titleFontScale, titleFontScale);
            ctx.fillText('YAOTL TEOTL\'S PICK', 0, 0, ctx.canvas.width - 20);
            titleFontScale += delta / 20000;
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            if (circleRadii[0] === 0.5 && revealEndTime == null) {
                revealEndTime = elapsed;
            }

            if (revealEndTime != null && elapsed > revealEndTime + 750) {
                underlayVisible.value = true;
                ctx.globalCompositeOperation = 'destination-in';
                const introMaskWidth = ctx.canvas.width * (1 - easeOutQuad(introMaskProgress));
                ctx.fillRect(0, 0, introMaskWidth, ctx.canvas.height);
                introMaskProgress = introMaskProgress + delta / 250;
            }

            return introMaskProgress <= 1;
        }
    };
}
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
