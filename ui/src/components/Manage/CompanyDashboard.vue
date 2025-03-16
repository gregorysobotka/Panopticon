<template>
  <h1>{{companyName}}</h1>
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
        v-for="site in sites"
        :key="site.displayname"
      >
        <td><v-btn variant="text" :to="siteLink(companyID, site.id)">{{ site.displayname }}</v-btn></td>
        <td>{{ site.createdAt }}</td>
        <td>{{ site.updatedAt }}</td>
      </tr>
    </tbody>
  </v-table>
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
          this.companyName = json.displayname;
          console.log(json)

        } catch (error) {
          console.error(error.message);
        }
        
      }
    },
    computed: {},
    data: () => ({
      companyName: '',
      sites: [
        
      ],
    }),
  }
</script>