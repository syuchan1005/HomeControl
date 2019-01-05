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
  <v-list-tile v-else>
    {{ type }}
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
      type: String,
      default: '{}',
    },
  },
  computed: {
    stateObject: {
      get() {
        return JSON.parse(this.state);
      },
      set(val) {
        this.state = JSON.stringify(val);
      },
    },
  },
  /* events: { delete } */
};
</script>

<style scoped lang="scss">

</style>
