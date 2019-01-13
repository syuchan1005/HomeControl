<template>
  <v-card class="command-field">
    <v-label v-if="label">{{ label }}</v-label>
    <v-layout v-if="value" :column="value.type === 'javascript'">
      <v-select v-model="value.type" label="type" class="type-selector"
                :items="typeItems" style="max-width: 104px" />

      <monaco-editor v-if="value.type === 'javascript'" class="editor"
                     v-model="value.value"
                     language="javascript" :options="{ automaticLayout: true }"/>
      <v-text-field v-else v-model="value.value" :label="value.type" class="editor-text" />
    </v-layout>
  </v-card>
</template>

<script>
import MonacoEditor from 'vue-monaco';

export default {
  components: {
    MonacoEditor,
  },
  name: 'CommandField',
  props: {
    label: {
      type: String,
    },
    value: {
      type: Object,
      default: () => {},
    },
    typeItems: {
      type: Array,
      default: () => ['string', 'command', 'javascript'],
    },
  },
  beforeMount() {
    if (!this.value) {
      this.$emit('input', {
        type: 'string',
      });
    }
  },
};
</script>

<style scoped lang="scss">
.command-field {
  .type-selector {
    margin-left: 10px;
  }

  .editor {
    width: 100%;
    height: 100px;
  }

  .editor-text {
    margin-right: 10px;
  }

  & + .command-field {
    margin-top: 5px;
  }
}
</style>
