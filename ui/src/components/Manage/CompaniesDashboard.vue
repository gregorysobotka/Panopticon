<template>
  <v-row>
    <v-col cols="10">
      <h1 class="text-h4">Companies</h1>
    </v-col>
    <v-col cols="2">
      <v-row>
        <v-col cols="12" class="py-1">
          <v-btn @click="addCompanyActive = !addCompanyActive" class="" color="primary" flat block>
            <v-icon icon="mdi-plus" start></v-icon>
            Company
          </v-btn>
        </v-col>
        <v-col cols="12" class="py-1  ">
          <a target="_blank" :href="downloadAppData" class="text-decoration-none">
            <v-btn target="" text="Export Data" color="blue-lighten-2" flat block />
          </a>
        </v-col>
      </v-row>
    </v-col>
  </v-row>

  <AddCompanyForm v-if="addCompanyActive" :newCompany :addCompany />

  <CompaniesTable v-if="companies.length > 0" :companies />

</template>

<script>
import { mapActions, mapState, mapWritableState } from 'pinia';
import { useCompanies } from '@/stores/companies';
import apiRoutes from '@/apiRoutes';

const downloadAppData = apiRoutes.downloadAppData();

export default {
  beforeMount: function () {
    this.getCompanies();
  },
  computed: {
    ...mapWritableState(useCompanies, ['newCompany', 'addCompanyActive', 'companies', 'companyID']),
    ...mapState(useCompanies, ['companies']),
  },
  methods: {
    ...mapActions(useCompanies, ['getCompanies', 'addCompany']),
  },
  data: () => ({
    downloadAppData
  }),
}
</script>