<template>
  <v-container>
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="1200"
    >
      <router-link to="/">
        <v-img
          class="mb-4"
          height="150"
          src="@/assets/logo.png"
          to="/"
        />
      </router-link>
      <div class="py-4" />
      <v-row>
        <v-col cols="12">
          <router-view />
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script>
    
    export default {
        beforeMount: function(){

        },  
        data: () => ({

        }),
        methods: {
        
        }
    }

</script>

  