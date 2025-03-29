<template>
<v-row class="mt-5">
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
              v-model="newSite.displayname"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="Site Base URL"
              v-model="newSite.url"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="location (country, region, etc.)"
              v-model="newSite.location"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="env (production, test, dev)"
              v-model="newSite.environment"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="language"
              v-model="newSite.language"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn
              size="large"
              color="success"
              block
              @click="addSite"
            >
              Submit
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</v-row>
</template>
  
  <script>
  
    export default {
      props: ['newSite', 'addSite'],
      beforeMount: function(){},
      computed: {},
      methods: {},
      data: () => ({}),
    }
  </script>