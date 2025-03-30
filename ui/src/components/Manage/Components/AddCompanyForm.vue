<template>
    <v-row class="mt-5">
        <v-col cols="12">
            <v-card class="mx-auto pt-4 bg-grey-lighten-4" flat>
                <v-card-text class="pt-4">
                    <v-row>
                        <v-col cols="12">
                            <h3>Add a new company below</h3>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="newCompany.displayname" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-btn size="large" color="success" block @click="addCompany">
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
    props: ['newCompany', 'addCompany'],
    beforeMount: function () { },
    computed: {},
    methods: {},
    data: () => ({}),
}
</script>