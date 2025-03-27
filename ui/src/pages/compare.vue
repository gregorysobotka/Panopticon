<template>
  <v-container>
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="2200"
    >
      <v-row class="pa-0">
        <v-col>
          <router-link to="/">
            <v-img
              class="mb-4"
              height="50"
              src="@/assets/logo.png"
              to="/" 
            />
          </router-link>
        </v-col>
      </v-row>

      <router-view />

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

  