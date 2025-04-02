import { defineStore } from 'pinia';
import apiRoutes from '@/apiRoutes';
import dateFormat from 'date-format';
import { log, error } from '@/log';

function readableDate(date) {
  const parsedDate = dateFormat.parse(dateFormat.ISO8601_FORMAT, date);
  return parsedDate.toString();
}

export const useCompare = defineStore('compare', {
  state: () => ({
    companyID: 0,
    siteID: 0,
    selectedBase: '',
    selectedComp: '',
    combinedCaptures: [],
    captureGroups: []
  }),
  getters: {
    availableComps() {
      return this.captureGroups.filter((capture) => capture.groupid != this.selectedBase);
    },
    availableBase() {
      if(this.selectedComp == ''){
        return this.captureGroups;
      } else {
        return this.captureGroups.filter((capture) => capture.groupid != this.selectedComp);
      }
    },
    readyForComp() {
      return (this.selectedBase !== '' && this.selectedComp !== '');
    }
  },
  actions: {
    async getCaptureGroups() {
      if(this.companyID == 0 || this.siteID == 0) {
        return;
      }
      const requestURL = apiRoutes.getAvailableCaptures(this.companyID, this.siteID);

      try {
        const response = await fetch(requestURL);
        const json = await response.json();

        const modifiedCaptures = json.map((capture) => {
          capture.readableDate = readableDate(capture.createdAt);
          return capture;
        });
        this.captureGroups = modifiedCaptures;

      } catch (error) {
        console.error(error.message);
      }

    },
    async getGroupDiffs(){

      const captureURL = apiRoutes.getGroupDiffCapHistory(this.selectedBase, this.selectedComp);

      try {
        const response = await fetch(captureURL);
        const json = await response.json();
        
        log('stores.compare.getGroupCaptures')(json);

        this.combinedCaptures = json;

        return json;

      } catch (error) {
        error('stores.compare.getGroupCaptures')(error);
        return [];
      }
    },
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