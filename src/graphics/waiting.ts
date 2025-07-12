import './styles/graphics-common.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { initTournamentDataStore } from 'browser-shared/stores/TournamentDataStore';
import { initBreakScreenStore } from 'browser-shared/stores/BreakScreenStore';
import WaitingGraphic from './pages/waiting/WaitingGraphic.vue';

(async () => {
    const app = createApp(WaitingGraphic);
    app.use(createPinia());
    await Promise.all([
        initBreakScreenStore(),
        initTournamentDataStore(),
        document.fonts.load('800 128px Barlow'),
        document.fonts.load('700 128px Barlow Condensed'),
        document.fonts.load('500 128px Barlow Condensed'),
        document.fonts.load('500 128px Noto Sans JP'),
        document.fonts.load('400 48px Haverbrooke'),
        document.fonts.load('400 48px Haverbrooke Hollow')
    ]);
    app.mount('#app');
})();
