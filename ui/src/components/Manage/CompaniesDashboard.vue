<template>
  <v-row>
    <v-col cols="10">
      <h1 class="text-h4">Companies</h1>
    </v-col>
    <v-col cols="2">
      <v-btn
        @click="addCompany = !addCompany"
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
  <v-row v-if="addCompany" class="mt-5">
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
              v-model="createDisplayname"
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
            <td><v-btn variant="flat" color="primary" :to="companyLink(company.id)">{{ company.displayname }}</v-btn></td>
            <td>{{ company.createdAt }}</td>
            <td>{{ company.updatedAt }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script>
  import apiRoutes from '../../apiRoutes';

  export default {
    beforeMount: function(){
      this.getCompanies();
    },
    methods: {
      companyLink: (companyID) => `/manage/companies/${companyID}`,
      addCompanyReq: async function() {
        try {
          const createNewCompanyURL = apiRoutes.createNewCompany();
          const companyObject = { 'displayname': this.createDisplayname }; 
          const request = new Request(createNewCompanyURL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(companyObject)
          });

          const createCompany = await fetch(request);
          this.getCompanies();
          this.createDisplayname = '';

        } catch (error) {
          console.error(error.message);
        }
      
      },
      getCompanies: async function() {

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
    computed: {},
    data: () => ({
      companies: [
        { name: '', createdAt: '', updatedAt: '' },
      ],
      addCompany: false,
      createDisplayname: ''
    }),
  }
</script>