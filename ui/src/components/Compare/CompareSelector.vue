<template>
  <v-row>
    <v-col cols="6">
      <v-select
        :items="companies"
        v-model="selectedCompany"
        item-title="displayname"
        item-value="id"
        density="compact"
        label="Company"
      />
    </v-col>
    <v-col cols="6" v-if="activeCompany">
      <v-select
        :items="sites"
        v-model="selectedSite"
        item-title="displayname"
        item-value="id"
        density="compact"
        label="Site"
      />
    </v-col>
      
    <v-col v-if="activeCompany && activeSite" cols="12">
      <v-btn 
        :to="`/compare/companies/${selectedCompany}/sites/${selectedSite}`" 
        color="primary" 
        block
      > 
        Next
      </v-btn>
    </v-col>
  </v-row>

</template>

<script>
  import apiRoutes from '../../apiRoutes';
  
  // temporary only -- plan to remove date-format


  export default {
    beforeMount: function(){
      this.getCompanies();
    },
    watch: {
      selectedCompany(companyID) {
        this.getAllSites(companyID);
      },
      selectedSite(siteID) {
        // this.getAvailableCaptures(siteID);
      }
    },
    methods: {

      // getAvailableCaptures: async function(siteID) {
        
      //   const companyID = this.selectedCompany;
      //   const requestURL = apiRoutes.getAvailableCaptures(companyID, siteID);

      //   try {
      //     const response = await fetch(requestURL);
      //     if (!response.ok) {
      //       console.error(`Response status: ${response.status}`);
      //     }
      //     const json = await response.json();
      //     console.log(json)
      //     const modifiedCaptures = json.map((capture) => {
      //       capture.readableDate = this.readableDate(capture.createdAt);
      //       return capture;
      //     });
      //     this.captureHistory = modifiedCaptures;

      //   } catch (error) {
      //     console.error(error.message);
      //   }
        
      // },
      getAllSites: async function(companyID) {
        
        const requestURL = apiRoutes.getAllSites(companyID);

        try {
          const response = await fetch(requestURL);
          if (!response.ok) {
            console.error(`Response status: ${response.status}`);
          }
          const json = await response.json();
          this.sites = json.sites;

        } catch (error) {
          console.error(error.message);
        }
        
      },
      getCompanies: async function() {

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
        
      }
    },
    computed: {
      activeBaseVersion() {
        return this.selectedBase !== null;
      },
      activeCompany() {
        return this.selectedCompany !== null;
      },
      activeSite() {
        return this.selectedSite !== null;
      },
      availableComps() {
        return this.captureHistory.filter((capture) => {
          return capture.groupid != this.selectedBase;
        });
      }
    },
    data: () => ({
      captureHistory: [],
      selectedCompany: null,
      selectedSite: null,
      sites: [],
      companies: [],
      selectedBase: null,
      selectedComp: null
      
    }),
  }
</script>