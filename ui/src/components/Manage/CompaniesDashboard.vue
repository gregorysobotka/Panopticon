<template>
  <h1 class="text-h4">Companies</h1>
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
        <td><v-btn variant="text" :to="companyLink(company.id)">{{ company.displayname }}</v-btn></td>
        <td>{{ company.createdAt }}</td>
        <td>{{ company.updatedAt }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
  import apiRoutes from '../../apiRoutes';

  export default {
    beforeMount: function(){
      this.getCompanies();
    },
    methods: {
      companyLink: (companyID) => `/manage/companies/${companyID}`,
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
        { name: '', createdAt: '', updatedAt: '' }  
      ],
    }),
  }
</script>