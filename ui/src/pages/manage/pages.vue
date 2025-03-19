<template>
  <PageDashboard v-if="activePage" :companyID :siteID :pageID />
</template>

<script>
  import PageDashboard from '@/components/Manage/PageDashboard.vue';

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
          pageID() {
              return this.$route.params.pageID;
          },
          activePage(){
            return !!this.$route.params.siteID;
          }
      }
  }
</script>