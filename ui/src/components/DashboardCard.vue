<template>
<v-col cols="12">
    <v-card
        class="py-4"
        color="surface-variant"
        :to="props.to"
        :prepend-icon="props.icon"
        rounded="lg"
        :subtitle="props.subtitle"
        :title="props.title"
        variant="text"
    >
    <v-overlay
        opacity=".06"
        scrim="primary"
        contained
        model-value
        persistent
    />
    </v-card>
</v-col>
          
</template>
  
<script setup>
    const props = defineProps({
        icon: { type: String, required: true },
        title: { type: String, required: true },
        subtitle: { type: String },
        to: { type: String }
    })
</script>
  