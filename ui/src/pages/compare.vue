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

  