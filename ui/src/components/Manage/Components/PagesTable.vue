<template>
    <v-row>
        <v-col cols="12">
            <v-table>
                <thead>
                    <tr>
                        <th class="text-left">
                            Page
                        </th>
                        <th class="text-left">
                            Created
                        </th>
                        <th class="text-left">
                            Updated
                        </th>
                        <th>
                            
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="page in pages" :key="page.name">
                        <td><router-link class="text-decoration-none text-h6 text-blue" :to="page.pageRoute">{{
                                page.displayname }}</router-link></td>
                        <td>{{ page.createdAt }}</td>
                        <td>{{ page.updatedAt }}</td>
                        <td><v-icon icon="mdi-delete" @click="deletePage(page.id)" start/></td>
                    </tr>
                </tbody>
            </v-table>
        </v-col>
    </v-row>
</template>

<script>

export default {
    props: ['pages', 'companyID', 'siteID', 'deletePage'],
    beforeMount: function () { },
    computed: {},
    methods: {},
    data: () => ({}),
}
</script>