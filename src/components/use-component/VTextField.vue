<template>
  <v-text-field
    v-if="TFslot"
    :prepend-inner-icon="TFactionPrepend ? TFiconPrepend : ''"
    :append-inner-icon="TFactionAppend ? TFiconAppend : ''"
    :label="TFlabel"
    :type="TFtype"
    variant="solo"
    density="comfortable"
    color="light-black darken-3"
    bg-color="white"
    hide-details
    :clearable="TFclearable"
    :readonly="TFreadonly"
    :disabled="TFdisabled"
  >
    <template v-if="TFiconAppend" v-slot:append-inner>
      <v-icon
        color="light-black darken-3"
        :icon="TFiconAppend"
        size="large"
        @click="clicked()"
      />
    </template>
    <template v-if="TFiconPrepend" v-slot:prepand-inner>
      <v-icon
        color="light-black darken-3"
        :icon="TFiconPrepend"
        size="large"
        @click="clicked()"
      />
    </template>
  </v-text-field>
  <v-text-field
    v-else
    :prepend-inner-icon="TFiconPrepend"
    :append-inner-icon="TFiconAppend"
    :label="TFlabel"
    variant="solo"
    density="comfortable"
    color="light-black darken-3"
    bg-color="white"
    hide-details
    :clearable="TFclearable"
    :readonly="TFreadonly"
    :disabled="TFdisabled"
  />
</template>

<script>
export default {
  props: {
    slotTf: {
      type: Boolean,
      default: false
    },
    actionAppendTf: {
      type: Boolean,
      default: false
    },
    actionPrependTf: {
      type: Boolean,
      default: false
    },
    typeTf: {
      type: String,
      default: ""
    },
    iconPrependTf: {
      type: String,
      default: ""
    },
    iconAppendTf: {
      type: String,
      default: ""
    },
    labelTf: {
      type: String,
      default: ""
    },
    clearableTf: {
      type: Boolean,
      default: false
    },
    readonlyTf: {
      type: Boolean,
      default: false
    },
    disabledTf: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return{
    }
  },
  computed: {
    TFslot() {
      return this.slotTf;
    },
    TFactionAppend() {
      return this.actionAppendTf;
    },
    TFactionPrepend() {
      return this.actionPrependTf;
    },
    TFtype() {
      return this.typeTf;
    },
    TFiconPrepend() {
      return this.iconPrependTf;
    },
    TFiconAppend() {
      return this.iconAppendTf;
    },
    TFlabel() {
      return this.labelTf;
    },
    TFclearable() {
      return this.clearableTf;
    },
    TFreadonly() {
      return this.readonlyTf;
    },
    TFdisabled() {
      return this.disabledTf;
    },
  },
  methods:{
    clicked(){
      this.$emit("prosesicon");
    }
  },
}
</script>