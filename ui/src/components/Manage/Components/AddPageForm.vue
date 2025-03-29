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
            <h3>Add a new page below</h3>
          </v-col>
          <v-col cols="6">
            <v-text-field
              label="Page Name"
              v-model="addPageObject.displayname"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              label="Page Relative Path"
              v-model="addPageObject.path"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn
              size="large"
              color="success"
              block
              @click="addPageReq"
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
      props: ['addPageReq', 'addPageObject'],
      beforeMount: function(){},
      computed: {},
      methods: {},
      data: () => ({}),
    }
  </script>