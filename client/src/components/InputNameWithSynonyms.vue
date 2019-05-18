<template>
  <div class="input-name-with-synonyms">
    <v-subheader>
      {{ dataName }}
      <v-spacer/>
      <v-btn icon @click="items.push({})">
        <v-icon>fa fa-plus</v-icon>
      </v-btn>
    </v-subheader>
    <v-card v-for="(toggle, i) in items" :key="i" class="name-card">
      <v-layout style="padding: 0 10px">
        <v-text-field :label="nameLabel" v-model="toggle[nameKey]" hide-details/>
        <v-spacer/>
        <v-btn outline @click="() => {
                      if (!toggle[valuesKey]) $set(toggle, valuesKey, []);
                      toggle[valuesKey].push({});
                    }">
          <v-icon left>fas fa-plus</v-icon>Synonym
        </v-btn>
        <v-btn outline color="error" @click="items.splice(i, 1)">
          <v-icon>fas fa-trash</v-icon>
        </v-btn>
      </v-layout>
      <v-data-table hide-actions class="mini-headers" :items="toggle[valuesKey]"
                    :headers="[
                            { text: 'lang', align: 'left', value: 'lang', width: '90px' },
                            { text: synonymsKey, align: 'left', value: synonymsKey },
                            { text: '', value: 'delete', sortable: false, width: '24px' },
                          ]">
        <template slot="items" slot-scope="props">
          <td>
            <v-edit-dialog :return-value.sync="props.item.lang">
              {{ props.item.lang }}
              <v-text-field slot="input" v-model="props.item.lang"
                            label="lang" single-line />
            </v-edit-dialog>
          </td>
          <td>
            <v-edit-dialog lazy>
              {{ (props.item[synonymsKey] || []).join(', ') }}
              <v-combobox v-model="props.item[synonymsKey]" slot="input"
                          multiple chips deletable-chips small-chips
                          :append-icon="null" label="synonym" single-line />
            </v-edit-dialog>
          </td>
          <td><v-btn icon @click="toggle[valuesKey].splice(props.index, 1)">
            <v-icon small>fas fa-trash</v-icon>
          </v-btn></td>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'NameInputWithSynonyms',
  props: {
    dataName: {
      type: String,
      default: 'Item',
    },
    items: {
      type: Array,
      default: () => [],
    },
    nameLabel: {
      type: String,
      default: 'name',
    },
    nameKey: {
      type: String,
      default: 'name',
    },
    valuesKey: {
      type: String,
      default: 'name_values',
    },
    synonymsKey: {
      type: String,
      default: 'name_synonym',
    },
  },
};
</script>

<style scoped lang="scss">
.name-card + .name-card {
  margin-top: 10px;
}
</style>
