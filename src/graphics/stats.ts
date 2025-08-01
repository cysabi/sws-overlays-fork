import "./styles/graphics-common.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
import { initStatsStore } from "browser-shared/stores/StatsStore";
import { initTournamentDataStore } from "browser-shared/stores/TournamentDataStore";
import StatsGraphic from "./pages/stats/StatsGraphic.vue";
import gsap from "gsap";
import Flip from "gsap/Flip";

gsap.registerPlugin(Flip);

(async () => {
  const app = createApp(StatsGraphic);
  app.use(createPinia());
  await Promise.all([
    initStatsStore(),
    initTournamentDataStore(),
    document.fonts.load("800 128px Barlow"),
    document.fonts.load("700 128px Barlow Condensed"),
    document.fonts.load("500 128px Barlow Condensed"),
    document.fonts.load("500 128px Noto Sans JP"),
    document.fonts.load("400 48px Haverbrooke"),
    document.fonts.load("400 48px Haverbrooke Hollow"),
  ]);
  app.mount("#app");
})();
