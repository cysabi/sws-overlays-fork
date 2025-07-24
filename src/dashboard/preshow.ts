import './styles/dashboard-common.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PreshowPanel from './pages/preshow/PreshowPanel.vue';
import { initPreshowStore } from 'browser-shared/stores/PreshowStore';

(async () => {
    const app = createApp(PreshowPanel);
    app.use(createPinia());
    await Promise.all([
        initPreshowStore()
    ]);
    app.mount('#app');
})();
