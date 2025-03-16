<template>
    <CompanyDashboard v-if="activeCompany" :companyID/>
    <CompaniesDashboard v-else="activeCompany"/>
</template>

<script>
    import CompaniesDashboard from '@/components/Manage/CompaniesDashboard.vue';
    import CompanyDashboard from '@/components/Manage/CompanyDashboard.vue';

    export default {
        beforeMount: function(){},  
        data: () => ({}),
        methods: {},
        watch: {},
        computed: {
            activeCompany() {
                return !!this.$route.params.companyID;
            },
            companyID() {
                return this.$route.params.companyID;
            }
        }
    }
</script>