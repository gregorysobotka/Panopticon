<!--  
  SiteDashboard:  
    - View of pages for a site dependent on the following route parameters being available
    -- Company ID
    -- Site ID
-->
<template>
  <v-row>
    <v-col cols="10">
      <h1 class="text-h4">{{ companyname }} ( <span class="text-green">{{ sitename }}</span> )</h1>
    </v-col>
    <v-col cols="2">
      <v-btn @click="addPage = !addPage" color="primary" flat block>
        <v-icon icon="mdi-plus" start></v-icon>
        Page
      </v-btn>
      <v-btn :to="`/manage/companies/${companyID}/sites/${siteID}/capture`" class="mt-2" color="success" flat block>
        <v-icon icon="mdi-plus" start></v-icon>
        Capture
      </v-btn>
    </v-col>
    <v-col cols="12">
      <div class="d-flex justify-left ga-2">
        <v-chip color="primary" variant="flat">
          URL: {{ url }}
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
  </v-row>

  <AddPageForm v-if="addPage" :addPageReq :addPageObject />

  <PagesTable :pages :companyID :siteID />

</template>

<script>
import apiRoutes from '../../apiRoutes';

export default {
  props: ['companyID', 'siteID'],
  beforeMount: function () {
    this.getSitePages();
  },
  methods: {
    addPageReq: async function () {
      try {

        const createNewPageURL = apiRoutes.createNewPage(this.companyID, this.siteID);

        const request = new Request(createNewPageURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.addPageObject)
        });

        const createdPage = await fetch(request);
        this.getSitePages();

        // clear model after submission
        this.addPageObject.displayname = '';
        this.addPageObject.path = '';


      } catch (error) {
        console.error(error.message);
      }

    },
    getSitePages: async function () {

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
        this.url = sites.url;

        pages.forEach((page) => {
          page.pageRoute = `/manage/companies/${companyID}/sites/${siteID}/pages/${page.id}`
        })

        this.pages = pages;

      } catch (error) {
        console.error(error.message);
      }

    }
  },
  computed: {},
  data: () => ({
    addPage: false,
    companyname: '',
    sitename: '',
    url: '',
    location: '',
    language: '',
    environment: '',
    addPageObject: { displayname: '', path: '' },
    pages: [
      { name: '', createdAt: '', updatedAt: '' }
    ],
  }),
}
</script>