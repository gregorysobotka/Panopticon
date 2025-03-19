<template>
    <v-row v-if="debugActive" class="mt-10">
        <v-col>
            <code>{{dc}}</code>
        </v-col>
    </v-row>
</template>

<script>

    export default {
        props: ['dc'],
        beforeMount: function(){},  
        data: () => ({}),
        methods: {},
        watch: {},
        computed: {
            debugActive() {
                return !!this.$route.query.debug;
            }
        }
    }
</script>