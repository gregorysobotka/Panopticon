<!--  
  SiteDashboard:  
    - View of pages for a site dependent on the following route parameters being available
    -- Company ID
    -- Site ID
-->
<template>
  <v-row>
    <v-col cols="12">
      <span class="text-h4">{{companyname}}( <span class="text-green">{{sitename}}</span> )</span>
      <v-chip color="primary" variant="flat" class="mx-5">
        URL: {{url}}
      </v-chip>
      <v-chip color="primary" variant="flat" class="mr-5">
        env: {{environment}}
      </v-chip>
      <v-chip color="primary" variant="flat" class="mr-5">
        location: {{location}}
      </v-chip>
      <v-chip color="primary" variant="flat" class="mr-5">
        language: {{language}}
      </v-chip>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12" class="my-6" min-height="100">
      <v-progress-linear
        v-if="scanInProgress"
        color="light-blue"
        height="15"
        :model-value="scanProgress"
        class="my-5"
        striped
      ></v-progress-linear>
      <v-btn
        v-else="scanInProgress"
        @click="startScan"
        class="ma-2"
        color="primary"
      >
        Start Scan
        <v-icon
          icon="mdi-plus-circle"
          end
        ></v-icon>
      </v-btn>
    </v-col>
    <v-col cols="12">



      <v-table>
    <thead>
      <tr>
        <th class="text-left">Name</th>
        <th class="text-left"></th>
        <th class="text-left"></th>
        <th class="text-left"></th>
        <th class="text-left"></th>
        <th class="text-left"></th>
        <th class="text-left"></th>
        <th class="text-left"></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="spec in sitePageSpecs"
        :key="spec.uid"
      >
        <td><span class="text-grey-darken-3">{{spec.pagename}}</span></td>
        <td>
          <a
            class="text-decoration-none"
            :href="`${spec.url}${spec.path}`"
          >
            {{url}}{{spec.path}}
          </a> 
        </td>
        <td>{{spec.env}}</td>
        <td>{{spec.language}}</td>
        <td>{{spec.width}}px</td>
        <td>{{spec.height}}px</td>
        <td>{{spec.browser}}</td>
        <td><v-icon
            color="grey"
            icon="mdi-circle-small"
            size="large"
          ></v-icon>
        </td>
        <td>
          <v-btn @click="spec.captured = !spec.captured">{{spec.captured}}</v-btn>
        </td>
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
      captureReq: async function() {

      },
      startScan: function() {
        this.scanInProgress = true;
      },
      startSiteScan: async function() {
        try {

          const createNewPageURL = apiRoutes.createNewPage(this.companyID, this.siteID);
          
          const request = new Request(createNewPageURL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            // body: JSON.stringify()
          });

          const startScanReq = await fetch(request);
          

        } catch (error) {
          console.error(error.message);
        }
      
      },
      getSitePages: async function() {

        const { companyID, siteID } = this;
        const sitePagesURL = apiRoutes.getAllSitePages(companyID, siteID);

        try {
          const response = await fetch(sitePagesURL);
          if (!response.ok) {
            console.error(`Response status: ${response.status}`);
          }
          const json = await response.json();
          const sites = json.sites[0]
          const sitePageSpecs = [];

          const pages = sites.pages.map((page) => {
            page.capturespecs = page.capturespecs.map(
              (spec) => { 
                sitePageSpecs.push({
                  uid: `s${sites.id}-p${page.id}-s${spec.id}`,
                  sitename: sites.displayname,
                  pagename: page.displayname,
                  url: sites.url,
                  env: sites.environment,
                  language: sites.language,
                  path: page.path,
                  width: spec.width,
                  height: spec.height,
                  browser: spec.browser,
                  captured: false
                });
                spec.captured = false; 
                return spec;
              });
            page.captured = false;
            return page;
          });

          this.sitePageSpecs = sitePageSpecs;
          
          this.companyname = json.displayname;
          this.sitename = sites.displayname;
          this.location = sites.location;
          this.language = sites.language;
          this.environment = sites.environment;
          this.url = sites.url;

          this.pages = pages;

        } catch (error) {
          console.error(error.message);
        }
        
      }
    },
    computed: {
      scanProgress(){
        if(this.scansCompleted == 0) {
          return 0;
        } else {
          return (this.scansCompleted / this.sitePageSpecs.length) * 100;
        }
      },
      scansCompleted() {
        return this.sitePageSpecs.reduce((count, spec) => (spec.captured) ? count + 1 : count, 0);
      },
      maxScanCount() {
        return this.sitePageSpecs.length;
      }
    },
    data: () => ({
      scanInProgress: false,
      sitePageSpecs: [],
      companyname: '',
      sitename: '',
      url: '',
      location: '',
      language: '',
      environment: '',
      pages: [
        { name: '', createdAt: '', updatedAt: '', capturespecs: [] }  
      ],
    }),
  }
</script>