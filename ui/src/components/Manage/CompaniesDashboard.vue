<template>
  <v-row>
    <v-col cols="10">
      <h1 class="text-h4">Companies</h1>
    </v-col>
    <v-col cols="2">
      <v-btn
        @click="addCompanyActive = !addCompanyActive"
        class=""
        color="primary"
        flat
        block
      >
        <v-icon
          icon="mdi-plus"
          start
        ></v-icon>
        Company
      </v-btn>
    </v-col>
  </v-row>
  
  <!-- add company component (could be split into new component for reuse) -->
  <v-row v-if="addCompanyActive" class="mt-5">
    <v-col cols="12">
      <v-card
        class="mx-auto pt-4 bg-grey-lighten-4"
        flat
      >
      <v-card-text class="pt-4">
        <v-row>
          <v-col cols="12">
            <h3>Add a new company below</h3>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="newCompany.displayname"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn
              size="large"
              color="success"
              block
              @click="addCompanyReq"
            >
              Submit
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</v-row>
<!-- end add company component -->

  <v-row>
    <v-col cols="12">
      <v-table class="mt-10">
        <thead>
          <tr>
            <th class="text-left">
              Name
            </th>
            <th class="text-left">
              Created
            </th>
            <th class="text-left">
              Updated
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="company in companies"
            :key="company.displayname"
          >
            <td><router-link class="text-decoration-none text-h6 text-blue" :to="company.companyRoute">{{ company.displayname }}</router-link></td>
            <td>{{ company.createdAt }}</td>
            <td>{{ company.updatedAt }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script>
  import { mapActions, mapState, mapWritableState } from 'pinia';
  import { useCompanies } from '@/stores/companies';

  export default {
    beforeMount: function(){
      this.getCompanies();
    },
    computed: {
      ...mapWritableState(useCompanies, ['newCompany', 'addCompanyActive', 'companies', 'companyID']),
      ...mapState(useCompanies, ['companies']),
    },
    methods: {
      ...mapActions(useCompanies, ['getCompanies', 'addCompany']),
      addCompanyReq: async function(){
        this.addCompany(this.newCompany);
      }
    },
    data: () => ({
      
    }),
  }
</script>