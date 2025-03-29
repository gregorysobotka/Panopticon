import { defineStore } from 'pinia';
import { useCompanies } from '@/stores/companies';
import apiRoutes from '@/apiRoutes';

/*

    Site Object:

    {
    
    }

*/

export const useSites = defineStore('sites', {
  state: () => ({
    /** @type {{ }} */
    companyname: '',
    companyID: 0,
    siteID: 0, // active / selected site
    sites: [],
    addSiteActive: false,
    newSite: {
      displayname: '',
      language: '',
      location: '',
      environment: '',
      url: ''
    }
  }),
  getters: {
    allSites(state) {
      return state.sites;
    },
    activeSite(state) {
    // active site requires that siteID has been updated using action OR mapWritableState
      if(state.siteID == 0 || state.companyID == 0){ 
        return {};
      } else {
          return state.sites.filter((site) => site.id != state.siteID);
      }
    }
  },
  actions: {
    setSiteID(siteID) {
      this.siteID = siteID;
    },
    setCompanyID(companyID){
      this.companyID = companyID;
    },
    async addSite() {
      try {
        const createNewSiteURL = apiRoutes.createNewSite(this.companyID);
        const request = new Request(createNewSiteURL, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(this.newSite)
        });

        const res = await fetch(request);
        const json = await res.json();
        this.sites.push(json);
        
        // reset fields for newSite
        Object.keys(this.newSite).forEach((key) => this.newSite[key] = '')

      } catch (error) {
        console.error('sites.addSite.err:', error.message);
      }
    },
    async getSites(){
      
      const companyID = this.companyID;
      const requestURL = apiRoutes.getAllSites(companyID);
      
      if(this.companyID == 0){ 
        return [];
      }

      try {
        
        const res = await fetch(requestURL);
        const json = await res.json();
        
        json.sites.forEach((site) => {
          // from this context, json.id == Company ID
          site.siteRoute = `/manage/companies/${json.id}/sites/${site.id}`;
        });

        this.sites = json.sites;

        this.companyname = json.displayname;

      } catch (error) {
        console.error(error.message);
      }

    }
  },
})