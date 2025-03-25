<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="1000"
    >
      <v-img
        class="mb-4"
        height="150"
        src="@/assets/logo.png"
      />

      <div class="text-center">
        <div class="text-body-2 font-weight-light mb-n1">Welcome to</div>

        <h1 class="text-h2 font-weight-bold">Panopticon</h1>
      </div>

      <div class="py-4" />

      <v-row>
        <DashboardCard
          title="Manage"
          subtitle="Add, edit, remove websites and their settings"
          to="manage"
          icon="mdi-text-box-outline"
        />
        <DashboardCard
          title="New Comparison"
          subtitle="Check for changes that have occured to the websites you're monitoring"
          to="compare"
          icon="mdi-text-box-outline"
        />
        <DashboardCard
          title="History"
          subtitle="View the results of previously run comparisons"
          to="history"
          icon="mdi-text-box-outline"
        />
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup>
  //
</script>
