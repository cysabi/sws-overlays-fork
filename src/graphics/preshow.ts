import './styles/graphics-common.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { initPreshowStore } from 'browser-shared/stores/PreshowStore';
import PreshowGraphic from './pages/preshow/PreshowGraphic.vue';
import gsap from 'gsap';
import Flip from 'gsap/Flip';

gsap.registerPlugin(Flip);

(async () => {
    const app = createApp(PreshowGraphic);
    app.use(createPinia());
    await Promise.all([
        initPreshowStore(),
        document.fonts.load('800 128px Barlow'),
        document.fonts.load('700 128px Barlow Condensed'),
        document.fonts.load('500 128px Barlow Condensed'),
        document.fonts.load('500 128px Noto Sans JP'),
        document.fonts.load('400 48px Haverbrooke'),
        document.fonts.load('400 48px Haverbrooke Hollow')
    ]);
    app.mount('#app');
})();
