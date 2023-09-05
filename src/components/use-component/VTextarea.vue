<template>
  <v-textarea
    :label="TaLabel"
    rows="4"
    variant="solo"
    density="comfortable"
    color="light-black darken-3"
    bg-color="white"
    hide-details
    :clearable="TaClearable"
    :disabled="TaDisabled"
    :readonly="TaReadonly"
    no-resize
  />
</template>

<script>
export default {
  props: {
    labelTa: {
      type: String,
      default: ""
    },
    clearableTa: {
      type: Boolean,
      default: false
    },
    disabledTa: {
      type: Boolean,
      default: false
    },
    readonlyTa: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return{
      API_URL: process.env.VUE_APP_BASE_URL_VIEW,
    }
  },
  computed: {
    TaLabel() {
      return this.labelTa;
    },
    TaClearable() {
      return this.clearableTa;
    },
    TaDisabled() {
      return this.disabledTa;
    },
    TaReadonly() {
      return this.readonlyTa;
    },
  },
  methods:{},
}
</script>