import { defineStore } from 'pinia';
import apiRoutes from '@/apiRoutes';
import { log, error } from '@/log';

export const useCompare = defineStore('compare', {
  state: () => ({
    companyID: 0,
    siteID: 0,
    selectedBase: '',
    selectedComp: ''
  }),
  getters: {
    
  },
  actions: {

    async getGroupCaptures(groupID){

      const captureURL = apiRoutes.getCaptureHistory(groupID);

      try {
        const response = await fetch(captureURL);
        const json = await response.json();
        
        log('stores.compare.getGroupCaptures')(json);

        return json;

      } catch (error) {
        error('stores.compare.getGroupCaptures')(error);
        return [];
      }
    },
    
  }
})