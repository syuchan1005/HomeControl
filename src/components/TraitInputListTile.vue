<template>
  <v-list-tile v-if="type === 'OnOff'">
    OnOff
    <v-spacer />
    <v-btn icon @click="$emit('delete')">
      <v-icon small>fas fa-trash</v-icon>
    </v-btn>
  </v-list-tile>
  <v-list-tile v-else-if="type === 'Brightness'">
    Brightness
    <v-spacer />
    <v-btn icon @click="$emit('delete')">
      <v-icon small>fas fa-trash</v-icon>
    </v-btn>
  </v-list-tile>
</template>

<script>
export default {
  name: 'TraitInputListTile',
  props: {
    type: {
      type: String,
    },
    state: {
      type: Object,
      default: () => {},
    },
  },
  /* events: { delete } */
};
</script>

<style scoped lang="scss">

</style>
