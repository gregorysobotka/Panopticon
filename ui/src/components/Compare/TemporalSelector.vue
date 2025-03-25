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
        @click="startComparison"
        block
      > 
        Start Comparison
      </v-btn>
    </v-col>
  </v-row>

  <v-row v-if="activeComparison">
    <v-col cols="4">
      <p class="text-center bg-grey-darken-2 py-2 mb-2">Version 1</p>
      <v-row v-for="capture in baseCaptures">
        <v-col>
          <p class="text-center bg-grey-lighten-2 py-2 mb-2">{{capture.pagename}}</p>
          <v-img :src="getImageURL(capture.filename)" />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="4">
      <p class="text-center bg-grey-darken-2 py-2 mb-2">Version 2</p>
      <v-row v-for="capture in compCaptures">
        <v-col>
          <p class="text-center bg-grey-lighten-2 py-2 mb-2">{{capture.pagename}}</p>
          <v-img :src="getImageURL(capture.filename)" />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="4">
      <p class="text-center bg-grey py-2 mb-2">Difference</p>
      <!-- Temporary solution, need to refactor entire component to organize grouping of captures-->
       <v-row v-for="imgurl in combinedGroupCaptures">
        <v-col>
          <p class="text-center bg-grey-lighten-2 py-2 mb-2">DIFF</p>
          <v-img :src="imgurl" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
  import apiRoutes from '../../apiRoutes';

  import md5 from 'crypto-js/md5';
  
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
      getImageURL(filename) {
        const baseURL = 'http://localhost:3000';
        return `${baseURL}/${filename}`;
      },
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
      startComparison: async function() {

        this.activeComparison = true; 

        const selectedBase = this.selectedBase;
        const selectedComp = this.selectedComp;
        const combinedGroups = `${selectedBase}${selectedComp}`;

        const combinedGroupID = md5(combinedGroups).toString();

        const baseCaptures = await this.getGroupedCaptures(selectedBase);
        const compCaptures = await this.getGroupedCaptures(selectedComp);

        this.baseCaptures = baseCaptures;
        this.compCaptures = compCaptures;
        this.combinedGroupID = combinedGroupID;

        this.compareCaptures(combinedGroupID, baseCaptures, compCaptures);

        

      },

      compareCaptures: async function(cgid, baseCaptures, compCaptures) {
        
        // THIS WILL BE COMPLETELY RE-WRITTEN

        const sharedHash = {};

        baseCaptures.forEach((capture) => {
          const uid = `s${capture.siteid}-p${capture.pageid}-w${capture.width}-h${capture.height}`;
          capture.uid = uid;
          sharedHash[uid] = { base: capture.filename, comp: ''};
        });

        compCaptures.forEach((capture) => {
          const uid = `s${capture.siteid}-p${capture.pageid}-w${capture.width}-h${capture.height}`;
          capture.uid = uid;
          sharedHash[uid].comp = capture.filename;
        });

        Object.keys(sharedHash).forEach((key) => {
          const baseimg = sharedHash[key].base;
          const compimg = sharedHash[key].comp;
          const combinedImages = `/api/capture/image/diff/${baseimg}/${compimg}`;
          this.combinedGroupCaptures.push(combinedImages);
        });

      },
      getGroupedCaptures: async function(groupID) {

        const captureURL = `/api/capture/history/${groupID}`;

        try {
          const response = await fetch(captureURL);
          const json = await response.json();

          return json;

        } catch (error) {
          console.error(error.message);
          return ['err'];
        }
        
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
      combinedGroupID: '',
      activeComparison: false,
      imgpath: '../../../../capture/',
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