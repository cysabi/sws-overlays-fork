import "./styles/dashboard-common.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
import StatsPanel from "./pages/stats/StatsPanel.vue";
import { initStatsStore } from "browser-shared/stores/StatsStore";

(async () => {
  const app = createApp(StatsPanel);
  app.use(createPinia());
  await Promise.all([initStatsStore()]);
  app.mount("#app");
})();
