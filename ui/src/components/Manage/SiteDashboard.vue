<!--  
  SiteDashboard:  
    - View of pages for a site dependent on the following route parameters being available
    -- Company ID
    -- Site ID
-->
<template>
  <v-row>
    <v-col cols="12">
      <h1 class="text-h4">{{companyname}} ( <span class="text-green">{{sitename}}</span> )</h1>
    </v-col>
    <v-col cols="12">
      <div class="d-flex justify-left ga-2">
        <v-chip color="primary" variant="flat">
          env: {{environment}}
        </v-chip>
        <v-chip color="primary" variant="flat">
          location: {{location}}
        </v-chip>
        <v-chip color="primary" variant="flat">
          language: {{language}}
        </v-chip>
      </div>
    </v-col>
  </v-row>
<v-row>
  <v-col cols="12">
  <v-table>
    <thead>
      <tr>
        <th class="text-left">
          Page
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
        v-for="page in pages"
        :key="page.name"
      >
        <td><v-btn variant="flat" color="primary" :to="pageLink(companyID, siteID, page.id)">{{ page.displayname }}</v-btn></td>
        <td>{{ page.createdAt }}</td>
        <td>{{ page.updatedAt }}</td>
      </tr>
    </tbody>
  </v-table>
</v-col>
</v-row>
</template>

<script>
  import apiRoutes from '../../apiRoutes';

  export default {
    props: ['companyID', 'siteID'],
    beforeMount: function(){
      this.getSitePages();
    },
    methods: {
      pageLink: (companyID, siteID, pageID) => `/manage/companies/${companyID}/sites/${siteID}/pages/${pageID}`,
      getSitePages: async function() {

        const { companyID, siteID } = this;
        const sitePagesURL = apiRoutes.getAllSitePages(companyID, siteID);

        try {
          const response = await fetch(sitePagesURL);
          if (!response.ok) {
            console.error(`Response status: ${response.status}`);
          }
          const json = await response.json();
          const sites = json.sites[0];
          const pages = sites.pages;
          
          this.companyname = json.displayname;
          this.sitename = sites.displayname;
          this.location = sites.location;
          this.language = sites.language;
          this.environment = sites.environment;

          this.pages =    pages;

        } catch (error) {
          console.error(error.message);
        }
        
      }
    },
    computed: {},
    data: () => ({
      companyname: '',
      sitename: '',
      location: '',
      language: '',
      environment: '',
      pages: [
        { name: '', createdAt: '', updatedAt: '' }  
      ],
    }),
  }
</script>