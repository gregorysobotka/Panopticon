<!--  
  SiteDashboard:  
    - View of pages for a site dependent on the following route parameters being available
    -- Company ID
    -- Site ID
-->
<template>
  <v-row>
    <v-col cols="12">
      <span class="text-h4">{{ companyname }}( <span class="text-green">{{ sitename }}</span> )</span>
      <v-chip color="primary" variant="flat" class="mx-5">
        URL: {{ url }}
      </v-chip>
      <v-chip color="primary" variant="flat" class="mr-5">
        env: {{ environment }}
      </v-chip>
      <v-chip color="primary" variant="flat" class="mr-5">
        location: {{ location }}
      </v-chip>
      <v-chip color="primary" variant="flat" class="mr-5">
        language: {{ language }}
      </v-chip>
    </v-col>
  </v-row>

  <v-row>
    <v-col v-if="!captureCycleComplete" cols="12" class="my-6" min-height="100">
      <v-progress-linear v-if="scanInProgress" color="light-blue" height="30" :model-value="scanProgress" class="my-4"
        striped> {{ scanProgress }}% </v-progress-linear>
      <v-btn v-else="scanInProgress" @click="startSiteScan" class="ma-2" color="success">
        Start Site Capture
        <v-icon icon="mdi-plus-circle" end></v-icon>
      </v-btn>
    </v-col>
    <v-col v-if="captureCycleComplete" cols="12" class="my-6" min-height="100">
      <v-btn to="/compare" class="ma-2" color="primary">
        Go to comparisons
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Full URL</th>
            <th class="text-left">Env</th>
            <th class="text-left">Lang</th>
            <th class="text-left">Width</th>
            <th class="text-left">Height</th>
            <th class="text-left">Browser</th>
            <th class="text-left"></th>
            <th class="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="spec in sitePageSpecs" :key="spec.uid">
            <td><span class="text-grey-darken-3">{{ spec.pagename }}</span></td>
            <td>
              <a class="text-decoration-none" :href="`${spec.url}${spec.path}`">
                {{ url }}{{ spec.path }}
              </a>
            </td>
            <td>{{ spec.env }}</td>
            <td>{{ spec.language }}</td>
            <td>{{ spec.width }}px</td>
            <td>{{ spec.height }}px</td>
            <td>{{ spec.browser }}</td>
            <td></td>
            <td>
              <v-icon :color="(spec.captured) ? 'green' : 'grey'" icon="mdi-circle" size="large" />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-col>
  </v-row>
</template>

<script>
import apiRoutes from '../../apiRoutes';
import md5 from 'crypto-js/md5';

export default {
  props: ['companyID', 'siteID'],
  beforeMount: function () {
    this.getSitePages();
  },
  watch: {
    scansCompleted(newValue) {
      if (this.scansCompleted >= this.sitePageSpecs.length) {
        // when all scans have completed as expected, capture cycle is complete
        this.captureCycleComplete = true;
        this.pageLoadTime = Date.now();
      }
    }
  },
  methods: {
    pageLink: (companyID, siteID, pageID) => `/manage/companies/${companyID}/sites/${siteID}/pages/${pageID}`,
    captureReq: async function (spec) {
      const sitePageCapture = apiRoutes.createNewCapture()

      const request = new Request(sitePageCapture, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spec)
      });

      const captureResponse = await fetch(request);
      const json = await captureResponse.json();

      if (!captureResponse.ok) {
        console.error(`Response status: ${captureResponse.status}`);
      }

      spec.captured = true;
      this.scansCompleted = this.scansCompleted + 1;

      return new Promise((resolve) => resolve(captureResponse));
    },
    startSiteScan: async function () {

      this.scanInProgress = true;
      this.pageLoadTime = Date.now();

      for (let i = 0; i < this.sitePageSpecs.length; i++) {
        let spec = this.sitePageSpecs[i];
        let res = await this.captureReq(spec);
      }

    },
    getSitePages: async function () {

      const { companyID, siteID } = this;
      const sitePagesURL = apiRoutes.getAllSitePages(companyID, siteID);

      try {
        const response = await fetch(sitePagesURL);
        const json = await response.json();
        const sites = json.sites[0]
        const sitePageSpecs = [];
        const gid = this.groupID;

        sites.pages.forEach((page) => {
          page.capturespecs.forEach((spec) => {
            sitePageSpecs.push({
              uid: `s${sites.id}-p${page.id}-s${spec.id}`,
              companyID: json.id,
              siteID: sites.id,
              sitename: sites.displayname,
              url: sites.url,
              env: sites.environment,
              language: sites.language,
              pagename: page.displayname,
              pageID: page.id,
              path: page.path,
              specID: spec.id,
              width: spec.width,
              height: spec.height,
              browser: spec.browser,
              captured: false,
              groupID: gid
            });
          });
        });

        this.sitePageSpecs = sitePageSpecs;

        this.companyname = json.displayname;
        this.sitename = sites.displayname;
        this.location = sites.location;
        this.language = sites.language;
        this.environment = sites.environment;
        this.url = sites.url;

      } catch (error) {
        console.error(error.message);
      }

    },
  },
  computed: {
    scanProgress() {
      if (this.scansCompleted == 0) {
        return 0;
      } else {
        return parseInt((this.scansCompleted / this.sitePageSpecs.length) * 100);
      }
    },
    groupID: function () {
      const urlHashString = `${this.companyID}-${this.siteID}-${this.pageLoadTime}`;
      const groupID = md5(urlHashString);
      return groupID.toString();
    },
    maxScanCount() {
      return this.sitePageSpecs.length;
    }
  },
  data: () => ({
    pageLoadTime: Date.now(),
    scanInProgress: false,
    scansCompleted: 0,
    captureCycleComplete: false,
    sitePageSpecs: [],
    companyname: '',
    sitename: '',
    url: '',
    location: '',
    language: '',
    environment: ''
  }),
}
</script>