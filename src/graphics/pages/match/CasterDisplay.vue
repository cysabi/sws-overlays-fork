<template>
    <div
        class="caster-display-wrapper layout vertical center-horizontal"
        :class="`caster-count-${casterCount}`"
    >
        <div
            class="caster-display"
            :style="{ width: `${width}px` }"
        >
            <div
                class="caster-visual layout horizontal center-horizontal center-vertical"
                :style="{ height: `${visualHeight}px` }"
            >
                <image-loader
                    v-if="isBlank(caster.videoUrl)"
                    class="caster-image"
                    :src="caster.imageUrl"
                    default-src="/bundles/sj-overlays/assets/caster-image-placeholder.webp"
                />
                <video-loader
                    v-else
                    :src="caster.videoUrl"
                    class="caster-video"
                />
            </div>
            <div class="caster-details">
                <div class="caster-name">
                    {{ caster.name }} <span class="caster-pronouns">{{ caster.pronouns }}</span>
                </div>
                <div class="caster-social">
                    <font-awesome-icon
                        :icon="['fab', caster.twitter.includes('.') ? 'bluesky' : 'twitter']"
                    />
                    {{ caster.twitter }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Caster } from 'schemas';
import { computed } from 'vue';
import ImageLoader from 'components/ImageLoader.vue';
import VideoLoader from 'components/VideoLoader.vue';
import { isBlank } from 'browser-shared/helpers/StringHelper';
import { useCasterStore } from 'browser-shared/stores/CasterStore';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faBluesky } from '@fortawesome/free-brands-svg-icons/faBluesky';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faTwitter, faBluesky);

const casterStore = useCasterStore();
const casterCount = computed(() => Object.keys(casterStore.casters).length);

const props = defineProps<{
    caster: Caster
    width: number
}>();

const visualHeight = computed(() => props.width * (9 / 16));
</script>

<style scoped lang="scss">
@use '../../styles/font-mixins';

.caster-display-wrapper {
    padding: 24px;
    box-sizing: border-box;
}

.caster-display {
    position: relative;
}

.caster-details {
    padding: 0 16px 10px 16px;
    box-sizing: border-box;
    position: absolute;
    bottom: -15px;
    left: -10px;
    overflow: hidden;
    background-color: #222;
    width: max-content;
    color: white;

    > .background {
        position: absolute;
        z-index: -1;
        width: 100%;
        height: 100%;
        //background: radial-gradient(ellipse 100% 120% at 25px 25px, color.change(constants.$background, $alpha: 0.8) 50%, transparent 100%);
    }
}

.caster-name {
    font-weight: 700;
    font-size: 45px;
}

.caster-social {
    @include font-mixins.font-barlow-condensed;
    font-size: 30px;
    font-weight: 400;
    margin-top: -3px;
}

.caster-pronouns {
    @include font-mixins.font-barlow-condensed;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 20px;
    background-color: #0073E6;
    color: white;
    padding: 0 6px 1px 6px;
    display: inline-block;
    transform: translateY(-3px);
    margin-left: 2px;
}

.caster-visual {
    //@include background.background(0px);
    background-color: #E0E0E0;

    overflow: hidden;
    width: 100%;

    .caster-image {
        width: 250px;
        height: 250px;
        border-radius: 9999px;
        overflow: hidden;
        //filter: drop-shadow(0 0 5px constants.$blue);
    }

    .caster-video {
        width: 100%;
        height: 100%;
    }
}
</style>
