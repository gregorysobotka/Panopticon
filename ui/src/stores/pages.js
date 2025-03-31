import { defineStore } from 'pinia';
import apiRoutes from '@/apiRoutes';
import { log, error } from '@/log';


/*

    Site Object:

    {
    
    }

*/

export const usePages= defineStore('pages', {
  state: () => ({
    /** @type {{ }} */
    companyname: '',
    companyID: 0,
    siteID: 0, // active / selected site
    sitename: '',
    url: '',
    language: '',
    location: '',
    pages: [],
    pageID: 0,
    pageName: '',
    addPageActive: false,
    newPage: {
      displayname: '',
      path: ''
    }
  }),
  getters: {
    allSites(state) {
      return state.sites;
    },
    activePage(state) {
    
    }
  },
  actions: {
    setSiteID(siteID) {
      this.siteID = siteID;
    },
    setCompanyID(companyID){
      this.companyID = companyID;
    },
    setPageID(pageID){
      this.pageID = pageID;
    },
    async deletePage(pageID) {
      try {

        const deletePageURL = apiRoutes.deletePage(this.companyID, this.siteID, pageID);

        const request = new Request(deletePageURL, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        });

        const response = await fetch(request);

        const json = await response.json();

        log('stores.pages.deletePage')(json);

        this.getPages();

      } catch (error) {
        log('stores.pages.deletePage')(error.message);
      }
    },
    async addPage() {
      try {

        const createNewPageURL = apiRoutes.createNewPage(this.companyID, this.siteID);

        const request = new Request(createNewPageURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.newPage)
        });

        const response = await fetch(request);

        const json = await response.json();

        log('stores.pages.addPage')(json);

        // clear model after submission
        this.newPage.displayname = '';
        this.newPage.path = '';

        this.getPages();

      } catch (error) {
        log('stores.pages.addPage')(error.message);
      }
    },
    async getPages() {

      const { companyID, siteID } = this;
      const sitePagesURL = apiRoutes.getAllSitePages(companyID, siteID);

      try {
        const response = await fetch(sitePagesURL);
        const json = await response.json();

        log('stores.pages.getPages')(json);

        const sites = (json.sites.length > 0) ? json.sites[0] : [];
        const pages = sites.pages;

        this.companyname = json.displayname;

        this.sitename = sites.displayname;
        this.location = sites.location;
        this.language = sites.language;
        this.environment = sites.environment;

        this.url = sites.url;

        pages.forEach((page) => {
          page.pageRoute = `/manage/companies/${companyID}/sites/${siteID}/pages/${page.id}`
        })

        this.pages = pages;

      } catch (error) {
        error('stores.pages.getPages')(error.message);
      }   
    }
  }
})