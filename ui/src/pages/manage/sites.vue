<template>
  <CompanySiteDashboard v-if="activeCompany" :siteID />
  <CompanySitesDashboard v-else="activeCompany"/>
</template>

<script>
  import CompanySitesDashboard from '@/components/Manage/CompaniesDashboard.vue';
  import CompanySiteDashboard from '@/components/Manage/CompanyDashboard.vue';

  export default {
      beforeMount: function(){},  
      data: () => ({}),
      methods: {},
      watch: {},
      computed: {
          activeCompany() {
              return !!this.$route.params.siteID;
          },
          companyID() {
              return this.$route.params.siteID;
          }
      }
  }
</script>