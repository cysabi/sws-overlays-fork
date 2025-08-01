<template>
  <div class="content-wrapper layout vertical center-horizontal">
    <caster-grid
      :casters="preshowStore.bundleCasterSets[bundleName]['preshow'] ?? {}"
      :compact="preshowStore.preshowLargeVideoVisible"
      class="caster-grid"
    />
  </div>
  <transition name="large-video">
    <div
      v-show="preshowStore.preshowLargeVideoVisible"
      class="large-video-wrapper"
    >
      <video-loader
        :src="preshowStore.preshowLargeVideoUrl"
        class="large-video"
      />
    </div>
  </transition>
  <div class="preshow-bottom-bar">
    <div class="event-logo">
      <event-logo />
      <div class="subtitle">PRESHOW</div>
    </div>
    <div class="topic-bar">
      <fitted-content align="center">
        <opacity-swap-transition>
          <span :key="preshowStore.preshowTopic">{{
            preshowStore.preshowTopic
          }}</span>
        </opacity-swap-transition>
      </fitted-content>
    </div>
  </div>
  <maze-background />
</template>

<script setup lang="ts">
import MazeBackground from "components/MazeBackground.vue";
import CasterGrid from "components/CasterGrid.vue";
import { usePreshowStore } from "browser-shared/stores/PreshowStore";
import EventLogo from "components/EventLogo.vue";
import FittedContent from "components/FittedContent.vue";
import OpacitySwapTransition from "components/OpacitySwapTransition.vue";
import VideoLoader from "components/VideoLoader.vue";

const preshowStore = usePreshowStore();
const bundleName = nodecg.bundleName;
</script>

<style lang="scss">
body {
  height: 1080px !important;
}

.caster-grid {
  margin: -76px 175px 0 175px;
}

.casters-layout {
  height: 880px;
}
</style>

<style scoped lang="scss">
@use "sass:math";
@use "../../styles/constants";
@use "../../styles/font-mixins";

.preshow-bottom-bar {
  width: 1500px;
  height: 120px;
  position: absolute;
  bottom: 25px;
  left: math.div(1920px - 1500px, 2);
  z-index: 3;
  display: flex;
}

.topic-bar {
  background: #0f011a url("../../assets/logo-dots.png") no-repeat 650px center;
  background-size: 700px;
  width: 100%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64px;
  overflow: hidden;
  padding: 0 32px;
}

.event-logo {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-right: 16px;
  background: constants.$accent-gradient;
  padding: 8px 0 6px 0;
  color: #fff;

  :deep(svg) {
    height: 100%;
    color: white;
  }

  .subtitle {
    @include font-mixins.font-barlow;

    font-weight: 700;
    letter-spacing: 3px;
    text-align: center;
    width: 100%;
    font-size: 24px;
    margin-bottom: -2px;
  }
}

.large-video-wrapper {
  position: absolute;
  right: 185px;
  top: 141px;
  height: 640px;
  aspect-ratio: 16 / 9;
  background-color: rgba(34, 34, 34, 0.25);
  z-index: 3;
  transition-property: opacity, transform;
  transition-duration: 350ms;
}

.large-video-leave-to,
.large-video-enter-from {
  transform: translateX(100px);
  opacity: 0;
}

.large-video-enter-active {
  transition-timing-function: linear, cubic-bezier(0.33, 1, 0.68, 1);
  transition-delay: 350ms;
}

.large-video-leave-active {
  transition-timing-function: linear, cubic-bezier(0.32, 0, 0.67, 0);
}

.large-video {
  width: 100%;
  height: 100%;
}
</style>
