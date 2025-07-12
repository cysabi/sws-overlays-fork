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
                    {{ caster.name }}
                </div>
                <div class="caster-social">
                    <span class="caster-pronouns">{{ caster.pronouns }}</span>
                    <font-awesome-icon
                        :icon="['fab', isBluesky(caster.twitter) ? 'bluesky' : 'twitter']"
                        class="icon"
                    />
                    <formatted-caster-social :social="caster.twitter" />
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
import { isBluesky } from '../../helpers/SocialHelper';
import FormattedCasterSocial from 'components/FormattedCasterSocial.vue';

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
@use '../../styles/constants';

.caster-display-wrapper {
    padding: 24px;
    box-sizing: border-box;
}

.caster-display {
    position: relative;
}

.caster-details {
    box-sizing: border-box;
    position: absolute;
    bottom: -15px;
    right: -10px;
    overflow: hidden;
    background-color: #222;
    width: max-content;
    color: white;
    min-width: 300px;
}

.caster-name {
    @include font-mixins.font-anton;
    text-transform: uppercase;
    font-size: 45px;
    line-height: 55px;
    background: constants.$accent-gradient;
    padding: 2px 16px 0;
    text-align: center;
}

.caster-social {
    @include font-mixins.font-barlow-condensed;
    font-size: 25px;
    font-weight: 400;
    margin-top: -3px;
    padding: 4px 16px 4px 16px;
    text-align: center;

    .icon {
        transform: translateY(1px);
        margin-right: 4px;
    }
}

.caster-pronouns {
    @include font-mixins.font-barlow-condensed;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 20px;
    line-height: 20px;
    background-color: #fff;
    display: inline-block;
    transform: translateY(-1px);
    color: #111;
    padding: 0 4px 1px 4px;
    margin-top: 4px;
    margin-right: 8px;
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
