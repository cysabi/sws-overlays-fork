<template>
    <div class="content-wrapper layout center-horizontal">
      <div class="large-container">
      <div class="team-bar">
        <div class="team-display bg-left">
          <img :src="a.Flag" class="float-left">
          <div class="text left">{{ displayTeam(a) }}</div>
        </div>
        <div class="event-logo">
          <event-logo />
        </div>
        <div class="team-display bg-right">
          <img :src="b.Flag" class="float-right">
          <div class="text right">{{ displayTeam(b) }}</div>
        </div>
      </div>
      <div class="info-container">
        <div class="player-container">
          <div class="player-name-box bg-left-ov">
            <div class="accent"></div>
            <br />
            <div class="text">{{ displayName(a) }}</div>
            <div class="subtext">{{ a.Role }}</div>
          </div>
          <div class="player-build-row">
            <span class="build-text float-left">BUILD</span>
            <div class="player-rating-box float-right">
              <div class="text">{{ a.XP }}</div>
              <div class="accent bg-left">
                <div class="label">
                  X POWER
                  <img :src="a.Region" />
                </div>
              </div>
            </div>
          </div>
          <div class="player-loadout-box">
            <div class="container" style="float: left;">
              <img :src="getMainWeapon(a)['Weapon Image']" />
              <div class="text">{{ getMainWeapon(a).Name }}</div>
            </div>
            <img class="build-image" :src="a['Build Link']">
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
          <div class="player-name-box bg-right-ov">
            <div class="accent-right"></div>
            <br />
            <div class="text ta-right">{{ displayName(b) }}</div>
            <div class="subtext ta-right">{{ b.Role }}</div>
          </div>
          <div class="player-build-row">
            <div class="player-rating-box float-left">
              <div class="text">{{ b.XP }}</div>
              <div class="accent bg-left">
                <div class="label">
                  X POWER
                  <img :src="b.Region" />
                </div>
              </div>
            </div>
            <span class="build-text float-right">BUILD</span>
          </div>
          <div class="player-loadout-box">
            <div class="container" style="float: left;">
              <img :src="getMainWeapon(b)['Weapon Image']" />
              <div class="text">{{ getMainWeapon(b).Name }}</div>
            </div>
            <img class="build-image" :src="b['Build Link']">
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
import { useTournamentDataStore } from 'browser-shared/stores/TournamentDataStore';
import EventLogo from 'components/EventLogo.vue';
import FittedContent from 'components/FittedContent.vue';
import OpacitySwapTransition from 'components/OpacitySwapTransition.vue';
import VideoLoader from 'components/VideoLoader.vue';
import { computed } from 'vue';

const statsStore = useStatsStore();
const dataStore = useTournamentDataStore();
const bundleName = nodecg.bundleName;

const a = computed(() => statsStore.statsData.find(d => d.Player === statsStore.statsPlayerA)!)
const b = computed(() => statsStore.statsData.find(d => d.Player === statsStore.statsPlayerB)!)

function displayTeam(team: Record<string, string>): string {
  const id = team['Team ID']
  const name = dataStore.tournamentData.teams.find((team: any) => team.id === id)?.name ?? team.Team

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

function displayName(player: Record<stirng, string>): string {
  if (player['Alt Name'] && player['Alt Name'] !== '')
    return player['Alt Name'].toUpperCase()

  if (statsStore.statsJP && player.JP && player.JP !== '')
    return player.JP.toUpperCase()

  return player.Player.toUpperCase()
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

.bg-left-ov {
      background: rgb(16, 1, 27) url('../../assets/pattern-halftone-top_2_1.png');
      background-position: 100% 100%;
      background-repeat: no-repeat;
    }

.bg-right-ov {
      background: rgb(16, 1, 27) url('../../assets/pattern-halftone-top_2_2.png');
      background-position: 0% 100%;
      background-repeat: no-repeat;
}

.player-name-box {
    width: 100%;
    height: 170px;
    // background: rgb(16, 1, 27);
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
        margin-top: -10px;
        width: calc(100% - 26px);
        font-size: 70px;
        height: 90px;
        color: white;
    }

    .subtext {
        font-size: 32px;
        color: white;
        font-family: 'Blinker';
        height: 60px;
        // @include font-mixins.font-blinker;
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

    img {
        margin-left: 10px;
        height: 64px;
        position: relative;
        top: 19px;
    }

    .text {
        text-align: center;
        height: calc(160px - 46px);
        font-size: 80px;
        color: white;
    }

    .label {
        position: relative;
        top: -28px;
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
    font-size: 24px;
    @include font-mixins.font-blinker;

    .container {
        width: 190px;
        margin-left: 20px;
        vertical-align: middle;
        text-align: center;
    }

    .text {
        height: 40px;
        line-height: 20px;
        vertical-align: middle;
        text-align: center;
        align-content: center;
    }

    img {
        padding-top: 15px;
        // margin-left: 20px;
        width: 120px;
    }

    .build-image {
        float: right;
        position: relative;
        z-index: 2;
        margin-right: 20px;
        // height: calc(100% - 16px - 16px);
        width: 400px;
        padding-top: 36px;
        // padding-bottom: 16px;
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
      height: 64px;
      margin-left: 10px;
      margin-top: 8px;
      margin-bottom: 8px;
      float: left;
    }

    .text {
        float: left;
        width: calc(300px - 48px - 30px);
        padding-top: 20px;
        color: white;
        font-size: 32px;
        text-align: center;
        vertical-align: middle;

        @include font-mixins.font-blinker;
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
