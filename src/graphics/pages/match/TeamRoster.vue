<template>
    <div
        class="team-roster"
        :class="`team-${props.team.toLowerCase()}`"
    >
        <div class="background" />
        <image-loader
            :src="teamData.logoUrl"
            class="team-logo"
        />
        <transition
            mode="out-in"
            :css="false"
            @before-enter="transitions.beforeEnter"
            @enter="transitions.enter"
            @leave="transitions.leave"
        >
            <div
                class="players"
                :key="teamData.id"
                :class="{ 'compact-players': players.length > 4 }"
            >
                <div
                    v-for="player in players"
                    :key="`player_${teamData.id}_${player.name}`"
                    class="player"
                >
                    <fitted-content
                        align="center"
                        class="max-width"
                    >
                        {{ player.name }}
                    </fitted-content>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import ImageLoader from 'components/ImageLoader.vue';
import { useActiveRoundStore } from 'browser-shared/stores/ActiveRoundStore';
import { computed } from 'vue';
import FittedContent from 'components/FittedContent.vue';
import { provideTransitionMapMember, RawTransitions } from '../../helpers/TransitionHelper';
import gsap from 'gsap';

const activeRoundStore = useActiveRoundStore();

const props = defineProps<{
    team: 'A' | 'B'
}>();

const teamData = computed(() => props.team === 'A'
    ? activeRoundStore.activeRound.teamA
    : activeRoundStore.activeRound.teamB);

const players = computed(() => teamData.value.players.slice(0, 6));

const transitions: RawTransitions = {
    beforeEnter: (elem) => {
        const isTeamChange = elem.classList.contains('players');
        const teamClass = `.team-${props.team.toLowerCase()}`;
        gsap.set(elem.querySelectorAll(isTeamChange ? '.player' : `${teamClass} .player`), { rotateX: -90, y: '-50%' });
        if (!isTeamChange) {
            gsap.set(elem.querySelectorAll(`${teamClass} > .team-logo`), { y: 250 });
            gsap.set(elem.querySelector(`${teamClass} > .background`), { opacity: 0 });
        }
    },
    enter: (elem, done) => {
        const tl = gsap.timeline({ onComplete: done });
        const isTeamChange = elem.classList.contains('players');
        const teamClass = `.team-${props.team.toLowerCase()}`;

        if (!isTeamChange) {
            tl
                .to(elem.querySelectorAll(`${teamClass} > .team-logo`), {
                    y: 0,
                    duration: 0.75,
                    ease: 'power4.out',
                    delay: props.team === 'B' ? 0.1 : 0
                }, 'enter')
                .to(elem.querySelector(`${teamClass} > .background`), {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'none'
                }, 'enter+=0.5');
        }
        tl
            .to(elem.querySelectorAll(isTeamChange ? '.player' : `${teamClass} .player`), {
                rotateX: 0,
                y: 0,
                duration: 0.5,
                ease: 'power2.out',
                stagger: {
                    amount: 0.5,
                    from: 'random'
                }
            }, 'enter+=0.5');

        return tl;
    },
    leave: (elem, done) => {
        const tl = gsap.timeline({ onComplete: done });
        const isTeamChange = elem.classList.contains('players');
        const teamClass = `.team-${props.team.toLowerCase()}`;

        tl
            .to(elem.querySelectorAll(isTeamChange ? '.player' : `${teamClass} .player`), {
                rotateX: 90,
                y: '50%',
                duration: 0.5,
                ease: 'power2.in',
                stagger: {
                    amount: 0.5,
                    from: 'random'
                }
            }, 'leave');
        if (!isTeamChange) {
            tl
                .to(elem.querySelectorAll(`${teamClass} > .team-logo`), {
                    y: 250,
                    duration: 0.75,
                    ease: 'power4.in',
                    delay: props.team === 'A' ? 0.1 : 0
                }, 'leave+=0.5')
                .to(elem.querySelector(`${teamClass} > .background`), {
                    opacity: 0,
                    duration: 0.5,
                    ease: 'none'
                }, 'leave+=0.5');
        }

        return tl;
    }
};

provideTransitionMapMember(transitions, `Team${props.team}Roster`);
</script>

<style scoped lang="scss">
@use '../../styles/font-mixins';

.team-roster {
    display: flex;
    flex-direction: row;
    position: relative;

    &.team-a {
        flex-direction: row-reverse;

        .players > * {
            background: linear-gradient(to bottom, #fff300 0%, #E8D912 100%);
            color: #222;
        }

        .background {
            background: linear-gradient(to bottom, rgba(255, 243, 0, 0) 0%, rgba(232, 217, 18, 0.2) 50%);
        }
    }

    &.team-b {
        .players > * {
            background: linear-gradient(to bottom, #A032DB 0%, #BA69E5 100%);
            color: white;
        }

        .background {
            background: linear-gradient(to bottom, rgba(160, 50, 219, 0) 0%, rgba(186, 105, 229, 0.2) 50%);
        }
    }
}

.background {
    position: absolute;
    width: calc(100% + 32px);
    height: 240px;
    top: -45px;
    left: -16px;
}

.team-logo {
    width: 150px;
    height: 150px;
    border-radius: 999px;
    background-color: rgba(34, 34, 34, 0.5);
    margin: 0 15px;
    overflow: hidden;
}

.players {
    width: 480px;
    height: 136px;
    margin-top: 7px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    //filter: drop-shadow(0 0 2px rgba(34, 34, 34, 0.25));

    &.compact-players > * {
        flex-basis: 31.5%;
        max-width: 31.5%;
        font-size: 36px;
    }

    > * {
        @include font-mixins.font-barlow-condensed;

        flex-basis: 48%;
        max-width: 48%;
        margin: 4px;
        text-align: center;
        padding: 0 12px 4px;
        box-sizing: border-box;
        overflow-wrap: anywhere;
        font-size: 40px;
        font-weight: 600;
        display: flex;
        align-items: center;
        position: relative;
        outline: 2px solid rgba(34, 34, 34, 0.1);
        transform-style: preserve-3d;
        perspective: 1000px;
        transform: translate3d(0, 0, 0);
        min-height: 60px;

        &:after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            box-sizing: border-box;
            border: 3px solid rgba(34, 34, 34, 0.25);
            mix-blend-mode: soft-light;
        }
    }
}
</style>
