<!--  
  SiteDashboard:  
    - View of pages for a site dependent on the following route parameters being available
    -- Company ID
    -- Site ID
-->
<template>
  <v-row>
    <v-col cols="10">
      <h1 class="text-h4">{{ companyname }} ( <span class="text-green">{{ sitename }}</span> )</h1>
    </v-col>
    <v-col cols="2">
      <v-btn @click="addPageActive = !addPageActive" color="primary" flat block>
        <v-icon icon="mdi-plus" start></v-icon>
        Page
      </v-btn>
      <v-btn :to="`/manage/companies/${companyID}/sites/${siteID}/capture`" class="mt-2" color="success" flat block>
        <v-icon icon="mdi-plus" start></v-icon>
        Capture
      </v-btn>
    </v-col>
    <v-col cols="12">
      <div class="d-flex justify-left ga-2">
        <v-chip color="primary" variant="flat">
          URL: {{ url }}
        </v-chip>
        <v-chip color="primary" variant="flat">
          env: {{ environment }}
        </v-chip>
        <v-chip color="primary" variant="flat">
          location: {{ location }}
        </v-chip>
        <v-chip color="primary" variant="flat">
          language: {{ language }}
        </v-chip>
      </div>
    </v-col>
  </v-row>

  <AddPageForm v-if="addPageActive" :addPage :newPage />

  <PagesTable :pages :companyID :siteID />

</template>

<script>
import { mapActions, mapState, mapWritableState } from 'pinia';
import { usePages } from '@/stores/pages';

export default {
  props: ['companyID', 'siteID'],
  beforeMount: function () {
    this.setCompanyID(this.companyID);
    this.setSiteID(this.siteID);
    this.getPages();
  },
  methods: {
    ...mapActions(usePages, ['getPages', 'addPage', 'setCompanyID', 'setSiteID']),
  },
  computed: {
    ...mapWritableState(usePages, ['newPage', 'addPageActive']),
    ...mapState(usePages, ['pages', 'companyname', 'sitename', 'location', 'language', 'environment', 'url'])
  },
  data: () => ({
  }),
}
</script>