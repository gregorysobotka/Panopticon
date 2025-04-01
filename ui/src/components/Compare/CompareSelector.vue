<template>
  <v-row>
    <v-col cols="6">
      <v-select :items="companies" v-model="selectedCompany" item-title="displayname" item-value="id" density="compact"
        label="Company" />
    </v-col>
    <v-col cols="6" v-if="activeCompany">
      <v-select :items="sites" v-model="selectedSite" item-title="displayname" item-value="id" density="compact"
        label="Site" />
    </v-col>

    <v-col v-if="activeCompany && activeSite" cols="12">
      <v-btn :to="`/compare/companies/${selectedCompany}/sites/${selectedSite}`" color="primary" block>
        Next
      </v-btn>
    </v-col>
  </v-row>

</template>

<script>
import apiRoutes from '../../apiRoutes';


export default {
  beforeMount: function () {
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

    getAllSites: async function (companyID) {

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
    getCompanies: async function () {

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
    activeCompany() {
      return this.selectedCompany !== null;
    },
    activeSite() {
      return this.selectedSite !== null;
    }
  },
  data: () => ({
    selectedCompany: null,
    selectedSite: null,
    sites: [],
    companies: [],
  }),
}
</script>