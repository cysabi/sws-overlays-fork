import { defineStore } from 'pinia';

export const useDecorationStore = defineStore('decoration', {
    state: () => ({
        mazeBackgroundAlert: false,
        mazeBackgroundAlertColor: '#A032DB',
        counterpickAlertCenterFadeOpen: false
    })
});
