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
      <v-img :src="capture.imgDelta" />
    </v-col>
  </v-row>
</template>

<script>
  const baseURL = process.env.ASSETS_URL;
  import { mapActions, mapState, mapWritableState } from 'pinia';
  import { useCompare } from '@/stores/compare';

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
      ...mapActions(useCompare, ['getGroupCaptures']),
      getImageURL: function(filename) {
        return `${baseURL}/${filename}`;
      },
      startComparison: async function() {

        const selectedBase = this.selectedBase;
        const selectedComp = this.selectedComp;

        const baseCaptures = await this.getGroupCaptures(selectedBase);
        const compCaptures = await this.getGroupCaptures(selectedComp);

        const sharedHash = {};
        const combinedList = [];

        const maxCaptureCount = ( baseCaptures.length > compCaptures.length ) ? baseCaptures.length : compCaptures.length;

        for(let i=0; i<maxCaptureCount; i++){

          let baseCapCurrent = baseCaptures[i];
          let compCapCurrent = compCaptures[i];

          const baseCapUID = `s${baseCapCurrent.siteid}-p${baseCapCurrent.pageid}-w${baseCapCurrent.width}-h${baseCapCurrent.height}`;
          const compCapUID = `s${compCapCurrent.siteid}-p${compCapCurrent.pageid}-w${compCapCurrent.width}-h${compCapCurrent.height}`;

          if(!sharedHash.hasOwnProperty(baseCapUID)){
            sharedHash[baseCapUID] = { base: {}, comp: {}, imgDelta: ''};
          }
          
          if(!sharedHash.hasOwnProperty(compCapUID)){
            sharedHash[compCapUID] = { base: {}, comp: {},  imgDelta: ''};
          }

          sharedHash[baseCapUID].base = baseCapCurrent;
          sharedHash[compCapUID].comp = compCapCurrent;

        }

        Object.keys(sharedHash).forEach((key) => {
          const v1 = sharedHash[key].base.filename;
          const v2 = sharedHash[key].comp.filename;
          sharedHash[key].imgDelta = `${baseURL}/images/diff/${v1}/${v2}`;
          combinedList.push(sharedHash[key]);
        });

        this.combinedGroupCaptures = combinedList;

      }
    },
    computed: {
      ...mapWritableState(useCompare, ['selectedBase', 'selectedComp', 'combinedGroupCaptures']),
    },
    data: () => ({
      companyID: null,
      siteID: null
    }),
  }
</script>