<template>
    <span class="formatted-social">
        <span>{{ splitSocialTag[0] }}</span>
        <span>{{ splitSocialTag[1] }}</span>
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { splitSignificantSocialTagPart } from '../helpers/SocialHelper';

const props = defineProps<{
    social: string
}>();

const splitSocialTag = computed(() => splitSignificantSocialTagPart(props.social));
</script>

<style scoped lang="scss">
.formatted-social {
    display: inline-block;

    > *:last-child {
        font-size: 0.75em;
    }
}
</style>
