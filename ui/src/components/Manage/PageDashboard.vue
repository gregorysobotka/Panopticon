<!--  
  SiteDashboard:  
    - View of pages for a site dependent on
    -- Company ID
    -- Site ID
-->
<template>
  <v-row>
    <v-col cols="12">
      <h1 class="text-h4">
        {{companyname}} 
        - <span>{{sitename}}</span>
        - ( <span class="text-green">{{pagename}}</span> )
      </h1>
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
        <th class="text-left">Name</th>
        <th class="text-left">Browser</th>
        <th class="text-left">Screen Width</th>
        <th class="text-left">Screen Height</th>
        <th class="text-left">Delay</th>
        <th class="text-left">Description</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="spec in specs"
        :key="spec.displayname"
      >
        <td>{{ spec.displayname }}</td>
        <td>{{ spec.browser }}</td>
        <td>{{ spec.width }}px</td>
        <td>{{ spec.height }}px</td>
        <td>{{ spec.delay }}ms</td>
        <td>{{ spec.description }}</td>
      </tr>
    </tbody>
  </v-table>
</v-col>
</v-row>
</template>

<script>
  import apiRoutes from '../../apiRoutes';

  export default {
    props: ['companyID', 'siteID', 'pageID'],
    beforeMount: function(){
      this.getSitePages();
    },
    methods: {
      pageLink: (companyID, siteID, pageID) => `/manage/companies/${companyID}/sites/${siteID}/pages/${pageID}`,
      getSitePages: async function() {
        // refactor for reuse
        const { companyID, siteID, pageID } = this;
        const getPageSpecsURL = apiRoutes.getPageSpecs(companyID, siteID, pageID);

        try {
          const response = await fetch(getPageSpecsURL);
          if (!response.ok) {
            console.error(`Response status: ${response.status}`);
          }
          const json = await response.json();
          
          const sites = json.sites[0];
          const page = sites.pages[0];
          const specs = page.capturespecs;
          
          this.companyname = json.displayname;
          this.sitename = sites.displayname;
          this.pagename = page.displayname;
          this.location = sites.location;
          this.language = sites.language;
          this.environment = sites.environment;

          this.specs = specs;

        } catch (error) {
          console.error(error.message);
        }
        
      },
      getPageDetails: async function() {
        const { companyID, siteID, pageID } = this;
        const getPageSpecsURL = apiRoutes.getPageSpecs(companyID, siteID, pageID);
        try {
          const response = await fetch(getPageSpecsURL);
          if (!response.ok) {
            console.error(`Response status: ${response.status}`);
          }
          const json = await response.json();
          console.log(json)

        } catch (error) {
          console.error(error.message);
        }
      }
    },
    computed: {},
    data: () => ({
      companyname: '',
      sitename: '',
      pagename: '',
      location: '',
      language: '',
      environment: '',
      specs: [
        { 
          displayname: '', 
          createdAt: '', 
          updatedAt: '', 
          width: null, 
          height: null, 
          delay: null, 
          browser: "", 
          description: "" 
        }  
      ],
    }),
  }
</script>