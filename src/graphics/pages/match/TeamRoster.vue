<template>
    <div
        class="team-roster"
        :class="`team-${props.team.toLowerCase()}`"
        :style="{
            '--accent-color': teamData?.color,
            '--text-color': getContrastingTextColor(teamData?.color, '#ffffff', '#222222')
        }"
    >
        <div class="background" />
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
                        class="max-width player-name"
                    >
                        {{ player.name }}
                    </fitted-content>
                    <div
                        v-if="shouldShowWeaponImage(player)"
                        class="player-weapons"
                    >
                        <image-loader
                            v-for="weaponImage in getWeaponImages(player)"
                            :src="weaponImage"
                        />
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import type { ActiveRoundTeam } from 'schemas';
import ImageLoader from 'components/ImageLoader.vue';
import { useActiveRoundStore } from 'browser-shared/stores/ActiveRoundStore';
import { computed } from 'vue';
import FittedContent from 'components/FittedContent.vue';
import { provideTransitionMapMember, RawTransitions } from '../../helpers/TransitionHelper';
import gsap from 'gsap';
import { weaponInfoMap } from '../../helpers/WeaponInfoMap';
import { getContrastingTextColor } from '../../helpers/ColorHelper';

const activeRoundStore = useActiveRoundStore();

const props = defineProps<{
    team: 'A' | 'B'
}>();

const teamData = computed(() => props.team === 'A'
    ? activeRoundStore.activeRound.teamA
    : activeRoundStore.activeRound.teamB);

const players = computed(() => teamData.value.players.slice(0, 6));

function shouldShowWeaponImage(player: ActiveRoundTeam['players'][number]): boolean {
    return player.weapons != null && (player.weapons as { name: string }[]).length > 0;
}

function getWeaponImages(player: ActiveRoundTeam['players'][number]): string[] {
    const weaponInfoList = (player.weapons as { name: string }[])
        .map(playerWeapon => weaponInfoMap[playerWeapon.name])
        .filter(Boolean);

    const uniqueWeaponTypes = new Set<string>();
    weaponInfoList.forEach(weaponInfo => {
        uniqueWeaponTypes.add(weaponInfo.category);
    });

    if (uniqueWeaponTypes.size === 1) {
        return [weaponInfoList[0].iconUrl];
    } else {
        return Array.from(uniqueWeaponTypes)
            .slice(0, 2)
            .map(category => weaponInfoList.find(weaponInfo => weaponInfo.category === category)!.iconUrl);
    }
}

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
                .to(elem.querySelector(`${teamClass} > .background`), {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'none'
                }, 'enter');
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
            }, 'enter');

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

@property --accent-color {
    syntax: '<color>';
    initial-value: #FFFFFF;
    inherits: true;
}

@property --text-color {
    syntax: '<color>';
    initial-value: #222222;
    inherits: true;
}

.team-roster {
    display: flex;
    flex-direction: row;
    position: relative;
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
    width: 660px;
    height: 150px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    &.compact-players > * {
        flex-basis: 31.5%;
        max-width: 31.5%;
        font-size: 36px;

        .player-name {
            margin: 0 4px 4px;
        }
    }

    > * {
        @include font-mixins.font-barlow-condensed;

        flex-basis: 48%;
        max-width: 48%;
        margin: 4px;
        text-align: center;
        box-sizing: border-box;
        overflow-wrap: anywhere;
        font-size: 36px;
        font-weight: 600;
        display: flex;
        align-items: center;
        position: relative;
        outline: 2px solid rgba(34, 34, 34, 0.1);
        transform-style: preserve-3d;
        perspective: 1000px;
        transform: translate3d(0, 0, 0);
        min-height: 75px;
        max-height: 75px;
        background-color: var(--accent-color);
        color: var(--text-color);
        transition-property: --text-color, --accent-color;
        transition-duration: 500ms;

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

        &:before {
            content: '';
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            position: absolute;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.2) 100%);
            mix-blend-mode: multiply;
        }
    }
}

.player-name {
    margin: 0 8px 4px;
}

.player-weapons {
    height: 100%;
    width: 130px;
    padding: 0 2px;
    background-color: rgba(255, 255, 255, 0.25);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    > * {
        width: 75px;
        height: 75px;
        transform: scale(1.1);
        flex-basis: 50%;
    }

    > *:first-child:nth-last-child(1) {
        flex-basis: 100%;
        transform: unset !important;
    }

    :deep(.image-loader) {
        background-size: contain;
    }
}
</style>
