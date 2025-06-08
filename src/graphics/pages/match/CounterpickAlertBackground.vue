<template>
    <div class="counterpick-alert-background">
        <managed-canvas
            :callback-factory="canvasCallbacks"
            class="max-width max-height"
            auto-start
        />
    </div>
</template>

<script setup lang="ts">
import { ManagedCanvasFallbackFactory } from '../../types/ManagedCanvas';
import { deg2rad } from '../../helpers/MathHelper';
import ManagedCanvas from 'components/ManagedCanvas.vue';
import { useDecorationStore } from 'browser-shared/stores/DecorationStore';

const decorationStore = useDecorationStore();

const canvasCallbacks: ManagedCanvasFallbackFactory = (ctx) => {
    const textHeight = 125;
    const textTiltDegrees = 70;
    const textTiltRadians = deg2rad(270 + textTiltDegrees);
    const itemSpacing = (textHeight * 0.85) / Math.cos(deg2rad(textTiltDegrees));
    // stupid magic number
    const itemCount = Math.ceil(ctx.canvas.width / itemSpacing) + 5;
    const itemOffsetX = itemSpacing / 2;
    const idleAnimationSpeedDivisor = 10;
    const introAnimationSpeedDivisor = 0.25;
    let animationSpeedDivisor = idleAnimationSpeedDivisor;

    const textRepetitionCount = 5;
    const textContent = 'COUNTERPICK ';
    const fullTextContent = new Array(textRepetitionCount).fill(textContent).join('');
    ctx.font = `400 ${textHeight}px Haverbrooke`;
    ctx.textAlign = 'end';
    const textSegmentSize = ctx.measureText(textContent);
    const fullTextSegmentWidth = textSegmentSize.width * textRepetitionCount;
    let textSlideDistances: number[];
    let centerFadeProgress = 0;
    let introAnimationProgress = 0;

    // Switching fonts twice per frame is unfathomably expensive, instead we draw them once and remember them
    const filledTextSegmentCanvas = new OffscreenCanvas(fullTextSegmentWidth, textSegmentSize.fontBoundingBoxAscent + textSegmentSize.fontBoundingBoxDescent);
    const ftsctx = filledTextSegmentCanvas.getContext('2d', { willReadFrequently: false })!;
    ftsctx.font = `400 ${textHeight}px Haverbrooke`;
    ftsctx.fillStyle = '#A032DB';
    ftsctx.fillText(fullTextContent, 0, textSegmentSize.actualBoundingBoxAscent);

    const hollowTextSegmentCanvas = new OffscreenCanvas(fullTextSegmentWidth, textSegmentSize.fontBoundingBoxAscent + textSegmentSize.fontBoundingBoxDescent);
    const htsctx = hollowTextSegmentCanvas.getContext('2d', { willReadFrequently: false })!;
    htsctx.font = `400 ${textHeight}px Haverbrooke Hollow`;
    htsctx.fillStyle = '#A032DB';
    htsctx.fillText(fullTextContent, 0, textSegmentSize.actualBoundingBoxAscent);

    // Offset the text so the top right corner should touch the top of the canvas
    const textDrawStartOffsetY = fullTextSegmentWidth * Math.sin(2 * Math.PI - textTiltRadians);
    const textDrawStartOffsetX = Math.sqrt(Math.pow(fullTextSegmentWidth, 2) - Math.pow(textDrawStartOffsetY, 2));

    function easeOutQuad(x: number): number {
        return 1 - (1 - x) * (1 - x);
    }

    function easeOutQuart(x: number): number {
        return 1 - Math.pow(1 - x, 4);
    }

    return {
        init: () => {
            textSlideDistances = Array.from({ length: itemCount }, (_, i) => i % 2 === 0 ? textSegmentSize.width * 5.1 : -textSegmentSize.width);
            centerFadeProgress = 0;
            introAnimationProgress = 0;
            animationSpeedDivisor = introAnimationSpeedDivisor;
        },
        tick: (ctx, delta, elapsed) => {
            ctx.translate(itemOffsetX / 2, 50);
            ctx.globalCompositeOperation = 'source-over';

            if (introAnimationProgress !== 1 && elapsed > 200) {
                animationSpeedDivisor = introAnimationSpeedDivisor + (idleAnimationSpeedDivisor - introAnimationSpeedDivisor) * easeOutQuad(introAnimationProgress);
                introAnimationProgress = Math.min(1, introAnimationProgress + delta / 3500);
            }

            for (let i = 1; i < itemCount; i += 2) {
                textSlideDistances[i] = textSlideDistances[i] >= textSegmentSize.width * 2 ? textSegmentSize.width : textSlideDistances[i] + delta / animationSpeedDivisor;
                const textSlideOffsetY = textSlideDistances[i] * Math.sin(2 * Math.PI - textTiltRadians);
                const textSlideOffsetX = Math.sqrt(Math.pow(textSlideDistances[i], 2) - Math.pow(textSlideOffsetY, 2)) * (textSlideDistances[i] < 0 ? -1 : 1);

                ctx.setTransform(Math.cos(textTiltRadians), Math.sin(textTiltRadians), -Math.sin(textTiltRadians), Math.cos(textTiltRadians), (itemSpacing * i) - itemOffsetX + textSlideOffsetX - textDrawStartOffsetX, -textSlideOffsetY + textDrawStartOffsetY);
                ctx.drawImage(hollowTextSegmentCanvas, 0, 0);
            }

            for (let i = 0; i < itemCount; i += 2) {
                textSlideDistances[i] = textSlideDistances[i] <= textSegmentSize.width ? textSegmentSize.width * 2 : textSlideDistances[i] - delta / animationSpeedDivisor;
                const textSlideOffsetY = textSlideDistances[i] * Math.sin(2 * Math.PI - textTiltRadians);
                const textSlideOffsetX = Math.sqrt(Math.pow(textSlideDistances[i], 2) - Math.pow(textSlideOffsetY, 2));

                ctx.setTransform(Math.cos(textTiltRadians), Math.sin(textTiltRadians), -Math.sin(textTiltRadians), Math.cos(textTiltRadians), (itemSpacing * i) - itemOffsetX + textSlideOffsetX - textDrawStartOffsetX, -textSlideOffsetY + textDrawStartOffsetY);
                ctx.drawImage(filledTextSegmentCanvas, 0, 0);
            }

            ctx.globalCompositeOperation = 'destination-in';
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            const topFadeGradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            topFadeGradient.addColorStop(0, '#00000000');
            topFadeGradient.addColorStop(1, '#000000');
            ctx.fillStyle = topFadeGradient;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            // if (elapsed > 1500) {
            //     centerFadeProgress = Math.min(1, centerFadeProgress + delta / 500);
            //     const innerCenterFadeWidth = 750 * easeOutQuad(centerFadeProgress);
            //     const outerCenterFadeWidth = 1100 * easeOutQuart(centerFadeProgress);
            //     const innerCenterFadeXOffset = (ctx.canvas.width - innerCenterFadeWidth) / 2;
            //     const outerCenterFadeXOffset = (ctx.canvas.width - outerCenterFadeWidth) / 2;
            //     const centerFadeGradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
            //     centerFadeGradient.addColorStop(0, '#000000');
            //     centerFadeGradient.addColorStop(outerCenterFadeXOffset / ctx.canvas.width, '#000000');
            //     centerFadeGradient.addColorStop(innerCenterFadeXOffset / ctx.canvas.width, '#00000000');
            //     centerFadeGradient.addColorStop((innerCenterFadeXOffset + innerCenterFadeWidth) / ctx.canvas.width, '#00000000');
            //     centerFadeGradient.addColorStop((outerCenterFadeXOffset + outerCenterFadeWidth) / ctx.canvas.width, '#000000');
            //     centerFadeGradient.addColorStop(1, '#000000');
            //     ctx.fillStyle = centerFadeGradient;
            //     ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            // }
        }
    };
};
</script>

<style scoped lang="scss">
.counterpick-alert-background {
    width: 100%;
    height: 30%;
    top: unset;
    bottom: 0;
}
</style>
