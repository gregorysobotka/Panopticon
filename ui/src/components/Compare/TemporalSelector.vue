<template>
  <v-row>
    <v-col class="text-center my-5" cols="12">
      <span class="text-h3">{{ activeCompanyName }}</span> <span class="text-h5">{{ activeSiteName }}</span>
    </v-col>
  </v-row>
  <v-row v-if="captureGroups.length > 0">
    <v-col cols="6">
      <v-select :items="availableBase" v-model="selectedBase" item-title="readableDate" item-value="groupid"
        label="First Version" />
    </v-col>
    <v-col cols="6">
      <v-select :items="availableComps" v-model="selectedComp" item-title="readableDate" item-value="groupid"
        label="Second Version" />
    </v-col>
    <v-col cols="12" v-if="readyForComp">
      <v-btn color="primary" @click="trackComparison" block>
        Start Comparison
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapState, mapWritableState } from 'pinia';
import { useCompare } from '@/stores/compare';
import apiRoutes from '../../apiRoutes';

export default {
  beforeMount: function () {

    const routeCompanyID = this.$route.params.companyID;
    const routeSiteID = this.$route.params.siteID;
    
    this.companyID = routeCompanyID;
    this.siteID = routeSiteID;
    
    this.getCaptureGroups();

  },
  watch: {},
  methods: {
    ...mapActions(useCompare, ['getGroupCaptures', 'getGroupDiffs', 'getCaptureGroups']),
    trackComparison: async function () {

      const compHistoryURL = apiRoutes.createCompHistory();

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comparisonHistoryObject)
      });

      // Register search for history page
      const createCompHistoryEvent = await fetch(request);

      // Redirect user to comparison page
      const comparisonResultsLink = `/compare/companies/${this.companyID}/sites/${this.siteID}/versions/${this.selectedBase}/${this.selectedComp}`;
      this.$router.push(comparisonResultsLink);


    },
  },
  computed: {
    ...mapWritableState(useCompare, ['selectedBase', 'selectedComp', 'combinedCaptures', 'companyID', 'siteID']),
    ...mapState(useCompare, ['captureGroups', 'availableBase', 'availableComps', 'readyForComp']),
    activeCompanyName() {
      return (this.captureGroups.length > 0) ? this.captureGroups[0].companyname : '';
    },
    activeSiteName() {
      return (this.captureGroups.length > 0) ? this.captureGroups[0].sitename : '';
    }
  },
  data: () => ({

  }),
}
</script>