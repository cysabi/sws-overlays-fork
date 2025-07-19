<template>
    <transition
        mode="out-in"
        :css="false"
        @before-enter="beforeCastersEnter"
        @enter="castersEnter"
        @leave="castersLeave"
    >
        <div
            v-if="castersVisible"
            class="gameplay-casters"
        >
            <div class="title">
                Commentators
            </div>
            <div
                v-for="(caster, id) in casterStore.casters"
                class="caster-details"
                :key="id"
            >
                <fitted-content
                    class="caster-name"
                    align="center"
                >
                    {{ caster.name }}
                </fitted-content>
                <div class="caster-social">
                    <span class="caster-pronouns">{{ caster.pronouns }}</span>
                    <font-awesome-icon
                        :icon="['fab', isBluesky(caster.twitter) ? 'bluesky' : 'twitter']"
                        class="icon"
                    />
                    <fitted-content
                        class="caster-social-tag"
                        align="center"
                    >
                        <formatted-caster-social :social="caster.twitter" />
                    </fitted-content>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { useCasterStore } from 'browser-shared/stores/CasterStore';
import { isBluesky } from '../../helpers/SocialHelper';
import FormattedCasterSocial from 'components/FormattedCasterSocial.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import gsap from 'gsap';
import { ref } from 'vue';
import { DASHBOARD_BUNDLE_NAME } from 'browser-shared/constants';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faBluesky } from '@fortawesome/free-brands-svg-icons/faBluesky';
import FittedContent from 'components/FittedContent.vue';

library.add(faTwitter, faBluesky);

const castersVisible = ref(false);

const casterStore = useCasterStore();

nodecg.listenFor('mainShowCasters', DASHBOARD_BUNDLE_NAME, () => {
    if (!castersVisible.value) {
        castersVisible.value = true;

        setTimeout(() => {
            castersVisible.value = false;
        }, 15000);
    }
});

function castersEnter(elem: HTMLElement, done: gsap.Callback) {
    const tl = gsap.timeline({ onComplete: done });
    tl.to(elem.querySelectorAll('.caster-details, .title'), {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power4.out'
    });
}

function beforeCastersEnter(elem: HTMLElement) {
    gsap.set(elem.querySelectorAll('.caster-details, .title'), { opacity: 0, y: 25 });
}

function castersLeave(elem: HTMLElement, done: gsap.Callback) {
    const tl = gsap.timeline({ onComplete: done });
    tl.to(elem.querySelectorAll('.caster-details, .title'), {
        y: -25,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power4.in'
    });
}
</script>

<style scoped lang="scss">
@use '../../styles/font-mixins';
@use '../../styles/constants';

.gameplay-casters {
    position: absolute;
    bottom: 30px;
    right: 30px;
    width: 300px;
}

.title {
    @include font-mixins.font-barlow-condensed;

    z-index: 2;
    background-color: rgba(12, 12, 12, 0.9);
    color: #fff;
    font-size: 28px;
    width: 100%;
    text-align: center;
    padding: 4px 0;
}

.caster-details {
    box-sizing: border-box;
    background-color: #222;
    width: 100%;
    color: white;
    margin-top: 8px;
}

.caster-name {
    @include font-mixins.font-anton;
    text-transform: uppercase;
    font-size: 45px;
    line-height: 55px;
    background: constants.$accent-gradient;
    padding: 2px 16px 0;
    text-align: center;
}

.caster-social {
    @include font-mixins.font-barlow-condensed;
    font-size: 28px;
    font-weight: 400;
    margin-top: -3px;
    padding: 4px 8px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
        transform: translateY(1px);
        margin-right: 4px;
    }
}

.caster-pronouns {
    @include font-mixins.font-barlow-condensed;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 20px;
    line-height: 20px;
    background-color: #fff;
    display: inline-block;
    transform: translateY(-1px);
    color: #111;
    padding: 0 4px 1px 4px;
    margin-top: 4px;
    margin-right: 8px;
}
</style>
