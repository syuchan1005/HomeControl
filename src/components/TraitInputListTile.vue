<template>
  <v-list-tile class="trait-tile">
    <span class="type">{{ type }}</span>
    <div v-if="type === 'Brightness'">
      <v-text-field
        hide-details
        label="setCommand (absolute)"
        placeholder="ex. 'light set %v'"
        v-model="info.setCommand"/>
      <v-text-field
        hide-details
        label="getCommand (return 0-100)"
        placeholder="ex. 'light get'"
        v-model="info.getCommand" />
    </div>
    <div v-else-if="type === 'OnOff'">
      <v-text-field
        hide-details
        label="setCommand (boolean)"
        placeholder="ex. 'switch set %v'"
        v-model="info.setCommand"/>
      <v-text-field
        hide-details
        label="getCommand (return true or false)"
        placeholder="ex. 'switch get'"
        v-model="info.getCommand" />
    </div>
    <template v-else>
      <v-spacer />
      <span>{{ info }}</span>
    </template>
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
    info: {
      type: Object, // JSON
      default: () => {},
    },
  },
  /* events: { delete } */
};
</script>

<style>
.trait-tile > .v-list__tile {
  height: auto !important;
  padding-bottom: 10px;
}
</style>

<style scoped lang="scss">
.type + div:not(.spacer) {
  width: 100%;
  padding-left: 10px;
}
</style>
