import { defineStore } from 'pinia';

export const useDecorationStore = defineStore('decoration', {
    state: () => ({
        mazeBackgroundAlert: false,
        mazeBackgroundAlertColor: '#FADA00'
    })
});
