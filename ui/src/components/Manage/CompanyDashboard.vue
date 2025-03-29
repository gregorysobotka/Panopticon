<template>
  <v-row>
    <v-col cols="10">
      <h1 class="text-h4">
        {{ companyname }}
      </h1>
    </v-col>
    <v-col cols="2">
      <v-btn @click="addSiteActive = !addSiteActive" color="primary" flat block>
        <v-icon icon="mdi-plus" start></v-icon>
        Site
      </v-btn>
    </v-col>
  </v-row>

  <AddSiteForm v-if="addSiteActive" :newSite :addSite />

  <SitesTable v-if="sites.length > 0" :sites />

  <Debug :dc="sites" />

</template>

<script>
import { mapActions, mapState, mapWritableState } from 'pinia';
import { useSites } from '@/stores/sites';

export default {
  props: ['companyID'],
  beforeMount: function () {
    this.setCompanyID(this.companyID);
    this.getSites();
  },
  computed: {
    ...mapWritableState(useSites, ['newSite', 'addSiteActive', 'siteID']),
    ...mapState(useSites, ['sites', 'companyname']),
  },
  methods: {
    ...mapActions(useSites, ['getSites', 'setCompanyID', 'addSite']),
  },
  data: () => ({
  }),
}
</script>