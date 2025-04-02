<template>
  <v-row v-if="captureGroups.length > 0">
    <v-col cols="6">
      <v-select :items="availableBase" v-model="selectedBase" item-title="readableDate" item-value="groupid"
        label="First Version" />
    </v-col>
    <v-col cols="6">
      <v-select :items="availableComps" v-model="selectedComp" item-title="readableDate" item-value="groupid"
        label="Second Version" />
    </v-col>
  </v-row>
  <v-row v-for="(capture, index) in combinedCaptures" class="pt-0 mt-0 mb-5">
    <v-col cols="12" class="text-center pa-0" v-if="index == 0">
      <span class="text-h4">{{ capture.base.companyname }}</span> <span class="text-h5">- {{ capture.base.sitename }} -
        env[{{ capture.base.environment }}] - language[{{ capture.base.language }}] -
        location[{{ capture.base.location }}]</span>
    </v-col>
    <v-col cols="12" class="pa-0 ma-0">
      <p class="text-center bg-black py-1 mb-0 text-h6">PAGE [ {{ capture.base.pagename }} ] - {{ capture.base.width
        }}px x
        {{ capture.base.height }}px</p>
    </v-col>
    <v-col cols="4" class="pa-0">
      <p class="text-center bg-grey-darken-2 py-1 mb-1">V1</p>
      <a :href="getImageURL(capture.base.filename)" target="_blank">
        <v-img :src="getImageURL(capture.base.filename)" />
      </a>
    </v-col>

    <v-col cols="4" class="pa-0">
      <p class="text-center bg-grey-darken-2 py-1 mb-1">V2</p>
      <a :href="getImageURL(capture.comp.filename)" target="_blank">
        <v-img :src="getImageURL(capture.comp.filename)" />
      </a>
    </v-col>

    <v-col cols="4" class="pa-0">
      <p class="text-center bg-grey-darken-2 py-1 mb-1">Diff</p>
      <a :href="capture.imgDelta" target="_blank">
        <v-img :src="getImageDiffURL(capture.imgDelta)" />
      </a>
    </v-col>
  </v-row>
</template>

<script>
const baseURL = process.env.ASSETS_URL;
import { mapActions, mapState, mapWritableState } from 'pinia';
import { useCompare } from '@/stores/compare';
import { log, error } from '@/log';

export default {

  beforeMount: function () {

    this.companyID = this.$route.params.companyID;
    this.siteID = this.$route.params.siteID;

    this.selectedBase = this.$route.params.selectedBase;
    this.selectedComp = this.$route.params.selectedComp;

    this.startComparison();
    this.getCaptureGroups();

  },
  watch: {
    selectedBase(newBaseID){
      this.startComparison();
    },
    selectedComp(newCompID){
      this.startComparison();
    }
  },
  methods: {
    ...mapActions(useCompare, ['getGroupCaptures', 'getGroupDiffs', 'getCaptureGroups']),
    getImageURL: function (filename) {
      return `${baseURL}/${filename}`;
    },
    getImageDiffURL: function (filename) {
      return `${baseURL}/images/diff/${filename}`;
    },
    startComparison: async function () {
      await this.getGroupDiffs();
    }
  },
  computed: {
    ...mapWritableState(useCompare, ['selectedBase', 'selectedComp', 'combinedCaptures', 'companyID', 'siteID']),
    ...mapState(useCompare, ['captureGroups', 'availableBase', 'availableComps'])
  },
  data: () => ({
    baseID: null,
    compID: null
  }),
}
</script>