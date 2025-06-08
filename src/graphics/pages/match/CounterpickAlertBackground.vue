<template>
    <div class="counterpick-alert-background">
        <canvas
            ref="canvas"
            class="max-width max-height"
        />
    </div>
</template>

<script setup lang="ts">
import { deg2rad } from '../../helpers/MathHelper';
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import {
    Application,
    CanvasTextOptions,
    Container,
    FillGradient,
    Graphics,
    PointData,
    Sprite,
    Text, Texture,
    TilingSprite
} from 'pixi.js';
import gsap from 'gsap';

const canvas = useTemplateRef('canvas');

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

    const textOptions = (fontFamily: string): CanvasTextOptions => ({
        text: 'COUNTERPICK ',
        style: {
            fill: 0xA032DB,
            fontSize: 125,
            fontFamily,
            fontWeight: '400'
        }
    });
    const textFilled = new Text(textOptions('Haverbrooke'));
    const textFilledTexture = app.renderer.generateTexture(textFilled);
    const textHollow = new Text(textOptions('Haverbrooke Hollow'));
    const textHollowTexture = app.renderer.generateTexture(textHollow);

    const textTiltDegrees = -20;
    const tiltedTextContainer = new Container({
        angle: textTiltDegrees
    });
    app.stage.addChild(tiltedTextContainer);
    const tiltedTextWidth = textFilledTexture.height * 0.9 / Math.cos(deg2rad(90 - Math.abs(textTiltDegrees)));
    const filledSprites: TilingSprite[] = [];
    const hollowSprites: TilingSprite[] = [];
    // i don't want to figure out how to calculate this magic number on the fly...
    const copies = 11;
    for (let i = 0; i < copies; i++) {
        let texture: Texture;
        let position: PointData;
        let anchor: PointData;
        if (i % 2 === 0) {
            texture = textHollowTexture;
            position = tiltedTextContainer.toLocal({ y: -100, x: tiltedTextWidth * (i - 1) });
            position.x -= 1500;
            anchor = { x: 1, y: 0 };
        } else {
            texture = textFilledTexture;
            position = tiltedTextContainer.toLocal({ y: -100, x: tiltedTextWidth * (i - 1) });
            anchor = { x: 0, y: 0 };
        }
        const tilingSprite = new TilingSprite({
            texture: texture,
            position,
            height: texture.height,
            width: 2500,
            anchor
        });
        (i % 2 === 0 ? hollowSprites : filledSprites).push(tilingSprite);
        tiltedTextContainer.addChild(tilingSprite);
    }

    const maskGradient = new FillGradient({
        type: 'linear',
        colorStops: [
            { offset: 0.5, color: [255, 255, 255, 255] },
            { offset: 0, color: [255, 255, 255, 0] }
        ]
    });
    const maskGraphics = new Graphics()
        .rect(0, 0, app.renderer.width, app.renderer.height)
        .fill(maskGradient);
    app.stage.mask = new Sprite(app.renderer.generateTexture(maskGraphics));

    ctx = gsap.context(() => {
        gsap.to(hollowSprites, {
            repeat: -1,
            delay: 0.5,
            pixi: {
                tilePositionX: textHollowTexture.width
            },
            ease: 'none',
            duration: 25
        });
        gsap.to(filledSprites, {
            repeat: -1,
            delay: 0.5,
            pixi: {
                tilePositionX: -textFilledTexture.width
            },
            ease: 'none',
            duration: 25
        });

        const tl = gsap.timeline();

        tl
            .to(hollowSprites, {
                pixi: {
                    positionX: '+=1500'
                },
                duration: 2,
                ease: 'expo.out'
            }, 'intro')
            .to(filledSprites, {
                pixi: {
                    positionX: '-=1500'
                },
                duration: 2,
                ease: 'expo.out'
            }, 'intro');
    });
});
</script>

<style scoped lang="scss">
.counterpick-alert-background {
    width: 100%;
    height: 30%;
    top: unset;
    bottom: 0;
}
</style>
