import './styles/graphics-common.scss';

import { createApp } from 'vue';
import MatchGraphic from './pages/match/MatchGraphic.vue';
import { createPinia } from 'pinia';
import { initActiveRoundStore } from 'browser-shared/stores/ActiveRoundStore';
import { initCasterStore } from 'browser-shared/stores/CasterStore';
import { initAssetPathStore } from 'browser-shared/stores/AssetPathStore';

(async () => {
    const app = createApp(MatchGraphic);
    app.use(createPinia());
    await Promise.all([
        initActiveRoundStore(),
        initCasterStore(),
        initAssetPathStore(),
        document.fonts.load('800 48px Barlow'),
        document.fonts.load('400 48px Haverbrooke'),
        document.fonts.load('400 48px Haverbrooke Hollow')
    ]);
    app.mount('#app');
})();
