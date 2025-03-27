<template>
  <v-row v-for="(capture, index) in combinedGroupCapturesRef" v-if="activeComparison" class="pt-0 mt-0 mb-5">
    <v-col cols="12" class="text-center pa-0" v-if="index == 0">
      <span class="text-h4">{{capture.base.companyname}}</span> <span class="text-h5">- {{capture.base.sitename}} - env[{{capture.base.environment}}] - language[{{capture.base.language}}] - location[{{capture.base.location}}]</span>
    </v-col>
    <v-col cols="12" class="pa-0 ma-0"> 
      <p class="text-center bg-black py-1 mb-0 text-h6">PAGE [ {{capture.base.pagename}} ] - {{capture.base.width}}px x {{capture.base.height}}px</p>
    </v-col>
    <v-col cols="4" class="pa-0">
      <p class="text-center bg-grey-darken-2 py-1 mb-1">V1</p>
      <v-img :src="getImageURL(capture.base.filename)" />
    </v-col>

    <v-col cols="4" class="pa-0">
      <p class="text-center bg-grey-darken-2 py-1 mb-1">V2</p>
      <v-img :src="getImageURL(capture.comp.filename)" />
    </v-col>

    <v-col cols="4" class="pa-0">
      <p class="text-center bg-grey-darken-2 py-1 mb-1">Diff</p>
      <v-img :src="deltaImage(capture.base.filename, capture.comp.filename)" />
    </v-col>
  </v-row>
</template>

<script>
  import apiRoutes from '../../apiRoutes';

  import md5 from 'crypto-js/md5';

  const staticFileURL = 'http://localhost:8888';
  
  // temporary only -- plan to remove date-format
  import dateFormat from 'date-format';

  export default {

    beforeMount: function(){

      this.companyID =  this.$route.params.companyID;
      this.siteID = this.$route.params.siteID;
      this.selectedBase = this.$route.params.selectedBase;
      this.selectedComp = this.$route.params.selectedComp;

      this.startComparison();
 
    },
    watch: {},
    methods: {
      getImageURL: function(filename) {
        const baseURL = staticFileURL;
        return `${baseURL}/${filename}`;
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

        const shareHashRef = {};
        const combinedList = [];

        baseCaptures.forEach((capture) => {
          const uid = `s${capture.siteid}-p${capture.pageid}-w${capture.width}-h${capture.height}`;
          capture.uid = uid;
          shareHashRef[uid] = { base: capture, comp: {}};
        });

        compCaptures.forEach((capture) => {
          const uid = `s${capture.siteid}-p${capture.pageid}-w${capture.width}-h${capture.height}`;
          capture.uid = uid;
          shareHashRef[uid].comp = capture;
        });

        Object.keys(shareHashRef).forEach((key) => {
          combinedList.push(shareHashRef[key]);
        });

        this.combinedGroupCapturesRef = combinedList

      },

      deltaImage: function(v1, v2) {
        return `/api/capture/image/diff/${v1}/${v2}`;
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