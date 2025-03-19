<template>
  <v-row>
    <v-col cols="10">
      <h1 class="text-h4">
        {{companyname}}
      </h1>
    </v-col>
    <v-col cols="2">
      <v-btn
        @click="addSite = !addSite"
        color="primary"
        flat
        block
      >
        <v-icon
          icon="mdi-plus"
          start
        ></v-icon>
        Site
      </v-btn>
    </v-col>
  </v-row>

  <!-- add site component (could be split into new component for reuse) -->
  <v-row v-if="addSite" class="mt-5">
    <v-col cols="12">
      <v-card
        class="mx-auto pt-4 bg-grey-lighten-4"
        flat
      >
      <v-card-text class="pt-4">
        <v-row>
          <v-col cols="12">
            <h3>Add a new site below</h3>
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="Site Name"
              v-model="addSiteObject.displayname"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="Site Base URL"
              v-model="addSiteObject.url"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="location (country, region, etc.)"
              v-model="addSiteObject.location"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="env (production, test, dev)"
              v-model="addSiteObject.environment"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="language"
              v-model="addSiteObject.language"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn
              size="large"
              color="success"
              block
              @click="addSiteReq"
            >
              Submit
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</v-row>
<!-- end add site component -->

  <v-row>
    <v-col cols="12">
      <v-table class="mt-10">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">URL</th>
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
            <td>{{ site.url }}</td>
            <td>{{ site.location }}</td>
            <td>{{ site.environment }}</td>
            <td>{{ site.language }}</td>
            <td>{{ site.createdAt }}</td>
            <td>{{ site.updatedAt }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
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
      addSiteReq: async function() {
        try {
          const createNewSiteURL = apiRoutes.createNewSite(this.companyID);
          const siteObject = this.addSiteObject; 
          const request = new Request(createNewSiteURL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(siteObject)
          });

          const createCompany = await fetch(request);
          this.getAllSites();
          
          Object.keys(this.addSiteObject).forEach((key) => this.addSiteObject[key] = '')

        } catch (error) {
          console.error(error.message);
        }
      },
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
      addSite: false,
      addSiteObject: {
        displayname: '',
        language: '',
        location: '',
        environment: '',
        url: ''
      },
      companyname: '',
      sites: []
    }),
  }
</script>