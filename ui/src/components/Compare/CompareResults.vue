<template>
  <v-row v-for="(capture, index) in combinedGroupCaptures" class="pt-0 mt-0 mb-5">
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
  const baseURL = process.env.ASSETS_URL;

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
        return `${baseURL}/${filename}`;
      },
      startComparison: async function() {

        const selectedBase = this.selectedBase;
        const selectedComp = this.selectedComp;

        const baseCaptures = await this.getGroupedCaptures(selectedBase);
        const compCaptures = await this.getGroupedCaptures(selectedComp);

        this.baseCaptures = baseCaptures;
        this.compCaptures = compCaptures;

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

        this.combinedGroupCaptures = combinedList

      },

      deltaImage: function(v1, v2) {
        return `${baseURL}/images/diff/${v1}/${v2}`;
      },
      getGroupedCaptures: async function(groupID) {

        const captureURL = apiRoutes.getCaptureHistory(groupID);

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
    computed: {},
    data: () => ({
      combinedGroupCaptures:[],
      compCaptures: [],
      baseCaptures: [],
      companyID: null,
      siteID: null,
      selectedBase: null,
      selectedComp: null
    }),
  }
</script>