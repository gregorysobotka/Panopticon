<template>
  <v-row>
    <v-col class="text-center my-5" cols="12">
      <span class="text-h3">{{activeCompanyName}}</span> <span class="text-h5">{{activeSiteName}}</span>
    </v-col>
  </v-row>
  <v-row v-if="captureHistory.length > 0"> 
    <v-col cols="6"> 
      <v-select
        :items="captureHistory" 
        v-model="selectedBase"
        item-title="readableDate"
        item-value="groupid"
        label="First Version"
      />
    </v-col>
    <v-col cols="6"> 
      <v-select
        :items="availableComps"
        v-model="selectedComp"
        item-title="readableDate"
        item-value="groupid"
        label="Second Version"
      />
    </v-col>
    <v-col cols="12" v-if="readyForComp">
      <v-btn 
        color="primary"
        @click="trackComparison"
        block
      > 
        Start Comparison
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
  import apiRoutes from '../../apiRoutes';
  
  // temporary only -- plan to remove date-format
  import dateFormat from 'date-format';

  export default {
    beforeMount: function(){
    
      this.getCompanies();

      const routeCompanyID = this.$route.params.companyID;
      const routeSiteID = this.$route.params.siteID;

      this.companyID = routeCompanyID;
      this.siteID = routeSiteID;

      this.getAllSites(routeCompanyID);
      this.getAvailableCaptures(routeCompanyID, routeSiteID);

    },
    watch: {},
    methods: {
      readableDate: function (date) {
        const parsedDate = dateFormat.parse(dateFormat.ISO8601_WITH_TZ_OFFSET_FORMAT, date);
        return parsedDate.toString();
      },
      getAvailableCaptures: async function(companyID, siteID) {
        
        const requestURL = apiRoutes.getAvailableCaptures(companyID, siteID);

        try {
          const response = await fetch(requestURL);
          if (!response.ok) {
            console.error(`Response status: ${response.status}`);
          }
          const json = await response.json();

          const modifiedCaptures = json.map((capture) => {
            capture.readableDate = this.readableDate(capture.createdAt);
            return capture;
          });
          this.captureHistory = modifiedCaptures;

        } catch (error) {
          console.error(error.message);
        }
        
      },
      trackComparison: async function() { 
        
        const compHistoryURL = apiRoutes.createCompHistory();

        const baseCapture = this.baseCaptures[0];
        const compCapture = this.compCaptures[0];

        const comparisonHistoryObject = {
            companyid: this.companyID,
            siteid: this.siteID,
            companyname: this.activeCompanyName,
            sitename: this.activeSiteName,
            basegroupid: this.selectedBase,
            compgroupid: this.selectedComp,
        };

        const request = new Request(compHistoryURL, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(comparisonHistoryObject)
        });

          const createCompHistoryEvent = await fetch(request);

          const comparisonResultsLink = `/compare/companies/${this.companyID}/sites/${this.siteID}/versions/${this.selectedBase}/${this.selectedComp}`;

          this.$router.push(comparisonResultsLink);

          
      },
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
      activeCompanyName() {
        const company = this.companies.filter((company) => company.id == this.companyID);
        return (company.length > 0) ? company[0].displayname : '';
      },
      activeSiteName() {
        const site = this.sites.filter((site) => site.id == this.siteID);
        return (site.length > 0) ? site[0].displayname : '';
      },
      availableComps() {
        return this.captureHistory.filter((capture) => capture.groupid != this.selectedBase);
      },
      readyForComp() {
        return (this.selectedBase !== null && this.selectedComp !== null);
      }
    },
    data: () => ({
      combinedGroupCaptures: [],
      combinedGroupCapturesRef:[],
      combinedGroupID: '',
      activeComparison: false,
      compCaptures: [],
      baseCaptures: [],
      captureHistory: [],
      companyID: null,
      siteID: null,
      sites: [],
      companies: [],
      selectedBase: null,
      selectedComp: null
      
    }),
  }
</script>