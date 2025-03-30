<template>
    <v-row>
        <v-col cols="12">
            <v-table class="mt-10">
                <thead>
                    <tr>
                        <th class="text-left">
                            Name
                        </th>
                        <th class="text-left">
                            Created
                        </th>
                        <th class="text-left">
                            Updated
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="company in companies" :key="company.displayname">
                        <td><router-link class="text-decoration-none text-h6 text-blue" :to="company.companyRoute">{{
                                company.displayname }}</router-link></td>
                        <td>{{ company.createdAt }}</td>
                        <td>{{ company.updatedAt }}</td>
                    </tr>
                </tbody>
            </v-table>
        </v-col>
    </v-row>
</template>

<script>

export default {
    props: ['companies'],
    beforeMount: function () { },
    computed: {},
    methods: {},
    data: () => ({}),
}
</script>