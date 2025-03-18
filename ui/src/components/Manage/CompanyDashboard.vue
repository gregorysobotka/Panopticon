<template>
  <v-row>
    <v-col cols="10">
      <h1 class="text-h4">
        {{companyname}}
      </h1>
    </v-col>
    <v-col cols="2">
      <v-btn prepend-icon="fa:fa-plus" variant="outlined">
        Button
      </v-btn>
    </v-col>
  </v-row>
  <v-row>
    <v-table class="mt-10">
      <thead>
        <tr>
          <th class="text-left">Name</th>
          <th class="text-left">Location</th>
          <th class="text-left">Env</th>
          <th class="text-left">Language</th>
          <th class="text-left">Created</th>
          <th class="text-left">Updated</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="site in sites"
          :key="site.displayname"
        >
          <td><v-btn variant="flat" color="primary" :to="siteLink(companyID, site.id)">{{ site.displayname }}</v-btn></td>
          <td>{{ site.location }}</td>
          <td>{{ site.environment }}</td>
          <td>{{ site.language }}</td>
          <td>{{ site.createdAt }}</td>
          <td>{{ site.updatedAt }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-row>
  <Debug :dc="sites" />
</template>

<script>
  import apiRoutes from '../../apiRoutes';

  export default {
    props: ['companyID'],
    beforeMount: function(){
      this.getAllSites();
    },
    methods: {
      siteLink: (companyID, siteID) => `/manage/companies/${companyID}/sites/${siteID}`,
      getAllSites: async function() {
        
        const companyID = this.companyID;
        const requestURL = apiRoutes.getAllSites(companyID);

        try {
          const response = await fetch(requestURL);
          if (!response.ok) {
            console.error(`Response status: ${response.status}`);
          }
          const json = await response.json();
          this.sites = json.sites;
          this.companyname = json.displayname;

        } catch (error) {
          console.error(error.message);
        }
        
      }
    },
    computed: {},
    data: () => ({
      companyname: '',
      sites: []
    }),
  }
</script>