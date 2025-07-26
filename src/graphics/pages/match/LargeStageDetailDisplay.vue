<template>
    <div class="large-stage-detail-display">
        <image-loader
            class="stage-image"
            :src="assetPathStore.getStageImagePath(props.game.stage)"
        />
        <div class="stage-details">
            <div
                class="title"
                :class="{ 'color-neutral': props.color === 'neutral' }"
                :style="{ color: props.color === 'neutral' ? undefined : darkenColorIfNeeded(activeRoundStore.getTeamColor(props.color)) }"
            >
                {{ props.title }}
            </div>
            <fitted-content class="stage-name-wrapper">
                <div class="stage-name">{{ localeInfoStore.localeInfo.stages[props.game.stage] }}</div>
            </fitted-content>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ActiveRound } from 'schemas';
import { useAssetPathStore } from 'browser-shared/stores/AssetPathStore';
import { AccentColor } from '../../types/AccentColor';
import ImageLoader from 'components/ImageLoader.vue';
import FittedContent from 'components/FittedContent.vue';
import { useLocaleInfoStore } from 'browser-shared/stores/LocaleInfoStore';
import { useActiveRoundStore } from 'browser-shared/stores/ActiveRoundStore';
import { darkenColorIfNeeded } from '../../helpers/ColorHelper';

const activeRoundStore = useActiveRoundStore();
const assetPathStore = useAssetPathStore();
const localeInfoStore = useLocaleInfoStore();

const props = defineProps<{
    game: ActiveRound['games'][number],
    title: string
    color: AccentColor
}>();
</script>

<style scoped lang="scss">
.large-stage-detail-display {
    background: linear-gradient(to bottom, #F0F0F0 0%, #E3E3E3 100%);
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 24px;

    .stage-details {
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: #333333;
        overflow: hidden;
    }

    .stage-image {
        aspect-ratio: 16 / 9;
        height: 100%;
        background-size: cover;
        background-repeat: no-repeat;
    }

    .title {
        font-family: 'Barlow Condensed';
        font-weight: 400;
        font-size: 28px;
        line-height: 35px;
        margin-top: 2px;
    }

    .stage-name-wrapper {
        font-weight: 700;
        font-size: 55px;
        margin-top: -10px;
        margin-right: 24px;
    }
}
</style>
