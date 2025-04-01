<template>
  <v-row v-for="comp in compHistory">
    <v-col cols="3"> </v-col>
    <v-col cols="6">
      <v-btn
        :to="`/compare/companies/${comp.companyid}/sites/${comp.siteid}/versions/${comp.basegroupid}/${comp.compgroupid}`"
        color="grey-darken-2" block>
        {{ comp.companyname }} - {{ comp.sitename }} - {{ comp.createdAt }}
      </v-btn>
    </v-col>
    <v-col cols="3"></v-col>
  </v-row>
</template>

<script>
import apiRoutes from '../apiRoutes';

export default {

  beforeMount: function () {

    this.getHistory();

  },
  watch: {},
  methods: {
    getHistory: async function (groupID) {

      const captureURL = apiRoutes.getCompHistory();

      try {
        const response = await fetch(captureURL);
        const json = await response.json();

        this.compHistory = json;

      } catch (error) {
        console.error(error.message);
        this.compHistory = [];
      }

    },
  },
  computed: {

  },
  data: () => ({
    compHistory: []
  }),
}
</script>