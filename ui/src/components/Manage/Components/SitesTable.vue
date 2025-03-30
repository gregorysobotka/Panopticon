<template>
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
          <tr v-for="site in sites" :key="site.id">
            <td>
              <router-link class="text-decoration-none text-h6 text-blue" :to="site.siteRoute">{{
                site.displayname }}</router-link>
            </td>
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

export default {
  props: {
    sites: Array
  },
  beforeMount: function () { },
  computed: {},
  methods: {},
  data: () => ({}),
}
</script>