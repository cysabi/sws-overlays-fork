<template>
    <div class="intermission-scoreboard">
        <div class="match-details">
            {{ activeRoundStore.activeRound.match.name }} - {{ activeRoundStore.formattedMatchType }}
        </div>
        <div class="teams">
            <div class="team team-alpha">
                <fitted-content class="team-name" align="right">
                    {{ activeRoundStore.activeRound.teamA.name }}
                </fitted-content>
                <div class="team-score">{{ activeRoundStore.activeRound.teamA.score }}</div>
            </div>
            <div class="team team-bravo">
                <div class="team-score">{{ activeRoundStore.activeRound.teamB.score }}</div>
                <fitted-content class="team-name">
                    {{ activeRoundStore.activeRound.teamB.name }}
                </fitted-content>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import FittedContent from 'components/FittedContent.vue';
import { useActiveRoundStore } from 'browser-shared/stores/ActiveRoundStore';

const activeRoundStore = useActiveRoundStore();
</script>

<style scoped lang="scss">
@use '../../styles/font-mixins';

.intermission-scoreboard {
    display: grid;
    grid-template-rows: auto 50px;
    gap: 23px;
    justify-items: center;
}

.match-details {
    @include font-mixins.font-barlow-condensed;
    background-color: #2F2F2F;
    color: white;
    padding: 0 16px 2px 16px;
    font-size: 25px;
}

.teams {
    filter: drop-shadow(0 0 1px rgba(34, 34, 34, 0.25));
    height: 50px;
    width: 800px;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    justify-items: center;
    gap: 45px;

    .team {
        display: flex;
        align-items: center;
        background-color: #F2F2F2;
        height: 100%;
        width: 100%;
        overflow: hidden;

        &.team-alpha {
            background: linear-gradient(to bottom, #fff300 0%, #E8D912 100%);
            color: #222;
        }

        &.team-bravo {
            background: linear-gradient(to bottom, #A032DB 0%, #BA69E5 100%);
            color: white;
        }
    }

    .team-score {
        background-color: #2F2F2F;
        font-size: 48px;
        font-weight: 700;
        height: 100%;
        color: white;
        line-height: 100%;
        min-width: 55px;
        width: 55px;
        text-align: center;
    }

    .team-name {
        @include font-mixins.font-barlow-condensed;
        font-weight: 600;
        font-size: 30px;
        flex-grow: 1;
        max-width: 100%;
        margin: 0 16px;

        &.team-alpha {
            justify-self: end;
        }

        &.team-bravo {
            justify-self: start;
            color: #fff;
        }
    }
}
</style>
