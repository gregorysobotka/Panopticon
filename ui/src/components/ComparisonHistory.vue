<template>
    <v-row>
      <v-col v-for="comp in compHistory" cols="12" >
        <v-btn 
          :to="`/compare/companies/${comp.companyid}/sites/${comp.siteid}/versions/${comp.basegroupid}/${comp.compgroupid}`"
          color="primary"
          block
        >
          {{comp.companyname}} - {{comp.sitename}} - {{comp.createdAt}}
      </v-btn>
            
        
      </v-col>
    </v-row>
  </template>
  
  <script>
    
    // temporary only -- plan to remove date-format
    // import dateFormat from 'date-format';
    import apiRoutes from '../apiRoutes';
  
    export default {
  
      beforeMount: function(){

        this.getHistory();
   
      },
      watch: {},
      methods: {
        getHistory: async function(groupID) {
  
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