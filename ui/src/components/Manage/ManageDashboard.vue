<template>
    <v-container>
      <v-responsive
        class="align-centerfill-height mx-auto"
        max-width="1200"
      >
        <v-img
          class="mb-4"
          height="150"
          src="@/assets/logo.png"
        />
  
        <div class="py-4" />
  
        <v-row>
            <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="brandname"
            :counter="10"
            :rules="nameRules"
            label="First name"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="lastname"
            :counter="10"
            :rules="nameRules"
            label="Last name"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
          ></v-text-field>
        </v-col>
          
          
        </v-row>
      </v-responsive>
    </v-container>
  </template>
  
  <script>
    export default {
    data: () => ({
      countryOrRegion: '',
      countries: ['US','CA','MX','UK','BR','AU', 'IR'],
      regions: ['EU', 'LATAM', 'NA', 'SA', 'APAC', ],
      fullDomainURL: '',
      environment: '',
      environments: ['production', 'staging', 'integration', 'test', 'development'],
      language: '',
      languages: [''],
      screenSizes: [
        { width: 1440, height: 1280 }
      ]



    }),
  }
  </script>
  