<!--  
  SiteDashboard:  
    - View of pages for a site dependent on
    -- Company ID
    -- Site ID
-->
<template>
  <v-row>
    <v-col cols="10">
      <h1 class="text-h4">
        {{ companyname }}
        - <span>{{ sitename }}</span>
        - ( <span class="text-green">{{ pagename }}</span> )
      </h1>
      <div class="d-flex justify-left ga-2 mt-5">
        <v-chip color="primary" variant="flat">
          URL: {{ siteurl }}
        </v-chip>
        <v-chip color="primary" variant="flat">
          env: {{ environment }}
        </v-chip>
        <v-chip color="primary" variant="flat">
          location: {{ location }}
        </v-chip>
        <v-chip color="primary" variant="flat">
          language: {{ language }}
        </v-chip>
      </div>
    </v-col>
    <v-col cols="12" xs="12" sm="12" md="12" lg="2">
      <v-btn @click="addPageSpec = !addPageSpec" color="primary" flat block>
        <v-icon icon="mdi-plus" start></v-icon>
        Capture Spec
      </v-btn>
    </v-col>
  </v-row>

  <!-- add page component (could be split into new component for reuse) -->
  <v-row v-if="addPageSpec" class="mt-5">
    <v-col cols="12">
      <v-card class="mx-auto pt-4 bg-grey-lighten-4" flat>
        <v-card-text class="pt-4">
          <v-row>
            <v-col cols="12">
              <h3>Add a new page below</h3>
            </v-col>
            <v-col cols="6">
              <v-text-field label="Capture Spec Name" v-model="addSpecObject.displayname" required></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field type="number" label="Page width in pixels" v-model="addSpecObject.width"
                required></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field type="number" label="Page height in pixels" v-model="addSpecObject.height"
                required></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field type="number" label="Delay before screenshot (ms)" v-model="addSpecObject.delay"
                required></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn size="large" color="success" block @click="addPageSpecReq">
                Submit
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <!-- end add site component -->

  <v-row class="mt-10">
    <v-col cols="12">
      <h2 class="text-h5 bg-blue-grey-lighten-4 pa-2 text-center">Screen Capture Specs</h2>
    </v-col>
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
            <th> </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="spec in specs" :key="spec.displayname">
            <td>{{ spec.displayname }}</td>
            <td>{{ spec.browser }}</td>
            <td>{{ spec.width }}px</td>
            <td>{{ spec.height }}px</td>
            <td>{{ spec.delay }}ms</td>
            <td>{{ spec.description }}</td>
            <td><v-icon icon="mdi-delete" @click="deleteSpec(spec.id)" start /></td>
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
  beforeMount: function () {
    this.getSitePages();
  },
  methods: {
    deleteSpec: async function (specID) {
      try {

        const deleteSpecURL = apiRoutes.deleteSpec(this.companyID, this.siteID, this.pageID, specID);

        const request = new Request(deleteSpecURL, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        });

        const response = await fetch(request);

        const json = await response.json();


        this.getSitePages();

      } catch (error) {
        console.error(error);
      }

    },
    pageLink: (companyID, siteID, pageID) => `/manage/companies/${companyID}/sites/${siteID}/pages/${pageID}`,
    getSitePages: async function () {
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
        this.siteurl = sites.url;
        this.pagename = page.displayname;
        this.location = sites.location;
        this.language = sites.language;
        this.environment = sites.environment;

        this.specs = specs;

      } catch (error) {
        console.error(error.message);
      }

    },
    addPageSpecReq: async function () {
      try {

        const createNewPageURL = apiRoutes.createNewPageSpec(this.companyID, this.siteID, this.pageID);

        const request = new Request(createNewPageURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.addSpecObject)
        });

        const createdPage = await fetch(request);
        this.getSitePages();

        // clear model after submission
        this.addSpecObject.displayname = 'Desktop';

        this.addSpecObject.width = 1200;
        this.addSpecObject.height = 1800;
        this.addSpecObject.delay = 1000;

        this.addPageSpec = false;

      } catch (error) {
        console.error(error.message);
      }

    },
  },
  computed: {},
  data: () => ({
    addPageSpec: false,
    addSpecObject: {
      width: 1200,
      height: 1800,
      displayname: 'Desktop',
      delay: 1000,
      description: ''
    },
    companyname: '',
    sitename: '',
    siteurl: '',
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