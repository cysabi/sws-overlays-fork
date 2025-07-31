<template>
    <div class="content-wrapper layout center-horizontal">
      <div class="large-container">
      <div class="team-bar">
        <div class="team-display bg-left">
          <img :src="getFlagUrl(a.Country)" class="float-left">
          <div class="text left">{{ displayTeam(a.Team) }}</div>
        </div>
        <div class="event-logo">
          <event-logo />
        </div>
        <div class="team-display bg-right">
          <img :src="getFlagUrl(b.Country)" class="float-right">
          <div class="text right">{{ displayTeam(b.Team) }}</div>
        </div>
      </div>
      <div class="info-container">
        <div class="player-container">
          <div class="player-name-box">
            <div class="accent"></div>
            <br />
            <div class="text">{{ a.Player.toUpperCase() }}</div>
            <div class="subtext">{{ a.Role.toUpperCase() }}</div>
          </div>
          <div class="player-build-row">
            <span class="build-text float-left">BUILD</span>
            <div class="player-rating-box float-right">
              <div class="text">{{ a['X Power'] }}</div>
              <div class="accent bg-left">
                <div class="label">X Power</div>
              </div>
            </div>
          </div>
          <div class="player-loadout-box">
            <img :src="getMainWeapon(a)['Weapon Image']" />
            <div>{{ getMainWeapon(a).Name }}</div>
          </div>
          <div class="player-additional-row">
            <div class="player-special-box with-margin bg-left" >
              <img class="icon" :src="getMainWeapon(a)['Sub Image']"></img>
              <div class="text">{{ getMainWeapon(a)['Sub Name'] }}</div>
            </div>
            <div class="player-special-box bg-left">
              <img class="icon" :src="getMainWeapon(a)['Special Image']"></img>
              <div class="text">{{ getMainWeapon(a)['Special Name'] }}</div>
            </div>
          </div>
        </div>
        <div class="stats-container">
          <div class="stats-box with-bot">
            <div class="label">{{ statsStore.statsSelected[0].toUpperCase() }}</div>
            <div class="accent bg-left"></div>
            <div class="text">{{ getStat(a, 0) }} · {{ getStat(b, 0) }}</div>
          </div>
          <div class="stats-box with-bot">
            <div class="label">{{ statsStore.statsSelected[1].toUpperCase() }}</div>
            <div class="accent bg-left"></div>
            <div class="text">{{ getStat(a, 1) }} · {{ getStat(b, 1) }}</div>
          </div>
          <div class="stats-box">
            <div class="label">{{ statsStore.statsSelected[2].toUpperCase() }}</div>
            <div class="accent bg-left"></div>
            <div class="text">{{ getStat(a, 2) }} · {{ getStat(b, 2) }}</div>
          </div>
        </div>
        <div class="player-container">
          <div class="player-name-box">
            <div class="accent-right"></div>
            <br />
            <div class="text ta-right">{{ b.Player.toUpperCase() }}</div>
            <div class="subtext ta-right">{{ b.Role.toUpperCase() }}</div>
          </div>
          <div class="player-build-row">
            <div class="player-rating-box float-left">
              <div class="text">{{ b['X Power'] }}</div>
              <div class="accent bg-left">
                <div class="label">X POWER</div>
              </div>
            </div>
            <span class="build-text float-right">BUILD</span>
          </div>
          <div class="player-loadout-box">
            <img :src="getMainWeapon(b)['Weapon Image']" />
            <div>{{ getMainWeapon(b).Name }}</div>
          </div>
          <div class="player-additional-row">
            <div class="player-special-box with-margin bg-left" >
              <img class="icon" :src="getMainWeapon(b)['Sub Image']"></img>
              <div class="text">{{ getMainWeapon(b)['Sub Name'] }}</div>
            </div>
            <div class="player-special-box bg-left">
              <img class="icon" :src="getMainWeapon(b)['Special Image']"></img>
              <div class="text">{{ getMainWeapon(b)['Special Name'] }}</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    <maze-background />
</template>

<script setup lang="ts">
import MazeBackground from 'components/MazeBackground.vue';
import CasterGrid from 'components/CasterGrid.vue';
import { useStatsStore } from 'browser-shared/stores/StatsStore';
import EventLogo from 'components/EventLogo.vue';
import FittedContent from 'components/FittedContent.vue';
import OpacitySwapTransition from 'components/OpacitySwapTransition.vue';
import VideoLoader from 'components/VideoLoader.vue';
import { computed } from 'vue';

const statsStore = useStatsStore();
const bundleName = nodecg.bundleName;

const a = computed(() => statsStore.statsData.find(d => d.Player === statsStore.statsPlayerA)!)
const b = computed(() => statsStore.statsData.find(d => d.Player === statsStore.statsPlayerB)!)

function displayTeam(name: string): string {
  if (!name) return 'UNNAMED'
  const up = name.toUpperCase();
  return up.includes('INVINCIBLE FLEET') ? 'INVINCIBLE FLEET' : up;
}

function getStat(player: Record<string, string>, idx: number): string {
  return player[statsStore.statsSelected[idx]]
}

