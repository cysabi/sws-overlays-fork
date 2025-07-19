<template>
    <div class="team-rosters">
        <team-roster
            team="A"
        />
        <team-roster
            team="B"
        />
    </div>
</template>

<script setup lang="ts">
import TeamRoster from './TeamRoster.vue';
import { createTransitionMap, provideTransitionMapMember } from '../../helpers/TransitionHelper';
import gsap from 'gsap';

const transitions = createTransitionMap();

provideTransitionMapMember({
    beforeEnter: (elem) => {
        transitions.TeamARoster.beforeEnter(elem);
        transitions.TeamBRoster.beforeEnter(elem);
    },
    enter: (elem, done) => {
        const tl = gsap.timeline({ onComplete: done });

        tl
            .add(transitions.TeamARoster.enter(elem), 'anim')
            .add(transitions.TeamBRoster.enter(elem), 'anim');

        return tl;
    },
    leave: (elem, done) => {
        const tl = gsap.timeline({ onComplete: done });

        tl
            .add(transitions.TeamARoster.leave(elem), 'anim')
            .add(transitions.TeamBRoster.leave(elem), 'anim');

        return tl;
    }
}, 'UnderCameraGraphic');
</script>

<style scoped lang="scss">
.team-rosters {
    display: flex;
    flex-direction: row;

    > *:first-child {
        margin-right: 32px;
    }
}
</style>
