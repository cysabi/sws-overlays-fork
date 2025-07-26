<template>
    <div class="image-loader-wrapper">
        <div
            :style="{
                backgroundImage: `url('${imageExists ? src : defaultSrc}')`,
                opacity: imageVisible ? '1' : '0'
            }"
            class="image-loader"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { computed, PropType, ref, watch } from 'vue';
import OpacitySwapTransition from './OpacitySwapTransition.vue';
import { isBlank } from 'browser-shared/helpers/StringHelper';
import { loadAndCheckIfImageExists } from '../helpers/ImageHelper';

export default defineComponent({
    name: 'ImageLoader',

    components: { OpacitySwapTransition },

    props: {
        src: {
            type: [String, null] as PropType<string | null>,
            default: null
        },
        defaultSrc: {
            type: [String, null] as PropType<string | null>,
            default: null
        }
    },

    setup(props) {
        const imageLoading = ref(true);
        const imageExists = ref(false);

        watch(() => props.src, async (newValue) => {
            imageLoading.value = true;
            try {
                // really stupid but kind of ingenious way to enforce a minimum load time for all images
                // if not implemented, images may load too quickly and make the transition look poor
                imageExists.value = (await Promise.all([
                    loadAndCheckIfImageExists(newValue),
                    new Promise(resolve => setTimeout(resolve, 100))
                ]))[0];
            } catch (e) {
                console.error(e);
                imageExists.value = false;
            } finally {
                imageLoading.value = false;
            }
        }, { immediate: true });

        return {
            imageExists,
            imageVisible: computed(() => (imageExists.value || !isBlank(props.defaultSrc)) && !imageLoading.value)
        };
    }
});
</script>

<style lang="scss">
.image-loader {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    height: 100%;
    width: 100%;
    position: relative;
    transition: opacity 350ms linear;
}
</style>
