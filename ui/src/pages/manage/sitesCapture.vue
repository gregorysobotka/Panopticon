<template>
  <SiteCaptureDashboard v-if="activeSite" :companyID :siteID />
</template>

<script>
  import SiteDashboard from '@/components/Manage/SiteDashboard.vue';

  export default {
      beforeMount: function(){},  
      data: () => ({}),
      methods: {},
      watch: {},
      computed: {
          siteID() {
              return this.$route.params.siteID;
          },
          companyID() {
              return this.$route.params.companyID;
          },
          activeSite(){
            return !!this.$route.params.siteID;
          }
      }
  }
</script>