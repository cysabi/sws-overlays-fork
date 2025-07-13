import './styles/graphics-common.scss';
import '@tourneyview/renderer/css/base.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import BracketGraphic from './pages/bracket/BracketGraphic.vue';
import { initBracketStore } from 'browser-shared/stores/BracketStore';

(async () => {
    const app = createApp(BracketGraphic);
    app.use(createPinia());
    await Promise.all([
        initBracketStore(),
        document.fonts.load('800 128px Barlow'),
        document.fonts.load('700 128px Barlow Condensed'),
        document.fonts.load('500 128px Barlow Condensed'),
        document.fonts.load('500 128px Noto Sans JP'),
        document.fonts.load('400 48px Haverbrooke'),
        document.fonts.load('400 48px Haverbrooke Hollow')
    ]);
    app.mount('#app');
})();
