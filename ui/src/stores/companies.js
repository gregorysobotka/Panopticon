import { defineStore } from 'pinia';
import apiRoutes from '@/apiRoutes';

export const useCompanies = defineStore('companies', {
  state: () => ({
    /** @type {{ }} */
    company: {},
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
        return state.company;
    },
    companyID(state) {
        return this.company.id;
    }
  },
  actions: {
    selectCompany(companyID) {
      this.company = this.companies[0]; // todo
    },
    async getCompanies(){
        const companyURL = apiRoutes.getCompanies();
        try {
          const response = await fetch(companyURL);
          if (!response.ok) {
            console.error(`Response status: ${response.status}`);
          }
          const json = await response.json();
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
            const addNewCompany = await res.json();

            this.newCompany.displayname = '';
            this.companies.push(addNewCompany);
            
          } catch (error) {
            console.error(error.message);
          }
        
    }
  },
})