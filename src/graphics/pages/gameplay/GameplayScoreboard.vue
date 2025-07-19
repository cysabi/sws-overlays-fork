<template>
    <transition
        @enter="scoreboardEnter"
        @leave="scoreboardLeave"
        @before-enter="beforeScoreboardEnter"
    >
        <div
            v-if="activeRoundStore.scoreboardData.isVisible"
            class="scoreboard-wrapper"
        >
            <div class="scoreboard-teams">
                <div class="scoreboard-team-layout">
                    <div class="team-display-wrapper">
                        <div
                            class="team-display team-alpha"
                            :style="{
                                backgroundColor: teamA?.color,
                                color: getContrastingTextColor(teamA?.color, '#ffffff', '#111111')
                            }"
                        >
                            <opacity-swap-transition>
                                <fitted-content
                                    :key="teamAName"
                                    class="team-name"
                                    align="right"
                                    :max-width="296"
                                >
                                    <div class="team-name-container">
                                        {{ teamAName }}
                                    </div>
                                </fitted-content>
                            </opacity-swap-transition>
                            <div class="score-color-wrapper">
                                <div class="team-score">
                                    <score-counter :value="teamA?.score" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="separator" />
                    <div class="team-display-wrapper">
                        <div
                            class="team-display team-bravo"
                            :style="{
                                backgroundColor: teamB?.color,
                                color: getContrastingTextColor(teamB?.color, '#ffffff', '#111111')
                            }"
                        >
                            <opacity-swap-transition>
                                <fitted-content
                                    :key="teamBName"
                                    class="team-name"
                                    align="right"
                                    :max-width="296"
                                >
                                    <div class="team-name-container">
                                        {{ teamBName }}
                                    </div>
                                </fitted-content>
                            </opacity-swap-transition>
                            <div class="score-color-wrapper">
                                <div class="team-score">
                                    <score-counter :value="teamB?.score" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="scoreboard-extra">
                <event-logo class="event-logo" />
                <div class="flavor-text-wrapper">
                    <opacity-swap-transition>
                        <fitted-content
                            :key="activeRoundStore.activeRound.match.name"
                            :max-width="290"
                            class="flavor-text"
                            align="center"
                        >
                            {{ activeRoundStore.activeRound.match.name }} - {{ activeRoundStore.formattedMatchType }}
                        </fitted-content>
                    </opacity-swap-transition>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import FittedContent from '../../components/FittedContent.vue';
import { computed } from 'vue';
import OpacitySwapTransition from '../../components/OpacitySwapTransition.vue';
import { addDots } from 'browser-shared/helpers/StringHelper';
import gsap from 'gsap';
import { useActiveRoundStore } from 'browser-shared/stores/ActiveRoundStore';
import { getContrastingTextColor } from '@iplsplatoon/vue-components';
import ScoreCounter from 'components/ScoreCounter.vue';
import EventLogo from 'components/EventLogo.vue';

export default defineComponent({
    name: 'GameplayScoreboard',

    components: { EventLogo, ScoreCounter, OpacitySwapTransition, FittedContent },

    setup() {
        const activeRoundStore = useActiveRoundStore();
        const teamA = computed(() => activeRoundStore.activeRound.teamA);
        const teamB = computed(() => activeRoundStore.activeRound.teamB);

        return {
            teamA,
            teamB,
            teamAName: computed(() => addDots(teamA.value.name)),
            teamBName: computed(() => addDots(teamB.value.name)),
            activeRoundStore,
            scoreboardEnter: (elem: HTMLElement, done: gsap.Callback) => {
                const tl = gsap.timeline({ onComplete: done });
                tl.to(elem.querySelectorAll('.team-display-wrapper, .scoreboard-extra'), {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    stagger: -0.1,
                    ease: 'power4.out'
                });
            },
            beforeScoreboardEnter: (elem: HTMLElement) => {
                gsap.set(elem.querySelectorAll('.team-display-wrapper, .scoreboard-extra'), { opacity: 0, y: -25 });
            },
            scoreboardLeave: (elem: HTMLElement, done: gsap.Callback) => {
                const tl = gsap.timeline({ onComplete: done });
                tl.to(elem.querySelectorAll('.team-display-wrapper, .scoreboard-extra'), {
                    y: 25,
                    opacity: 0,
                    duration: 0.5,
                    stagger: -0.1,
                    ease: 'power4.in'
                });
            },
            getContrastingTextColor
        };
    }
});
</script>

<style lang="scss">
@use 'sass:color';
@use '../../styles/constants';
@use '../../styles/font-mixins';

.scoreboard-wrapper {
    position: absolute;
    top: 30px;
    left: 30px;
    width: 390px;
    height: 170px;

    > .scoreboard-teams {
        position: relative;
        width: 100%;
        height: 128px;
        margin: 0;

        > .scoreboard-team-layout {
            display: grid;
            grid-template-rows: 1fr 2px 1fr;
            height: 100%;
            align-items: center;
            position: relative;
            z-index: 2;
            width: 100%;

            .team-display {
                display: flex;
                align-items: center;
                height: 100%;
                overflow: hidden;
                background-repeat: no-repeat;
                background-size: cover;
                transition: background-color 350ms;
                transform-origin: center left;
                position: relative;
                max-width: 100%;
                width: 100%;

                &:before {
                    content: '';
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    position: absolute;
                    background: linear-gradient(to bottom, rgba(34, 34, 34, 0) 0%, rgba(34, 34, 34, 0.2) 100%);
                    mix-blend-mode: multiply;
                }

                .score-color-wrapper {
                    display: flex;
                    height: 90%;
                    flex-grow: 1;

                    > .team-score {
                        color: #FFF;
                        margin: 3px;
                        background-color: rgba(34, 34, 34, 0.9);
                        font-size: 60px;
                        font-weight: 700;
                        line-height: 57px;
                        min-width: 72px;
                        text-align: center;
                        overflow: hidden;

                        > * {
                            transform: translateY(-2px);
                        }
                    }
                }

                > .team-name {
                    @include font-mixins.font-barlow-condensed;

                    margin: 0 8px;
                    z-index: 999;
                    transform: translateY(-2px);
                    transition: color 350ms;
                    width: 100%;
                    font-size: 40px;
                    font-weight: 600;
                }
            }
        }
    }

    > .scoreboard-extra {
        @include font-mixins.font-barlow-condensed;

        margin-top: 4px;
        height: 42px;
        display: flex;
        align-items: center;
        z-index: 2;
        position: relative;
        background-color: rgba(12, 12, 12, 0.9);
        color: #fff;
        font-size: 24px;
        width: 100%;

        .event-logo {
            height: 100%;
            min-width: 60px;
            padding: 4px 4px;
            background-color: #FFF;
            color: #000;
            grid-row: span 2;
        }

        > .tournament-logo {
            width: 75px;
            margin-left: 4px;
            margin-top: 12px;
        }

        > .flavor-text-wrapper {
            width: 100%;

            > .flavor-text {
                font-size: 28px;
                line-height: 36px;
                margin: 0 auto;
            }
        }
    }
}
</style>
