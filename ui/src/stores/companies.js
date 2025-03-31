import { defineStore } from 'pinia';
import apiRoutes from '@/apiRoutes';

/*

    Company Object:

    {
    
    }

*/

export const useCompanies = defineStore('companies', {
  state: () => ({
    companyID: 0, // active / selected company
    companies: [],
    addCompanyActive: false,
    newCompany: {
        displayname: ''
    }
  }),
  getters: {
    allCompanies(state) {
      return state.companies;
    },
    activeCompany(state) {
    // active company requires that companyID has been updated using action OR mapWritableState
        if(state.companyID == 0){ 
            return {};
        } else {
            return state.companies.filter((company) => company.id != state.companyID);
        }
    }
  },
  actions: {
    selectCompany(companyID) {
      this.companyID = companyID;
    },
    async exportAllCompanyInfo() {
      const companyURL = apiRoutes.getCompanies();
      try {
        const response = await fetch(companyURL);
        const json = await response.json();

        this.companies = json;

      } catch (error) {
        console.error(error.message);
      }
    },
    async getCompanies(){
        const companyURL = apiRoutes.getCompanies();
        try {
          const response = await fetch(companyURL);
          const json = await response.json();

          json.forEach((company) => {
            company.companyRoute = `/manage/companies/${company.id}`;
          });

          this.companies = json;

        } catch (error) {
          console.error(error.message);
        }
    },
    async addCompany(){
        try {
            if(this.newCompany.displayname === ''){
                console.error('missing display name');
                return;
            } 

            const createNewCompanyURL = apiRoutes.createNewCompany();
            const companyObject = { 'displayname': this.newCompany.displayname }; 
            const request = new Request(createNewCompanyURL, {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify(companyObject)
            });

            const res = await fetch(request);
            const json = await res.json();

            this.newCompany.displayname = '';
            this.companies.push(json);
            
        } catch (error) {
            console.error(error.message);
        }
    }
  },
})