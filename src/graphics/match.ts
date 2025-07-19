import './styles/graphics-common.scss';

import { createApp } from 'vue';
import MatchGraphic from './pages/match/MatchGraphic.vue';
import { createPinia } from 'pinia';
import { initActiveRoundStore } from 'browser-shared/stores/ActiveRoundStore';
import { initCasterStore } from 'browser-shared/stores/CasterStore';
import { initAssetPathStore } from 'browser-shared/stores/AssetPathStore';
import Haverbrooke from './assets/fonts/Haverbrooke.otf';
import HaverbrookeHollow from './assets/fonts/Haverbrooke Hollow.otf';
import gsap from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';
import * as PIXI from 'pixi.js';
import { initBreakScreenStore } from 'browser-shared/stores/BreakScreenStore';

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

(async () => {
    const app = createApp(MatchGraphic);
    app.use(createPinia());
    await Promise.all([
        initActiveRoundStore(),
        initCasterStore(),
        initAssetPathStore(),
        initBreakScreenStore(),
        document.fonts.load('800 128px Barlow'),
        document.fonts.load('700 128px Barlow Condensed'),
        document.fonts.load('500 128px Barlow Condensed'),
        document.fonts.load('500 128px Noto Sans JP'),
        document.fonts.load('400 48px Haverbrooke'),
        document.fonts.load('400 48px Haverbrooke Hollow'),
        PIXI.Assets.load({
            src: Haverbrooke,
            data: {
                family: 'Haverbrooke'
            }
        }),
        PIXI.Assets.load({
            src: HaverbrookeHollow,
            data: {
                family: 'Haverbrooke Hollow'
            }
        })
    ]);
    app.mount('#app');
})();
