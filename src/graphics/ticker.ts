import './styles/graphics-common.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { initActiveRoundStore } from 'browser-shared/stores/ActiveRoundStore';
import { initTournamentDataStore } from 'browser-shared/stores/TournamentDataStore';
import TickerGraphic from './pages/ticker/TickerGraphic.vue';
import { initBreakScreenStore } from 'browser-shared/stores/BreakScreenStore';

(async () => {
    const app = createApp(TickerGraphic);
    app.use(createPinia());
    await Promise.all([
        initActiveRoundStore(),
        initTournamentDataStore(),
        initBreakScreenStore(),
        document.fonts.load('800 128px Barlow'),
        document.fonts.load('700 128px Barlow Condensed'),
        document.fonts.load('500 128px Barlow Condensed'),
        document.fonts.load('500 128px Noto Sans JP'),
        document.fonts.load('400 48px Haverbrooke'),
        document.fonts.load('400 48px Haverbrooke Hollow')
    ]);
    app.mount('#app');
})();
