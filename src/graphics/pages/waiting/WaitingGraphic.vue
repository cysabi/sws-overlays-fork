<template>
    <div class="waiting-graphic-wrapper">
        <event-logo />
        <div class="edition">
            {{ tournamentDataStore.edition }}
        </div>
        <div
            class="resizable-content-wrapper"
            ref="resizableContentWrapper"
        >
            <transition
                css
                mode="out-in"
                name="resizable-content"
                @before-enter="beforeResizableContentEnter"
                @enter="resizableContentEnter"
                @leave="resizableContentLeave"
            >
                <div
                    v-if="!breakScreenStore.nextRoundStartTime.isVisible"
                    class="flavor-text"
                    :key="breakScreenStore.mainFlavorText"
                    :style="flavorTextAttributes"
                >
                    {{ breakScreenStore.mainFlavorText }}
                </div>
                <next-round-timer v-else />
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import EventLogo from 'components/EventLogo.vue';
import { useBreakScreenStore } from 'browser-shared/stores/BreakScreenStore';
import { useTournamentDataStore } from 'browser-shared/stores/TournamentDataStore';
import { computed, onMounted, useTemplateRef } from 'vue';
import gsap from 'gsap';
import NextRoundTimer from 'components/NextRoundTimer.vue';

const breakScreenStore = useBreakScreenStore();
const tournamentDataStore = useTournamentDataStore();

const flavorTextAttributes = computed(() => breakScreenStore.mainFlavorText.length > 32
    ? { fontSize: '56px', lineHeight: '60px' }
    : { fontSize: '86px', lineHeight: '90px' });

const resizableContentWrapper = useTemplateRef('resizableContentWrapper');

onMounted(() => {
    gsap.set(resizableContentWrapper.value, { height: resizableContentWrapper.value!.firstElementChild?.getBoundingClientRect().height });
});

function beforeResizableContentEnter(elem: HTMLElement) {
    gsap.set(elem, { opacity: 0 });
}

function resizableContentEnter(elem: HTMLElement) {
    gsap.set(resizableContentWrapper.value, { height: elem.getBoundingClientRect().height });
    gsap.set(elem, { opacity: 1 });
}

function resizableContentLeave(elem: HTMLElement) {
    gsap.set(elem, { opacity: 0 });
}
</script>

<style lang="scss">
body {
    color: white;
    height: 1080px !important;
}
</style>

<style scoped lang="scss">
@use '../../styles/font-mixins';

.waiting-graphic-wrapper {
    width: 800px;
    height: calc(100% - 100px);
    margin-top: 50px;
    margin-left: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    > .edition {
        @include font-mixins.font-barlow;
        background-color: #fff;
        font-weight: 900;
        color: #000;
        padding: 0 16px 4px;
        font-size: 56px;
        line-height: 60px;
        margin-top: 32px;
        white-space: nowrap;
        text-transform: uppercase;
    }

    .flavor-text {
        font-size: 72px;
        font-weight: 600;
        text-align: center;
        line-height: 80px;
        overflow-wrap: anywhere;
    }

    .timer {
        font-size: 140px;
    }

    .resizable-content-wrapper {
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        transition: height 500ms cubic-bezier(0.65, 0, 0.35, 1);
        margin-top: 64px;

        > * {
            transition: opacity 350ms linear;

            &.resizable-content-enter-active {
                transition-delay: 550ms;
            }
        }
    }
}

svg {
    margin: 0 100px;
}
</style>