function getMainWeapon(player: Record<string, string>): Record<string, string> {
  return statsStore.statsDatabase.find(
    (row) => row.Name === player.Weapons.split(', ').shift()
  )!
}

function getFlagUrl(flag: string) {
  return {
    'US': 'https://iili.io/F8x2mxe.png',
    'JP': 'https://iili.io/F8x2Db9.png',
    'EU': 'https://iili.io/F8x2yib.png',
    'EU/US': 'https://iili.io/F8x2pWu.png',
  }[flag]
}
</script>

<style lang="scss">
body {
    height: 1080px !important;
}

.caster-grid {
    margin: -32px 175px 0 175px;
}

.casters-layout {
    height: 880px;
}
</style>

<style scoped lang="scss">
@use 'sass:math';
@use '../../styles/constants';
@use '../../styles/font-mixins';

.bg-left {
  background: constants.$accent-gradient-left !important;
}

.bg-right {
  background: constants.$accent-gradient-right !important;
}

.large-container {
    width: 100%;
    margin-left: 90px;
    margin-right: 90px;

    @include font-mixins.font-anton;
    font-weight: normal;
}

.stats-container {
    margin-left: 30px;
    margin-right: 30px;
    width: 420px;
}

.with-bot {
    margin-bottom: 35px;
}

.stats-box {
    width: 100%;
    background: rgb(16, 1, 27);
    height: math.div(705px - 35px - 35px, 3);

    .label {
      text-align: center;
      padding-top: 8px;
      padding-bottom: 8px;
      color: white;
      font-size: 32px;
    }

    .accent {
      margin-left: 30px;
      margin-right: 30px;
      height: 5px;
      background: constants.$accent-gradient;
    }

    .text {
      text-align: center;
      padding-top: 25px;
      color: white;
      font-size: 64px;

      @include font-mixins.font-blinker;
    }
}

.team-bar {
    margin-top: 60px;
    // width: 100%;
    height: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.team-display {
    width: 750px;
    height: 130px;
    background: constants.$accent-gradient;
    padding-top: 10px;
    justify-content: center;

    .text {
        font-size: 76px;
        margin-left: 20px;
        margin-right: 20px;
        color: white;
    }

    .left {
        text-align: left;
    }

    .right {
        text-align: right;
    }

    .float-left {
        float: left;
    }

    .float-right {
        float: right;
    }

    img {
      margin-left: 30px;
      padding-top: 20px;
      margin-right: 30px;
      height: 94px;
    }
}

.info-container {
    margin-top: 36px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.player-container {
    width: 630px;
    flex-wrap: wrap;
}

.player-name-box {
    width: 100%;
    height: 170px;
    background: rgb(16, 1, 27);
    flex-direction: row;
    margin-bottom: 35px;

    .accent-right {
        left: 0;
        height: 100%;
        width: 26px;
        background: constants.$accent-gradient;
        margin-left: 20px;
        float: right;
    }

    .accent {
        left: 0;
        height: 100%;
        width: 26px;
        background: constants.$accent-gradient;
        margin-right: 20px;
        float: left;
    }

    .text {
        width: calc(100% - 26px);
        font-size: 52px;
        color: white;
    }

    .subtext {
        font-size: 32px;
        color: white;
        @include font-mixins.font-blinker;
    }
}

.player-build-row {
    width: 100%;
    height: 160px;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;

    .float-right {
        float: right;
    }

    .float-left {
        float: left;
    }

    .build-text {
        color: black;
        font-size: 60px;
        padding-top: 86px;
    }
}

.player-rating-box {
    width: 400px;
    height: 160px;
    background: rgb(16, 1, 27);
    flex-direction: row;

    .accent {
        width: 100%;
        height: 46px;
        background: constants.$accent-gradient;
        float: left;
    }

    .text {
        text-align: center;
        height: calc(160px - 46px);
        font-size: 80px;
        color: white;
    }

    .label {
        font-size: 30px;
        color: white;
        text-align: center;
    }
}

.player-loadout-box {
    width: 100%;
    height: 200px;
    background: rgb(16, 1, 27);
    margin-bottom: 30px;
    color: white;
    font-size: 32px;

    div {
        margin-left: 20px;
    }

    img {
        padding-top: 20px;
        padding-bottom: 5px;
        margin-left: 20px;
        width: 110px;
    }
}

.player-additional-row {
    width: 100%;
}

.ta-right {
    text-align: right;
}

.with-margin {
    margin-right: 30px;
}

.player-special-box {
    width: 300px;
    background: constants.$accent-gradient;
    height: 80px;
    float: left;

    .icon {
      height: 48px;
      margin-left: 30px;
      margin-top: 16px;
      margin-bottom: 16px;
      float: left;
    }

    .text {
        float: left;
        width: calc(300px - 48px - 30px);
        padding-top: 16px;
        color: white;
        font-size: 32px;
        text-align: center;
        vertical-align: middle;
    }
}

.event-logo {
    display: flex;
    flex-direction: column;
    // height: 100%;
    margin-right: 40px;
    margin-left: 40px;
    padding: 8px 0 6px 0;
    width: 160px;
    color: #fff;

    :deep(svg) {
        height: 100%;
        color: black;
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
</style>
