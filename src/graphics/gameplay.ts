import './styles/graphics-common.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { initActiveRoundStore } from 'browser-shared/stores/ActiveRoundStore';
import { initCasterStore } from 'browser-shared/stores/CasterStore';
import GameplayGraphic from './pages/gameplay/GameplayGraphic.vue';
import { initLocaleInfoStore } from 'browser-shared/stores/LocaleInfoStore';

(async () => {
    const app = createApp(GameplayGraphic);
    app.use(createPinia());
    await Promise.all([
        initActiveRoundStore(),
        initCasterStore(),
        initLocaleInfoStore(),
        document.fonts.load('800 128px Barlow'),
        document.fonts.load('700 128px Barlow Condensed'),
        document.fonts.load('500 128px Barlow Condensed'),
        document.fonts.load('500 128px Noto Sans JP')
    ]);
    app.mount('#app');
})();
